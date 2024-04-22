import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { Adm } from '../../common/decorators/is-adm.decorator';
import { AnnotationsService } from './annotations.service';
import { CreateAnnotationDto } from './dtos/create-annotation.dto';
import { UpdateAnnotationDto } from './dtos/update-annotation.dto';
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
  async findAll(): Promise<AnnotationDocument[]> {
    return await this.annotationsService.findAll();
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
}
