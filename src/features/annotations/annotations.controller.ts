import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Adm } from '../../common/decorators/is-adm.decorator';
import { AnnotationsService } from './annotations.service';
import {
  CreateAnnotationDto,
  CreatePasswordDto,
  RemovePasswordDto,
  UpdateAnnotationDto,
  UpdatePasswordDto,
  isPasswordProtectedDto,
} from './dtos/annotations.dto';
import { AnnotationDocument } from './schemas/annotation.schema';

@Controller('annotations')
@ApiTags('Annotations Controller')
@ApiBasicAuth()
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAnnotationDto: CreateAnnotationDto): Promise<AnnotationDocument> {
    return await this.annotationsService.create(createAnnotationDto);
  }

  @Adm()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'offset', required: false })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  async findAll(@Query('limit') limit: number = 10, @Query('offset') offset: number = 0, @Query('order') order: string = 'asc'): Promise<AnnotationDocument[]> {
    return await this.annotationsService.findAll(limit, offset, order);
  }

  @Adm()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<AnnotationDocument> {
    return await this.annotationsService.findOne(id);
  }

  @Get(':aliasOrId/find-by-alias-or-id')
  @HttpCode(HttpStatus.OK)
  async findByAliasOrId(@Param('aliasOrId') aliasOrId: string): Promise<AnnotationDocument> {
    return await this.annotationsService.findByAliasOrId(aliasOrId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() updateAnnotationDto: UpdateAnnotationDto): Promise<void> {
    await this.annotationsService.update(id, updateAnnotationDto);
  }

  @Adm()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.annotationsService.remove(id);
  }

  @Get(':aliasOrId/is-password-protected')
  @HttpCode(HttpStatus.OK)
  async isPasswordProtected(@Param('aliasOrId') aliasOrId: string): Promise<isPasswordProtectedDto> {
    return await this.annotationsService.isPasswordProtected(aliasOrId);
  }

  @Post('create-password')
  @HttpCode(HttpStatus.CREATED)
  async createPassword(@Body() createPasswordDto: CreatePasswordDto): Promise<void> {
    return await this.annotationsService.createPassword(createPasswordDto.aliasOrId, createPasswordDto.newEncryptedPassword);
  }

  @Post('remove-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePassword(@Body() removePasswordDto: RemovePasswordDto): Promise<void> {
    return await this.annotationsService.removePassword(removePasswordDto.aliasOrId, removePasswordDto.currentEncryptedPassword);
  }

  @Post('update-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
    return await this.annotationsService.updatePassword(
      updatePasswordDto.aliasOrId,
      updatePasswordDto.currentEncryptedPassword,
      updatePasswordDto.newEncryptedPassword,
    );
  }
}
