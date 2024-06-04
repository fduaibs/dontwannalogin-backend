import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { OpenAIService } from '../../services/open-ai/open-ai.service';
import { SummarizeResponseDto } from './dtos/chat-gpt-response.dto';
import { SummarizeDto } from './dtos/chat-gpt.dto';

@Controller('chat-gpt')
@ApiTags('ChatGPT Controller')
@ApiBasicAuth()
export class ChatGPTController {
  constructor(private readonly openAIService: OpenAIService) {}

  @Post('summarize')
  @HttpCode(HttpStatus.OK)
  async summarize(@Body() summarizeDto: SummarizeDto): Promise<SummarizeResponseDto> {
    return await this.openAIService.summarize(summarizeDto.text);
  }

  @Post('highlight')
  @HttpCode(HttpStatus.OK)
  async highlight(@Body() highlightDto: SummarizeDto): Promise<SummarizeResponseDto> {
    return await this.openAIService.highlight(highlightDto.text);
  }

  @Post('rearrange')
  @HttpCode(HttpStatus.OK)
  async rearrange(@Body() rearrangeDto: SummarizeDto): Promise<SummarizeResponseDto> {
    return await this.openAIService.rearrange(rearrangeDto.text);
  }

  @Post('explain')
  @HttpCode(HttpStatus.OK)
  async explain(@Body() explainDto: SummarizeDto): Promise<SummarizeResponseDto> {
    return await this.openAIService.explain(explainDto.text);
  }

  @Post('questionize')
  @HttpCode(HttpStatus.OK)
  async questionize(@Body() questionizeDto: SummarizeDto): Promise<SummarizeResponseDto> {
    return await this.openAIService.questionize(questionizeDto.text);
  }

  @Post('topify')
  @HttpCode(HttpStatus.OK)
  async topify(@Body() topifyDto: SummarizeDto): Promise<SummarizeResponseDto> {
    return await this.openAIService.topify(topifyDto.text);
  }

  @Post('fix')
  @HttpCode(HttpStatus.OK)
  async fix(@Body() fixDto: SummarizeDto): Promise<SummarizeResponseDto> {
    return await this.openAIService.fix(fixDto.text);
  }
}
