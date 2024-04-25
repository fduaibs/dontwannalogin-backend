import { SinthesizeResponseInterface } from '../../../services/watson/interfaces/watson-response.interface';

export class TextToSpeechSinthesizeResponseDto implements SinthesizeResponseInterface {
  contentType: string;
  data: string;
}
