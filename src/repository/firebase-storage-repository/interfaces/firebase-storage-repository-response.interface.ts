import { UploadMetadata } from 'firebase/storage';

export interface UploadBytesResponseInterface extends UploadMetadata {
  filename: string;
  url: string;
}

export interface GetFileDataResponseInterface {
  uploadName: string;
  originalName?: string;
  contentType?: string;
  size: number;
  downloadURL: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllFileDataResponseInterface {
  fileDataList: GetFileDataResponseInterface[];
}
