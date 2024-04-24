import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Sizes } from '../../common/constants/files.constants';
import { FindAllResponseDto, FindOneResponseDto } from './dtos/image-response.dto';
import { FileUploadDto } from './dtos/image.dto';
import { ImagesService } from './images.service';

@Controller('images')
@ApiTags('Images Controller')
@ApiBasicAuth()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * Sizes.MB })],
      }),
    )
    file: Express.Multer.File,
    @Body('path') path: string,
  ): Promise<void> {
    await this.imagesService.createOne(path, file.originalname, file.buffer, file.mimetype);
  }

  @Get(':path/:filename')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FindOneResponseDto })
  async findOne(@Param('path') path: string, @Param('filename') filename: string): Promise<FindOneResponseDto> {
    return await this.imagesService.findOne(path, filename);
  }

  @Get(':path')
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('path') path: string): Promise<FindAllResponseDto> {
    return await this.imagesService.findAll(path);
  }

  @Delete(':path/:filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOne(@Param('path') path: string, @Param('filename') filename: string): Promise<void> {
    return await this.imagesService.removeOne(path, filename);
  }

  @Delete(':path')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll(@Param('path') path: string): Promise<void> {
    return await this.imagesService.removeAll(path);
  }
}
