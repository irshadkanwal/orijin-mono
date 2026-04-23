import { IsNotEmpty, IsString } from 'class-validator';

abstract class AbstractDto {
  organisation: string;

  @IsString()
  @IsNotEmpty()
  shortCode: string | null;

  firstName: string;

  lastName: string;

  @IsString()
  @IsNotEmpty()
  type: string;
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
  personId: string;
  personCode: string;
  // address String?
  // primary Boolean?
  // registeredUnderPrincipalsName Boolean?
  // registeredForMobileMoney Boolean?
}

export class ContactsDtoCsv extends AbstractDto {}
export class ContactsDto extends AbstractDto {}

//TODO: we can get rid of all these and use prisma param types
export class ContactsDtoConnected extends ContactsDto {
  person: {
    connect: { id: string };
  };
}
