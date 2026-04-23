import { Prisma } from '@prisma/client';
import { Change as PrismaChange } from '.prisma/client';

const changeWithRelations = Prisma.validator<Prisma.ChangeDefaultArgs>()({
  // FIXME:
});

export interface Change
  extends PrismaChange,
    Prisma.ChangeGetPayload<typeof changeWithRelations> {
  sourceType: ChangeSourceType | string;
}

export type ChangeSourceType = 'create' | 'update' | 'delete';
