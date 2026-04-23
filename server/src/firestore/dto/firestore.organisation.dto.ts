import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class FireStoreCreateUpdateOrganisationDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  userId: string;

  @IsBoolean()
  @IsOptional()
  isToAddWorkspaces: boolean;
}
