import { PartialType } from '@nestjs/swagger';

export class CreateAnnotationDto {
  alias?: string;
  password?: string;
  data?: string;
}

export class UpdateAnnotationDto extends PartialType(CreateAnnotationDto) {}

export class isPasswordProtectedDto {
  isPasswordProtected: boolean;
}
