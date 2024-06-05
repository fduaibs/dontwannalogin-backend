import { Inject, Injectable } from '@nestjs/common';
import * as TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import internal from 'stream';
import { SinthesizeResponseInterface } from './interfaces/watson-response.interface';

@Injectable()
export class WatsonService {
  constructor(@Inject('WATSON_INJECTION_TOKEN') private readonly watson: TextToSpeechV1) {}

  async sinthesize(text: string, contentType?: string): Promise<SinthesizeResponseInterface> {
    const synthesizeParams = {
      text: text,
      accept: contentType || 'audio/wav',
      voice: 'pt-BR_IsabelaV3Voice',
    };

    const response = await this.watson.synthesize(synthesizeParams);

    const buffer = await this.watson.repairWavHeaderStream(response.result as internal.Readable);

    const bufferString64 = buffer.toString('base64');

    return {
      contentType: synthesizeParams.accept,
      data: bufferString64,
    };
  }
}
