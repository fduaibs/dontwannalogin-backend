import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBasicAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Adm } from '../../common/decorators/is-adm.decorator';
import { AnnotationsService } from './annotations.service';
import {
  CompareDto,
  CreateAnnotationDto,
  CreatePasswordDto,
  DecryptDto,
  EncryptDto,
  HashDto,
  RemovePasswordDto,
  UpdateAnnotationDto,
  UpdatePasswordDto,
  isPasswordProtectedDto,
} from './dtos/annotations.dto';
import { Annotation, AnnotationDocument } from './schemas/annotation.schema';

@Controller('annotations')
@ApiTags('Annotations Controller')
@ApiBasicAuth()
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova anotação.' })
  async create(@Body() createAnnotationDto: CreateAnnotationDto): Promise<AnnotationDocument> {
    return await this.annotationsService.create(createAnnotationDto);
  }

  @Adm()
  @Get()
  @ApiQuery({ name: 'limit', required: false, description: 'Paginação. Limite de entidades que serão retornadas.' })
  @ApiQuery({ name: 'offset', required: false, description: 'Paginação. Retornar a partir dessa quantidade na lista de entidades.' })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'], description: 'Ordenação. Ascendente ou descendente.' })
  @ApiOperation({ summary: 'Busca todas as anotações.' })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('limit') limit: number = 10, @Query('offset') offset: number = 0, @Query('order') order: string = 'asc'): Promise<AnnotationDocument[]> {
    return await this.annotationsService.findAll(limit, offset, order);
  }

  @Adm()
  @Get(':id')
  @ApiParam({ name: 'id', required: true, description: 'Id da anotação.' })
  @ApiOperation({ summary: 'Busca uma anotação por id.' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<AnnotationDocument> {
    return await this.annotationsService.findOne(id);
  }

  @Get(':aliasOrId/find-by-alias-or-id')
  @ApiQuery({ name: 'auth', required: false, description: 'Senha criptografada da anotação, se houver.' })
  @ApiParam({ name: 'aliasOrId', required: true, description: 'Apelido ou id da anotação.' })
  @ApiOperation({ summary: 'Busca uma anotação por id ou apelido, caso a anotação seja protegida por senha, deve enviar no query params "auth".' })
  @HttpCode(HttpStatus.OK)
  async findByAliasOrId(@Param('aliasOrId') aliasOrId: string, @Query('auth') encryptedCurrentPassword?: string): Promise<Omit<Annotation, 'password'>> {
    return await this.annotationsService.findByAliasOrId(aliasOrId, false, encryptedCurrentPassword);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', required: true, description: 'Id da anotação.' })
  @ApiOperation({ summary: 'Atualiza uma anotação por id.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Param('id') id: string, @Body() updateAnnotationDto: UpdateAnnotationDto): Promise<void> {
    await this.annotationsService.update(id, updateAnnotationDto);
  }

  @Adm()
  @Delete(':id')
  @ApiParam({ name: 'id', required: true, description: 'Id da anotação.' })
  @ApiOperation({ summary: 'Deleta uma anotação por id.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.annotationsService.remove(id);
  }

  @Post('create-password')
  @ApiOperation({ summary: 'Cria uma senha para uma anotação.' })
  @HttpCode(HttpStatus.CREATED)
  async createPassword(@Body() createPasswordDto: CreatePasswordDto): Promise<void> {
    return await this.annotationsService.createPassword(createPasswordDto.aliasOrId, createPasswordDto.newEncryptedPassword);
  }

  @Get(':aliasOrId/is-password-protected')
  @ApiParam({ name: 'aliasOrId', required: true, description: 'Id ou apelido da anotação.' })
  @ApiOperation({ summary: 'Verifica se a anotação é protegida por senha.' })
  @HttpCode(HttpStatus.OK)
  async isPasswordProtected(@Param('aliasOrId') aliasOrId: string): Promise<isPasswordProtectedDto> {
    return await this.annotationsService.isPasswordProtected(aliasOrId);
  }

  @Patch(':aliasOrId/update-password')
  @ApiParam({ name: 'aliasOrId', required: true, description: 'Id ou apelido da anotação.' })
  @ApiOperation({ summary: 'Atualiza a senha de uma anotação.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePassword(@Param('aliasOrId') aliasOrId: string, @Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
    return await this.annotationsService.updatePassword(aliasOrId, updatePasswordDto.currentEncryptedPassword, updatePasswordDto.newEncryptedPassword);
  }

  @Delete(':aliasOrId/remove-password')
  @ApiParam({ name: 'aliasOrId', required: true, description: 'Id ou apelido da anotação.' })
  @ApiOperation({ summary: 'Remove a senha de uma anotação.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePassword(@Param('aliasOrId') aliasOrId: string, @Body() removePasswordDto: RemovePasswordDto): Promise<void> {
    return await this.annotationsService.removePassword(aliasOrId, removePasswordDto.currentEncryptedPassword);
  }

  @Adm()
  @Post('encrypt')
  @ApiOperation({ summary: 'Encripta um texto.' })
  @HttpCode(HttpStatus.OK)
  async encrypt(@Body() encryptDto: EncryptDto): Promise<{ encrypted: string }> {
    const encrypted = await this.annotationsService.encrypt(encryptDto.plainText);

    return { encrypted };
  }

  @Adm()
  @Post('decrypt')
  @ApiOperation({ summary: 'Decripta um texto.' })
  @HttpCode(HttpStatus.OK)
  async decrypt(@Body() decryptDto: DecryptDto): Promise<{ decrypted: string }> {
    const decrypted = await this.annotationsService.decrypt(decryptDto.token);

    return { decrypted };
  }

  @Adm()
  @Post('hash')
  @ApiOperation({ summary: 'Hasheia um texto.' })
  @HttpCode(HttpStatus.OK)
  async hash(@Body() hashDto: HashDto): Promise<{ hashed: string }> {
    const hashed = await this.annotationsService.hash(hashDto.plainText);

    return { hashed };
  }

  @Adm()
  @Post('compare')
  @ApiOperation({ summary: 'Compara se o hash e o texto enviado são válidos.' })
  @HttpCode(HttpStatus.OK)
  async compare(@Body() compareDto: CompareDto): Promise<{ match: boolean }> {
    const match = await this.annotationsService.compare(compareDto.plainText, compareDto.hash);

    return { match };
  }
}
