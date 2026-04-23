import { Prisma } from '@prisma/client';
import {
  Person as PrismaPerson,
  Contact as PrismaContact,
  Wallet as PrismaWallet,
} from '.prisma/client';
import { locationParentInclude } from '../../locations/locations.service';

const walletWithRelations = Prisma.validator<Prisma.WalletDefaultArgs>()({
  include: {
    contact: true,
  },
});

const contactWithRelations = Prisma.validator<Prisma.ContactDefaultArgs>()({
  include: {
    wallets: true,
  },
});

const personWithRelations = Prisma.validator<Prisma.PersonDefaultArgs>()({
  include: {
    contacts: {
      include: {
        wallets: true,
      },
    },
    mainContactPersonFor: {
      include: {
        location: { include: { ...locationParentInclude } },
        customLocation: {
          include: { ...locationParentInclude },
        },
        coordinate: true,
      },
    },
  },
});

const personWithActivities = Prisma.validator<Prisma.PersonDefaultArgs>()({
  include: { mainContactPersonFor: true, ServiceActivityBeneficiaries: true },
});

export interface Wallet
  extends PrismaWallet,
    Prisma.WalletGetPayload<typeof walletWithRelations> {}

export interface Contact
  extends PrismaContact,
    Prisma.ContactGetPayload<typeof contactWithRelations> {}

export interface Person
  extends PrismaPerson,
    Prisma.PersonGetPayload<typeof personWithRelations> {}

export interface PersonWithServiceActivities
  extends PrismaPerson,
    Prisma.PersonGetPayload<typeof personWithActivities> {}
