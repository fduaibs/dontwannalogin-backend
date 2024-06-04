import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { OpenAIService } from '../../services/open-ai/open-ai.service';

@Controller('chat-gpt')
@ApiTags('Chat GPT Controller')
@ApiBasicAuth()
export class ChatGptController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async teste() {
    await this.openAIService.test();
  }
}
