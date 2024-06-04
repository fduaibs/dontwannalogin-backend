import { Body, Controller, HttpCode, HttpStatus, Post, StreamableFile } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Readable } from 'stream';
import { TextToSpeechSynthesizeDto } from './dtos/text-to-speech.dto';
import { TextToSpeechService } from './text-to-speech.service';

@Controller('text-to-speech')
@ApiTags('Text To Speech Controller')
@ApiBasicAuth()
export class TextToSpeechController {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Post('synthesize')
  @HttpCode(HttpStatus.OK)
  async create(@Body() synthesizeDto: TextToSpeechSynthesizeDto): Promise<StreamableFile> {
    const fileBuffer = await this.textToSpeechService.synthesize(synthesizeDto.text, synthesizeDto.contentType);

    return new StreamableFile(fileBuffer as Readable);
  }
}
