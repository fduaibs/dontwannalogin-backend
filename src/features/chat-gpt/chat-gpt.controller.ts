import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { OpenAIService } from '../../services/open-ai/open-ai.service';

@Controller('chat-gpt')
@ApiTags('ChatGPT Controller')
@ApiBasicAuth()
export class ChatGPTController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async teste() {
    await this.openAIService.test();
  }
}
