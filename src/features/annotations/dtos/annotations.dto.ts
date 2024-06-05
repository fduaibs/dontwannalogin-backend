import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnnotationDto {
  @IsOptional()
  @IsString()
  alias?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  data?: string;
}

export class UpdateAnnotationDto extends PartialType(CreateAnnotationDto) {}

export class isPasswordProtectedDto {
  @IsBoolean()
  isPasswordProtected: boolean;
}

export class CreatePasswordDto {
  @IsNotEmpty()
  @IsString()
  aliasOrId: string;

  @IsNotEmpty()
  @IsString()
  newEncryptedPassword: string;
}

export class RemovePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentEncryptedPassword: string;
}

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentEncryptedPassword: string;

  @IsNotEmpty()
  @IsString()
  newEncryptedPassword: string;
}

export class EncryptDto {
  @IsNotEmpty()
  @IsString()
  plainText: string;
}

export class DecryptDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export class HashDto {
  @IsNotEmpty()
  @IsString()
  plainText: string;
}

export class CompareDto {
  @IsNotEmpty()
  @IsString()
  plainText: string;

  @IsNotEmpty()
  @IsString()
  hash: string;
}
