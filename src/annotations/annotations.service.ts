import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Annotation, AnnotationDocument } from './schemas/annotation.schema';
import { CreateAnnotationDto } from './dtos/create-annotation.dto';
import { UpdateAnnotationDto } from './dtos/update-annotation.dto';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectModel(Annotation.name)
    private readonly annotationModel: Model<AnnotationDocument>,
  ) {}

  async create(
    createAnnotationDto: CreateAnnotationDto,
  ): Promise<AnnotationDocument> {
    const createdAnnotation = new this.annotationModel(createAnnotationDto);

    if (!createdAnnotation.alias) {
      createdAnnotation.alias = createdAnnotation._id;
    }

    const savedEntry = await createdAnnotation.save();

    return savedEntry;
  }

  async findAll(): Promise<AnnotationDocument[]> {
    const foundAnnotationList = await this.annotationModel.find({});
    return foundAnnotationList;
  }

  async findOne(id: string): Promise<AnnotationDocument> {
    const foundAnnotation = await this.annotationModel.findById(id);

    return foundAnnotation;
  }

  async findByAliasOrId(aliasOrId: string): Promise<AnnotationDocument> {
    const foundAnnotationByAlias = await this.annotationModel.findOne({
      alias: aliasOrId,
    });

    if (!foundAnnotationByAlias && isValidObjectId(aliasOrId)) {
      const foundAnnotationById = await this.annotationModel.findById(
        aliasOrId,
      );

      if (!foundAnnotationById)
        throw new NotFoundException('Apelino ou Id da página não encontrado');
    }

    return foundAnnotationByAlias;
  }

  async update(id: string, updateAnnotationDto: UpdateAnnotationDto) {
    const { alias, password, data } = updateAnnotationDto;

    if (!alias) {
      const updatedAnnotation = await this.annotationModel.updateOne(
        { _id: id },
        updateAnnotationDto,
      );

      return updatedAnnotation;
    }

    const foundAlias = await this.findByAliasOrId(alias);

    if (foundAlias) {
      throw new UnprocessableEntityException('Esse apelido já está em uso');
    }

    const updatedAnnotation = await this.annotationModel.updateOne(
      { _id: id },
      updateAnnotationDto,
    );

    return updatedAnnotation;
  }

  async remove(id: string) {
    const removedAnnotation = await this.annotationModel.deleteOne({
      _id: id,
    });

    return removedAnnotation;
  }
}
