import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class RunScoringDto {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  readonly ruleIDs: string[];

  @IsString()
  @IsNotEmpty()
  readonly farmID: string;
}
