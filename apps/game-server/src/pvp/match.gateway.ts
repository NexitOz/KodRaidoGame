import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import type {
  MatchActionInput,
  MatchActionPayload,
  MatchJoinPayload,
  MatchStatePayload,
} from '@kod-raido/shared';
import type { Socket } from 'socket.io';
import type { JwtPayload } from '../auth/strategies/jwt.strategy';
import { MatchesService } from '../matches/matches.service';
import { buildMatchView } from '../matches/view/match-view';

const FORFEIT_GRACE_MS = 60_000;

interface AuthenticatedSocket extends Socket {
  data: { userId: string };
}

/**
 * Cross-origin here is intentionally permissive (unlike the REST API's
 * WEB_ORIGIN allowlist in main.ts) because the only thing a connecting
 * socket can do without a valid JWT is get disconnected in
 * handleConnection — tightening this to match WEB_ORIGIN is a
 * straightforward follow-up once there's a concrete need.
 */
@WebSocketGateway({ cors: { origin: true, credentials: true }, namespace: '/pvp' })
@Injectable()
export class MatchGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(MatchGateway.name);

  /** Every live socket for a given user (multiple tabs are allowed). */
  private readonly socketsByUser = new Map<string, Set<AuthenticatedSocket>>();
  /** matchId -> participant userIds currently attached to that match's live updates. */
  private readonly matchRooms = new Map<string, Set<string>>();
  /** `${matchId}:${userId}` -> pending forfeit timer, armed while that participant is disconnected. */
  private readonly forfeitTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly jwt: JwtService,
    private readonly matchesService: MatchesService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }
    try {
      const payload = await this.jwt.verifyAsync<JwtPayload>(token);
      (client as AuthenticatedSocket).data = { userId: payload.sub };
      this.registerSocket(payload.sub, client as AuthenticatedSocket);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client as AuthenticatedSocket).data?.userId;
    if (!userId) return;
    this.unregisterSocket(userId, client as AuthenticatedSocket);

    // Another open tab still represents this player — no need to treat them as gone.
    if (this.socketsByUser.get(userId)?.size) return;

    for (const [matchId, participants] of this.matchRooms) {
      if (!participants.has(userId)) continue;
      this.armForfeitTimer(matchId, userId);
      this.broadcastToMatch(
        matchId,
        'match:opponent_disconnected',
        { matchId, graceSeconds: FORFEIT_GRACE_MS / 1000 },
        userId,
      );
    }
  }

  /** Called by MatchmakingService once it pairs two queued players. */
  notifyMatchFound(userId: string, matchId: string): void {
    this.emitToUser(userId, 'match:found', { matchId });
  }

  @SubscribeMessage('match:join')
  async onJoin(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: MatchJoinPayload,
  ): Promise<void> {
    const userId = client.data.userId;
    try {
      const view = await this.matchesService.getView(userId, payload.matchId);
      this.trackParticipant(payload.matchId, userId);
      this.cancelForfeitTimer(payload.matchId, userId);
      this.broadcastToMatch(
        payload.matchId,
        'match:opponent_reconnected',
        { matchId: payload.matchId },
        userId,
      );
      const state: MatchStatePayload = { view, events: [] };
      client.emit('match:state', state);
    } catch (err) {
      client.emit('match:error', { message: this.messageFor(err) });
    }
  }

  @SubscribeMessage('match:action')
  async onAction(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() payload: MatchActionPayload,
  ): Promise<void> {
    const userId = client.data.userId;
    try {
      const result = await this.matchesService.applyPvpAction(
        userId,
        payload.matchId,
        this.toActionDto(payload.action),
      );
      const eventViews = result.events.map((e) => ({ type: e.type, payload: e.payload }));

      for (const participantId of Object.keys(result.state.players)) {
        const view = buildMatchView(result.state, result.matchCtx, participantId);
        const statePayload: MatchStatePayload = {
          view,
          events: eventViews,
          rewards: result.rewardsByPlayer?.[participantId],
        };
        this.emitToUser(participantId, 'match:state', statePayload);
      }

      if (result.state.finished) this.matchRooms.delete(payload.matchId);
    } catch (err) {
      client.emit('match:error', { message: this.messageFor(err) });
    }
  }

  private async handleForfeitTimeout(matchId: string, userId: string): Promise<void> {
    this.forfeitTimers.delete(this.forfeitKey(matchId, userId));
    const result = await this.matchesService.forfeitPvpMatch(matchId, userId);
    if (!result) return;

    const { state, matchCtx, rewardsByPlayer } = result;
    for (const participantId of Object.keys(state.players)) {
      const view = buildMatchView(state, matchCtx, participantId);
      const statePayload: MatchStatePayload = {
        view,
        events: [],
        rewards: rewardsByPlayer[participantId],
      };
      this.emitToUser(participantId, 'match:state', statePayload);
    }
    this.matchRooms.delete(matchId);
  }

  private toActionDto(action: MatchActionInput) {
    switch (action.type) {
      case 'PLAY_CARD':
        return { type: 'PLAY_CARD' as const, cardId: action.cardId, targetId: action.targetId };
      case 'ATTACK':
        return {
          type: 'ATTACK' as const,
          attackerId: action.attackerId,
          targetId: action.targetId,
        };
      case 'END_TURN':
        return { type: 'END_TURN' as const };
    }
  }

  private messageFor(err: unknown): string {
    return err instanceof Error ? err.message : 'Unexpected error.';
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token as string | undefined;
    if (authToken) return authToken;
    const header = client.handshake.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice(7);
    return null;
  }

  private registerSocket(userId: string, socket: AuthenticatedSocket): void {
    const set = this.socketsByUser.get(userId) ?? new Set();
    set.add(socket);
    this.socketsByUser.set(userId, set);
  }

  private unregisterSocket(userId: string, socket: AuthenticatedSocket): void {
    const set = this.socketsByUser.get(userId);
    if (!set) return;
    set.delete(socket);
    if (set.size === 0) this.socketsByUser.delete(userId);
  }

  private emitToUser(userId: string, event: string, payload: unknown): void {
    const sockets = this.socketsByUser.get(userId);
    if (!sockets) return;
    for (const socket of sockets) socket.emit(event, payload);
  }

  private trackParticipant(matchId: string, userId: string): void {
    const set = this.matchRooms.get(matchId) ?? new Set();
    set.add(userId);
    this.matchRooms.set(matchId, set);
  }

  private broadcastToMatch(
    matchId: string,
    event: string,
    payload: unknown,
    excludeUserId?: string,
  ): void {
    const participants = this.matchRooms.get(matchId);
    if (!participants) return;
    for (const userId of participants) {
      if (userId === excludeUserId) continue;
      this.emitToUser(userId, event, payload);
    }
  }

  private forfeitKey(matchId: string, userId: string): string {
    return `${matchId}:${userId}`;
  }

  private armForfeitTimer(matchId: string, userId: string): void {
    const key = this.forfeitKey(matchId, userId);
    if (this.forfeitTimers.has(key)) return;
    const timer = setTimeout(() => {
      this.handleForfeitTimeout(matchId, userId).catch((err: unknown) =>
        this.logger.error(`Forfeit timeout failed for ${key}`, err as Error),
      );
    }, FORFEIT_GRACE_MS);
    this.forfeitTimers.set(key, timer);
  }

  private cancelForfeitTimer(matchId: string, userId: string): void {
    const key = this.forfeitKey(matchId, userId);
    const timer = this.forfeitTimers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.forfeitTimers.delete(key);
    }
  }
}
