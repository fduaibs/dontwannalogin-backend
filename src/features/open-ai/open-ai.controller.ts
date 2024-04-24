import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/is-public.decorator';
import { OpenAIService } from '../../services/open-ai/open-ai.service';

@Controller('open-ai')
@ApiTags('Open AI Controller')
@ApiBasicAuth()
export class OpenAIController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async teste() {
    await this.openAIService.test();
  }
}
