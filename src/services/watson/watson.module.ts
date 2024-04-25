import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IamAuthenticator } from 'ibm-watson/auth';
import * as TextToSpeechV1 from 'ibm-watson/text-to-speech/v1';
import { WatsonService } from './watson.service';

@Module({})
export class WatsonModule {
  static async forRoot(): Promise<DynamicModule> {
    const configService = new ConfigService();

    return {
      module: WatsonModule,
      imports: [],
      providers: [
        {
          provide: 'WATSON_INJECTION_TOKEN',
          useFactory: () => {
            const watson = new TextToSpeechV1({
              authenticator: new IamAuthenticator({
                apikey: configService.get<string>('WATSON_API_KEY'),
              }),
              url: configService.get<string>('WATSON_URL'),
            });

            return watson;
          },
        },
        WatsonService,
      ],
      exports: [WatsonService],
    };
  }
}
