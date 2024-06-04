import { IsNotEmpty, IsString } from 'class-validator';

export class SummarizeDto {
  @IsNotEmpty()
  @IsString()
  text: string;
}
