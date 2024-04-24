import {
  GetAllImageDataResponseInterface,
  GetImageDataResponseInterface,
} from '../../../repository/firebase-storage-repository/interfaces/firebase-storage-repository-response.interface';

export class FindOneResponseDto implements GetImageDataResponseInterface {
  originalName?: string;
  contentType?: string;
  size: number;
  downloadURL: string;
}

export class FindAllResponseDto implements GetAllImageDataResponseInterface {
  fileDataList: FindOneResponseDto[];
}
