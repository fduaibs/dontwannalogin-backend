import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptModule } from '../../common/encrypt/encrypt.module';
import { AnnotationsController } from './annotations.controller';
import { AnnotationsService } from './annotations.service';
import { Annotation, AnnotationSchema } from './schemas/annotation.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Annotation.name, schema: AnnotationSchema }]), EncryptModule],
  controllers: [AnnotationsController],
  providers: [AnnotationsService],
})
export class AnnotationsModule {}
