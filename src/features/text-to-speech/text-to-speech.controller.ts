import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { TextToSpeechSinthesizeResponseDto } from './dtos/text-to-speech-response.dto';
import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechSynthesizeDto } from './dtos/text-to-speech.dto';

@Controller('text-to-speech')
@ApiTags('Text To Speech Controller')
@ApiBasicAuth()
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post('sinthesize')
  @HttpCode(HttpStatus.OK)
  async create(@Body() sinthesizeDto: TextToSpeechSynthesizeDto): Promise<TextToSpeechSinthesizeResponseDto> {
    return await this.textToSpeechService.synthesize(sinthesizeDto.text, sinthesizeDto.contentType);
  }
}
