import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async update(id: string, updateAnnotationDto: UpdateAnnotationDto) {
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
