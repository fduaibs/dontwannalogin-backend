import { Module } from '@nestjs/common';
import { WatsonModule } from '../../services/watson/watson.module';
import { TextToSpeechController } from './text-to-speech.controller';
import { TextToSpeechService } from './text-to-speech.service';

@Module({
  imports: [WatsonModule.forRoot()],
  controllers: [TextToSpeechController],
  providers: [TextToSpeechService],
})
export class TextToSpeechModule {}
