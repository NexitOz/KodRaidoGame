import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.track.findMany({ orderBy: { createdAt: 'desc' } });
  }
}
