import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { EncryptService } from '../../common/encrypt/encrypt.service';
import { CreateAnnotationDto, UpdateAnnotationDto, isPasswordProtectedDto } from './dtos/annotations.dto';
import { Annotation, AnnotationDocument } from './schemas/annotation.schema';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectModel(Annotation.name)
    private readonly annotationModel: Model<AnnotationDocument>,
    private readonly encryptService: EncryptService,
  ) {}

  async create(createAnnotationDto: CreateAnnotationDto): Promise<AnnotationDocument> {
    const createdAnnotation = new this.annotationModel(createAnnotationDto);

    if (!createdAnnotation.alias) {
      createdAnnotation.alias = createdAnnotation._id;
    }

    const savedEntry = await createdAnnotation.save();

    return savedEntry;
  }

  async findAll(limit?: number, skip?: number, order?: string): Promise<AnnotationDocument[]> {
    const foundAnnotationList = await this.annotationModel.find({}, {}, { limit: limit, skip: skip, sort: { createdAt: order } });

    return foundAnnotationList;
  }

  async findOne(id: string): Promise<AnnotationDocument> {
    const foundAnnotation = await this.annotationModel.findById(id);

    return foundAnnotation;
  }

  async findByAliasOrId(aliasOrId: string, skipNotFoundErrors?: boolean, encryptedCurrentPassword?: string): Promise<AnnotationDocument> {
    if (!isValidObjectId(aliasOrId)) {
      const foundAnnotationByAlias = await this.annotationModel.findOne({
        alias: aliasOrId,
      });

      if (!foundAnnotationByAlias && !skipNotFoundErrors) throw new NotFoundException('Apelido ou id da página não encontrado');

      if (!this.isPasswordProtected(aliasOrId)) return foundAnnotationByAlias;

      const decryptedCurrentPassword = await this.encryptService.aesDecrypt(encryptedCurrentPassword);

      const isPasswordMatch = await this.encryptService.bCryptMatch(decryptedCurrentPassword, foundAnnotationByAlias?.password);

      if (!isPasswordMatch) throw new ForbiddenException('Senha inválida');

      return foundAnnotationByAlias;
    }

    const foundAnnotationById = await this.annotationModel.findById(aliasOrId);

    if (!foundAnnotationById && !skipNotFoundErrors) throw new NotFoundException('Apelido ou id da página não encontrado');

    if (!this.isPasswordProtected(aliasOrId)) return foundAnnotationById;

    const decryptedCurrentPassword = await this.encryptService.aesDecrypt(encryptedCurrentPassword);

    const isPasswordMatch = await this.encryptService.bCryptMatch(decryptedCurrentPassword, foundAnnotationById?.password);

    if (!isPasswordMatch) throw new ForbiddenException('Senha inválida');

    return foundAnnotationById;
  }

  async update(id: string, updateAnnotationDto: UpdateAnnotationDto) {
    const { alias, password, data } = updateAnnotationDto;

    if (!alias) {
      const updatedAnnotation = await this.annotationModel.updateOne({ _id: id }, updateAnnotationDto);

      return updatedAnnotation;
    }

    const foundAlias = await this.findByAliasOrId(alias, true);

    if (foundAlias) {
      throw new UnprocessableEntityException('Esse apelido já está em uso');
    }

    const updatedAnnotation = await this.annotationModel.updateOne({ _id: id }, updateAnnotationDto);

    return updatedAnnotation;
  }

  async remove(id: string) {
    const removedAnnotation = await this.annotationModel.deleteOne({
      _id: id,
    });

    return removedAnnotation;
  }

  async isPasswordProtected(aliasOrId: string): Promise<isPasswordProtectedDto> {
    const foundAnnotation = await this.annotationModel.findOne({ alias: aliasOrId });

    return { isPasswordProtected: Boolean(foundAnnotation.password) };
  }

  async createPassword(aliasOrId: string, encryptedNewPassword: string) {
    const isPasswordProtected = await this.isPasswordProtected(aliasOrId);

    if (isPasswordProtected) throw new UnprocessableEntityException('Já existe senha');

    const decryptedNewPassword = await this.encryptService.aesDecrypt(encryptedNewPassword);

    const hashedNewPassword = await this.encryptService.bCryptHash(decryptedNewPassword);

    await this.annotationModel.findOneAndUpdate({ alias: aliasOrId }, { password: hashedNewPassword });
  }

  async removePassword(aliasOrId: string, currentEncryptedPassword: string): Promise<void> {
    const foundAnnotation = await this.annotationModel.findOne({ alias: aliasOrId }).lean();

    const plainTextPassword = await this.encryptService.aesDecrypt(currentEncryptedPassword);

    const isAllowed = await this.encryptService.bCryptMatch(plainTextPassword, foundAnnotation?.password);

    if (!isAllowed) throw new UnauthorizedException('Senha atual inválida');

    await this.annotationModel.findOneAndUpdate({ alias: aliasOrId }, { password: '' });
  }

  async updatePassword(aliasOrId: string, currentEncryptedPassword: string, newEncryptedPassword: string): Promise<void> {
    const foundAnnotation = await this.annotationModel.findOne({ alias: aliasOrId }).lean();

    const plainTextCurrentPassword = await this.encryptService.aesDecrypt(currentEncryptedPassword);

    const isAllowed = await this.encryptService.bCryptMatch(plainTextCurrentPassword, foundAnnotation?.password);

    if (!isAllowed) throw new UnauthorizedException('Senha atual inválida');

    const plainTextNewPassword = await this.encryptService.aesDecrypt(newEncryptedPassword);

    const hashedNewPassword = await this.encryptService.bCryptHash(plainTextNewPassword);

    await this.annotationModel.findOneAndUpdate({ alias: aliasOrId }, { password: hashedNewPassword });
  }
}
