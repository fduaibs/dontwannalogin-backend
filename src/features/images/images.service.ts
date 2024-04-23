import { Injectable } from '@nestjs/common';
import { FirebaseStorageRepository } from '../../repository/firebase-storage-repository/firebase-storage.repository';
import {
  GetAllImageDataResponseInterface,
  GetImageDataResponseInterface,
} from '../../repository/firebase-storage-repository/interfaces/firebase-storage-repository-response.interface';

@Injectable()
export class ImagesService {
  constructor(private readonly firebaseStorageRepository: FirebaseStorageRepository) {}

  async createOne(path: string, filename: string, fileData: any, contentType: string) {
    return await this.firebaseStorageRepository.uploadBytes(path, filename, fileData, contentType);
  }

  async findOne(path: string, filename: string): Promise<GetImageDataResponseInterface> {
    return await this.firebaseStorageRepository.getDownloadUrl(path, filename);
  }

  async findAll(path: string): Promise<GetAllImageDataResponseInterface> {
    return await this.firebaseStorageRepository.getAllDownloadUrls(path);
  }

  async removeOne(path: string, filename: string): Promise<void> {
    return await this.firebaseStorageRepository.deleteOneObject(path, filename);
  }

  async removeAll(path: string): Promise<void> {
    return await this.firebaseStorageRepository.deleteAllObjects(path);
  }
}
