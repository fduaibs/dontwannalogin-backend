import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { OpenAIService } from './open-ai.service';

@Module({})
export class OpenAIModule {
  static async forRoot(): Promise<DynamicModule> {
    const configService = new ConfigService();

    return {
      module: OpenAIModule,
      imports: [],
      controllers: [],
      providers: [
        {
          provide: 'OPEN_AI_API_TOKEN',
          useFactory: () => {
            return new OpenAI({
              apiKey: configService.get<string>('OPEN_AI_SECRET_KEY'),
            });
          },
        },
        OpenAIService,
      ],
      exports: [OpenAIService],
    };
  }
}
