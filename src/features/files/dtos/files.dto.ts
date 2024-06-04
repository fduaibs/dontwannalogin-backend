import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class FileUploadDto {
  path: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}

export class findAllFilesQueryDto {
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @Min(0)
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number = 0;

  @IsIn(['asc', 'desc'])
  @IsOptional()
  @IsString()
  order?: string = 'asc';
}
