import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EncryptService } from '../../encrypt/encrypt.service';

export type AnnotationDocument = Annotation & Document;

@Schema({ timestamps: true })
export class Annotation {
  @Prop({ unique: true, index: true, maxlength: 25 })
  alias?: string;

  @Prop({ maxlength: 32 })
  password?: string;

  @Prop({
    maxlength: 10000,
    set: (data) => {
      return 'teste' + data;
    },
  })
  data?: string;
}

export const AnnotationSchema = SchemaFactory.createForClass(Annotation);
