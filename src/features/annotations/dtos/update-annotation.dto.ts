import { PartialType } from '@nestjs/swagger';
import { CreateAnnotationDto } from './create-annotation.dto';

export class UpdateAnnotationDto extends PartialType(CreateAnnotationDto) {}
