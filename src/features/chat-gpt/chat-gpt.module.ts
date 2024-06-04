import { Module } from '@nestjs/common';
import { OpenAIModule } from '../../services/open-ai/open-ai.module';
import { ChatGPTController } from './chat-gpt.controller';

@Module({
  imports: [OpenAIModule.forRoot()],
  controllers: [ChatGPTController],
  providers: [],
})
export class ChatGPTModule {}
