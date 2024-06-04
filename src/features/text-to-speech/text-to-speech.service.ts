import { Injectable } from '@nestjs/common';
import { WatsonService } from '../../services/watson/watson.service';

@Injectable()
export class TextToSpeechService {
  constructor(private readonly watsonService: WatsonService) {}

  async synthesize(text: string, contentType?: string) {
    const audioStream = await this.watsonService.synthesize(text, contentType);

    return audioStream;
  }
}
