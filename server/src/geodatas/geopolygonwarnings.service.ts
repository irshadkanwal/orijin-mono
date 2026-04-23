import { Injectable } from '@nestjs/common';
import { PolygonInteractionWarning } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class PolygonWarningService {
  constructor(private prisma: PrismaService) {}

  async fixPolygonInteractionWarnings(
    interactionWarning: PolygonInteractionWarning,
  ) {
    return this.prisma.polygonInteractionWarning.update({
      where: { id: interactionWarning.id },
      data: {
        fixed: true,
      },
    });
  }

  async createPolygonInteractionWarnings(interactionWarning) {
    return this.prisma.polygonInteractionWarning.create({
      data: interactionWarning,
    });
  }

  async fixInactivePolygonWarnings(polygonId: string) {
    const res = this.prisma.polygonInteractionWarning.updateMany({
      where: { polygons: { some: { id: polygonId } }, fixed: false },
      data: {
        fixed: true,
      },
    });
    return res;
  }
}
