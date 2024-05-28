import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FirebaseStorage, UploadMetadata, deleteObject, getDownloadURL, getMetadata, listAll, ref, uploadBytes } from 'firebase/storage';
import { GetAllFileDataResponseInterface, GetFileDataResponseInterface } from './interfaces/firebase-storage-repository-response.interface';

@Injectable()
export class FirebaseStorageRepository {
  constructor(@Inject('FIREBASE_STORAGE_INJECTION_TOKEN') private readonly firebaseStorage: FirebaseStorage) {}

  async uploadBytes(path: string, filename: string, fileData: any, contentType: string): Promise<void> {
    const uuid = randomUUID();

    const fileExtensionRegex = /\.[a-zA-Z0-9]+?$/g;

    const fileExtension = filename?.match(fileExtensionRegex)[0];

    const uploadName = `${path}/${uuid}${fileExtension}`;

    const storageRef = ref(this.firebaseStorage, uploadName);

    const metadata: UploadMetadata = {
      contentType: contentType,
      customMetadata: {
        originalName: filename,
      },
    };

    await uploadBytes(storageRef, fileData, metadata);
  }

  async getDownloadUrl(path: string, filename: string): Promise<GetFileDataResponseInterface> {
    const storageRef = ref(this.firebaseStorage, `${path}/${filename}`);

    const downloadURL = await getDownloadURL(storageRef);

    const { name, customMetadata, contentType, size } = await getMetadata(storageRef);

    return {
      uploadName: name,
      originalName: customMetadata?.originalName,
      contentType: contentType,
      size: size,
      downloadURL,
    };
  }

  async getAllDownloadUrls(path: string): Promise<GetAllFileDataResponseInterface> {
    const storageRef = ref(this.firebaseStorage, path);

    const children = await listAll(storageRef);

    const fileDataPromiseList = children.items.map((child) => {
      const downloadUrlPromise = getDownloadURL(child);
      const metadataPromise = getMetadata(child);

      return Promise.all([downloadUrlPromise, metadataPromise]);
    });

    const fileDataList = await Promise.all(fileDataPromiseList);

    const fileDataListMapped: GetFileDataResponseInterface[] = fileDataList.map((fileData) => ({
      uploadName: fileData[1].name,
      orinalName: fileData[1].customMetadata?.originalName,
      contentType: fileData[1].contentType,
      size: fileData[1].size,
      downloadURL: fileData[0],
    }));

    return { fileDataList: fileDataListMapped };
  }

  async deleteOneObject(path: string, filename: string): Promise<void> {
    const storageRef = ref(this.firebaseStorage, `${path}/${filename}`);

    await deleteObject(storageRef);
  }

  async deleteAllObjects(path: string): Promise<void> {
    const storageRef = ref(this.firebaseStorage, path);

    const children = await listAll(storageRef);

    const deletePromiseList = children.items.map((child) => {
      return deleteObject(child);
    });

    await Promise.all(deletePromiseList);
  }
}
