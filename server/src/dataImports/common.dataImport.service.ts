import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

export type commodity = 'cocoa' | 'soy';

@Injectable()
export class CommonDataImportService {
  private logger = new Logger(CommonDataImportService.name);

  constructor(private prisma: PrismaService) {}

  async emptyDbForOrganisation(prismaService: PrismaService, org) {
    await prismaService.satelliteAnalysis.deleteMany({
      where: {
        plot: {
          is: {
            farm: {
              is: {
                organisation: org,
              },
            },
          },
        },
      },
    });
    await prismaService.polygonInteractionWarning.deleteMany({
      where: {
        polygons: {
          every: {
            plot: {
              is: {
                farm: {
                  is: {
                    organisation: org,
                  },
                },
              },
            },
          },
        },
      },
    });
    await prismaService.polygonWarning.deleteMany({
      where: {
        polygon: {
          is: {
            plot: {
              is: {
                farm: {
                  is: {
                    organisation: org,
                  },
                },
              },
            },
          },
        },
      },
    });
    await prismaService.polygon.deleteMany({
      where: {
        plot: {
          is: {
            farm: {
              is: {
                organisation: org,
              },
            },
          },
        },
      },
    });
    await prismaService.plot.deleteMany({
      where: {
        farm: {
          is: {
            organisation: org,
          },
        },
      },
    });
    await prismaService.person.deleteMany({
      where: {
        mainContactPersonFor: {
          every: {
            organisation: org,
          },
        },
      },
    });
    await prismaService.farm.deleteMany({
      where: {
        organisation: org,
      },
    });
    await prismaService.facility.deleteMany({ where: { farm: null } });
  }

  async seedCommodity(commodity: commodity, org: string) {
    let commodityInDb = await this.prisma.crop.findUnique({
      where: {
        shortCode_organisation: {
          shortCode: commodity,
          organisation: org,
        },
      },
    });
    if (!commodityInDb) {
      commodityInDb = await this.prisma.crop.create({
        data: {
          shortCode: commodity,
          name: commodity,
          organisation: org,
        },
      });

      await this.prisma.cropVariety.create({
        data: {
          shortCode: commodity + '-1',
          name: commodity,
          cropId: commodityInDb.id,
          organisation: org,
        },
      });
    }
  }
}
