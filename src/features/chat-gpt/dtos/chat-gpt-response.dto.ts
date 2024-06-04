import { IsNotEmpty, IsString } from 'class-validator';
import { SummarizeResponseInterface } from '../../../services/open-ai/interfaces/open-ai-response.interface';

export class SummarizeResponseDto implements SummarizeResponseInterface {
  @IsNotEmpty()
  @IsString()
  text: string;
}
