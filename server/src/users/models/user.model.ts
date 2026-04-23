import 'reflect-metadata';
import {
  ObjectType,
  registerEnumType,
  HideField,
  Field,
} from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { Post } from '../../posts/models/post.model';
import { BaseGraphqlModel } from '../../common/models/base.graphql.model';
import { Role } from '@prisma/client';

registerEnumType(Role, {
  name: 'Role',
  description: 'User role',
});

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum UserType {
  Organisation = 'Organisation',
  Farmer = 'Farmer',
  Picker = 'Picker',
  Officer = 'Officer',
  FarmEmployee = 'FarmEmployee',
  FactoryEmployee = 'FactoryEmployee',
}

@ObjectType()
export class User extends BaseGraphqlModel {
  @Field()
  @IsEmail()
  email: string;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => Role)
  role: Role;

  @Field(() => [Post], { nullable: true })
  posts?: [Post] | null;

  @HideField()
  password: string;

  picture: string;
  type: UserType;
  phone: string;
  phone2: string;

  name: string;
  nickName: string;
  gender: Gender;
  dob: Date;
  dobApproximate: boolean;
  identificationNumber: string;
  identificationNumberType: string;
  education: string;
  maritalStatus: string;
}
