import { io, type Socket } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';
// The WS gateway lives at the game-server's root (namespace /pvp), not under the REST /api prefix.
const SOCKET_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export function createMatchSocket(accessToken: string): Socket {
  return io(`${SOCKET_ORIGIN}/pvp`, {
    auth: { token: accessToken },
    transports: ['websocket'],
  });
}
