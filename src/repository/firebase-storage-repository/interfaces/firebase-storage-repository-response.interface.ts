import { UploadMetadata } from 'firebase/storage';

export interface UploadBytesResponseInterface extends UploadMetadata {
  filename: string;
  url: string;
}

export interface GetImageDataResponseInterface {
  originalName?: string;
  contentType?: string;
  size: number;
  downloadURL: string;
}

export interface GetAllImageDataResponseInterface {
  fileDataList: GetImageDataResponseInterface[];
}
