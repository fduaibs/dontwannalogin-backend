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
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBasicAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Sizes } from '../../common/constants/files.constants';
import { CreateFileResponseDto, FindAllFilesResponseDto, FindOneFileResponseDto } from './dtos/files-response.dto';
import { FileUploadDto, findAllFilesQueryDto } from './dtos/files.dto';
import { FilesService } from './files.service';

@Controller('files')
@ApiTags('Files Controller')
@ApiBasicAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FindOneFileResponseDto })
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * Sizes.MB })],
      }),
    )
    file: Express.Multer.File,
    @Body('path') path: string,
  ): Promise<CreateFileResponseDto> {
    return await this.filesService.createOne(path, file.originalname, file.buffer, file.mimetype);
  }

  @Get(':path/:filename')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: FindOneFileResponseDto })
  async findOne(@Param('path') path: string, @Param('filename') filename: string): Promise<FindOneFileResponseDto> {
    return await this.filesService.findOne(path, filename);
  }

  @Get(':path')
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  async findAll(@Param('path') path: string, @Query() queryDto: findAllFilesQueryDto): Promise<FindAllFilesResponseDto> {
    return await this.filesService.findAll(path, queryDto.limit, queryDto.offset, queryDto.order);
  }

  @Delete(':path/:filename')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeOne(@Param('path') path: string, @Param('filename') filename: string): Promise<void> {
    return await this.filesService.removeOne(path, filename);
  }

  @Delete(':path')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll(@Param('path') path: string): Promise<void> {
    return await this.filesService.removeAll(path);
  }
}
