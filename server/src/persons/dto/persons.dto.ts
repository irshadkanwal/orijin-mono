import { IsNotEmpty } from 'class-validator';
import { UserType } from '../../users/models/user.model';

abstract class AbstractDto {
  @IsNotEmpty()
  organisation: string;

  @IsNotEmpty()
  shortCode: string | null;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  middleName?: string;

  @IsNotEmpty()
  type: UserType;

  email?: string;
  phone?: string;
  gender?: string;

  identificationNumber?: string;
  identificationNumberType?: string;

  education?: string;
  maritalStatus?: string;
}

export class PersonsDtoCsv extends AbstractDto {
  dateOfBirth: string;
  dateOfBirthApproximate?: string;
}
export class PersonsDto extends AbstractDto {
  id?: string;
  dateOfBirth?: Date;
  dateOfBirthApproximate?: boolean;
}

//TODO: we can get rid of all these and use prisma param types
export class PersonsDtoConnected extends PersonsDto {}
