import { IsNotEmpty } from 'class-validator';
import { UserType } from '../../users/models/user.model';

export class LotsDtoCsv {}
export class LotsDto {
  id?: string;
  organisation:string
}

//TODO: we can get rid of all these and use prisma param types
export class LotsDtoConnected extends LotsDto {}
