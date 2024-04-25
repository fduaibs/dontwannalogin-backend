import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { TextToSpeechSinthesizeResponseDto } from './dtos/text-to-speech-response.dto';
import { TextToSpeechSinthesizeDto } from './dtos/text-to-speech.dto';
import { TextToSpeechService } from './text-to-speech.service';

@Controller('text-to-speech')
@ApiTags('Text To Speech Controller')
@ApiBasicAuth()
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post('sinthesize')
  @HttpCode(HttpStatus.OK)
  async create(@Body() sinthesizeDto: TextToSpeechSinthesizeDto): Promise<TextToSpeechSinthesizeResponseDto> {
    return await this.textToSpeechService.sinthesize(sinthesizeDto.text, sinthesizeDto.contentType);
  }
}
