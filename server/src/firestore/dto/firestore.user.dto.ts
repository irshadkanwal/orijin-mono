import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class ReferenceIdDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  refCollection: string;

  @IsNotEmpty()
  isPreviousVersion: boolean;
}
export class FireStoreCreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}

export class FireStoreUpdateUserDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsArray()
  @IsOptional()
  ids: any[];
}

export class FireStoreDeleteUsersDto {
  @IsArray()
  @IsNotEmpty()
  ids: any[];
}
