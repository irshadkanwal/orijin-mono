import {
  Product as PrismaType,
  ProductType as PrismaTypeType,
  Price as PrismaPrice,
  Location,
} from '.prisma/client';
import { CropVariety } from '@prisma/client';

export type ProductType = PrismaTypeType;
export type Price = PrismaPrice;

export interface Product extends PrismaType {
  originLocation?: Location;
  originVariety?: CropVariety;
}
