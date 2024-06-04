import { Inject, Injectable } from '@nestjs/common';
import * as TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';

@Injectable()
export class WatsonService {
  constructor(@Inject('WATSON_INJECTION_TOKEN') private readonly watson: TextToSpeechV1) {}

  async synthesize(text: string, contentType?: string) {
    const synthesizeParams = {
      text: text,
      accept: contentType || 'audio/mp3',
      voice: 'pt-BR_IsabelaV3Voice',
    };

    const response = await this.watson.synthesize(synthesizeParams);

    return response.result;
  }
}
