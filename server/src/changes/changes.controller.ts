import { Controller, Get, Param } from '@nestjs/common';
import { ChangesService } from './changes.service';
import { PrismaClient } from '@prisma/client';

@Controller()
export class ChangesController {
  constructor(private readonly changesService: ChangesService) {}

  @Get(':org/changes/farms/:id')
  async createCrop(@Param('org') org: string, @Param('id') farmId: string) {
    const prisma = new PrismaClient();

    const farm = await prisma.farm.findUnique({
      where: { id: farmId },
      include: { facility: true },
    });

    if (!farm) {
      throw new Error('Farm not found');
    }

    // Current plots
    const plotIds = await prisma.plot
      .findMany({
        where: { farmId },
        select: { id: true },
      })
      .then((plots) => plots.map((p) => p.id));

    const addedPlotsChanges = this.changesService
      .getMany({
        objectType: 'Plot',
        sourceType: 'create',
        name: 'farmId',
        newValue: farmId,
      })
      .then((result) => result.data);

    const deletedPlotsChanges = this.changesService
      .getMany({
        objectType: 'Plot',
        sourceType: 'delete',
        name: 'farmId',
        newValue: farmId,
      })
      .then((result) => result.data);

    const personChanges = this.changesService
      .getMany({
        objectId: farm.facility.mainContactPersonId,
        objectType: 'Person',
      })
      .then((result) => result.data);

    const facilityChanges = await this.changesService
      .getMany({
        objectId: farm.facilityId,
        objectType: 'Facility',
      })
      .then((result) => result.data);

    const previousMainContactPersonIds = facilityChanges
      .filter(
        (c) => c.name === 'mainContactPersonId' && c.sourceType === 'update',
      )
      .map((c) => c.oldValue);

    return Promise.all([
      this.changesService
        .getMany({
          objectId: farmId,
          objectType: 'Farm',
        })
        .then((result) => result.data),
      facilityChanges,
      ...plotIds.map((id) =>
        this.changesService
          .getMany({
            objectId: id,
            objectType: 'Plot',
          })
          .then((result) => result.data),
      ),
      personChanges,
      ...previousMainContactPersonIds.map((id) =>
        this.changesService
          .getMany({
            objectId: id,
            objectType: 'Person',
          })
          .then((result) => result.data),
      ),
      addedPlotsChanges,
      deletedPlotsChanges,
    ]).then((l) =>
      l
        .flat()
        .sort((a, b) =>
          [a.objectType, a.name, b.startTime.toISOString()]
            .join()
            .localeCompare(
              [b.objectType, b.name, a.startTime.toISOString()].join(),
            ),
        ),
    );
  }
}
