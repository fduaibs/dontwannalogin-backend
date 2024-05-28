import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  path: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
