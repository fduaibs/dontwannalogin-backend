import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnnotationsService } from './annotations.service';
import { AnnotationsController } from './annotations.controller';
import { Annotation, AnnotationSchema } from './schemas/annotation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Annotation.name, schema: AnnotationSchema },
    ]),
  ],
  controllers: [AnnotationsController],
  providers: [AnnotationsService],
})
export class AnnotationsModule {}
