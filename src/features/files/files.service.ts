import { Injectable } from '@nestjs/common';
import { FirebaseStorageRepository } from '../../repository/firebase-storage-repository/firebase-storage.repository';
import {
  GetAllFileDataResponseInterface,
  GetFileDataResponseInterface,
} from '../../repository/firebase-storage-repository/interfaces/firebase-storage-repository-response.interface';

@Injectable()
export class FilesService {
  constructor(private readonly firebaseStorageRepository: FirebaseStorageRepository) {}

  async createOne(path: string, filename: string, fileData: any, contentType: string): Promise<void> {
    await this.firebaseStorageRepository.uploadBytes(path, filename, fileData, contentType);
  }

  async findOne(path: string, filename: string): Promise<GetFileDataResponseInterface> {
    return await this.firebaseStorageRepository.getDownloadUrl(path, filename);
  }

  async findAll(path: string, limit?: number, offset?: number, order?: string): Promise<GetAllFileDataResponseInterface> {
    return await this.firebaseStorageRepository.getAllDownloadUrls(path, limit, offset, order);
  }

  async removeOne(path: string, filename: string): Promise<void> {
    return await this.firebaseStorageRepository.deleteOneObject(path, filename);
  }

  async removeAll(path: string): Promise<void> {
    return await this.firebaseStorageRepository.deleteAllObjects(path);
  }
}
