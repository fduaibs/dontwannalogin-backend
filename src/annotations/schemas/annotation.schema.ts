import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AnnotationDocument = Annotation & Document;

@Schema({ timestamps: true })
export class Annotation {
  @Prop({ unique: true, index: true, maxlength: 25 })
  alias?: string;

  @Prop({ maxlength: 32 })
  password?: string;

  @Prop({ maxlength: 10000 })
  data?: string;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
