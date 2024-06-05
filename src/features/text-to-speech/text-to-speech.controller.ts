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
