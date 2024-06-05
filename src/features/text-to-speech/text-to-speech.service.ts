import { Injectable } from '@nestjs/common';
import { SinthesizeResponseInterface } from '../../services/watson/interfaces/watson-response.interface';
import { WatsonService } from '../../services/watson/watson.service';

@Injectable()
export class TextToSpeechService {
  constructor(private readonly watsonService: WatsonService) {}

  async synthesize(text: string, contentType?: string): Promise<SinthesizeResponseInterface> {
    return await this.watsonService.sinthesize(text, contentType);
  }
}
