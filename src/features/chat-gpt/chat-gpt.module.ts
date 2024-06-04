import { Module } from '@nestjs/common';
import { OpenAIModule } from '../../services/open-ai/open-ai.module';
import { ChatGptController } from './chat-gpt.controller';

@Module({
  imports: [OpenAIModule.forRoot()],
  controllers: [ChatGptController],
  providers: [],
})
export class ChatGptModule {}
