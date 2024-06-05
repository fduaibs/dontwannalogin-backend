import {
  GetAllFileDataResponseInterface,
  GetFileDataResponseInterface,
  PaginationMetadataInterface,
} from '../../../repository/firebase-storage-repository/interfaces/firebase-storage-repository-response.interface';

export class FindOneFileResponseDto implements GetFileDataResponseInterface {
  uploadName: string;
  originalName?: string;
  contentType?: string;
  size: number;
  downloadURL: string;
  createdAt: string;
  updatedAt: string;
}

export class PaginationMetadataDto implements PaginationMetadataInterface {
  count: number;
}

export class FindAllFilesResponseDto implements GetAllFileDataResponseInterface {
  fileDataList: FindOneFileResponseDto[];
  metadata: PaginationMetadataDto;
}
