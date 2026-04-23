import { IsNotEmpty } from 'class-validator';
import { UserType } from '../../users/models/user.model';

abstract class AbstractDto {
  organisation: string;

  @IsNotEmpty()
  shortCode: string;

  externalFirstName: string;

  externalLastName: string;

  phone?: string;

  contactId: string;
  contactCode: string;
}

export class WalletsDtoCsv extends AbstractDto {}
export class WalletsDto extends AbstractDto {
  id?: string;
}

//TODO: we can get rid of all these and use prisma param types
export class WalletsDtoConnected extends WalletsDto {
  contact: {
    connect: { id: string };
  };
}
