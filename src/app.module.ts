import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './common/auth/auth.module';
import { AnnotationsModule } from './features/annotations/annotations.module';
import { ChatGPTModule } from './features/chat-gpt/chat-gpt.module';
import { FilesModule } from './features/files/files.module';
import { TextToSpeechModule } from './features/text-to-speech/text-to-speech.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AnnotationsModule,
    FilesModule,
    TextToSpeechModule,
    AuthModule,
    ChatGPTModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
