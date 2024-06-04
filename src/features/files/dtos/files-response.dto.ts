import {
  GetAllFileDataResponseInterface,
  GetFileDataResponseInterface,
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

export class FindAllFilesResponseDto implements GetAllFileDataResponseInterface {
  fileDataList: FindOneFileResponseDto[];
}
