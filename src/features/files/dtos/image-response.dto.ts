import {
  GetAllFileDataResponseInterface,
  GetFileDataResponseInterface,
} from '../../../repository/firebase-storage-repository/interfaces/firebase-storage-repository-response.interface';

export class FindOneResponseDto implements GetFileDataResponseInterface {
  originalName?: string;
  contentType?: string;
  size: number;
  downloadURL: string;
}

export class FindAllResponseDto implements GetAllFileDataResponseInterface {
  fileDataList: FindOneResponseDto[];
}
