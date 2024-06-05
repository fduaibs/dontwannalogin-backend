import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { FirebaseStorage, UploadMetadata, deleteObject, getDownloadURL, getMetadata, listAll, ref, uploadBytes } from 'firebase/storage';
import { GetAllFileDataResponseInterface, GetFileDataResponseInterface } from './interfaces/firebase-storage-repository-response.interface';

@Injectable()
export class FirebaseStorageRepository {
  constructor(@Inject('FIREBASE_STORAGE_INJECTION_TOKEN') private readonly firebaseStorage: FirebaseStorage) {}

  async uploadBytes(path: string, filename: string, fileData: any, contentType: string): Promise<GetFileDataResponseInterface> {
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

    const bytesReturn = await uploadBytes(storageRef, fileData, metadata);

    const downloadURL = await getDownloadURL(bytesReturn.ref);

    return {
      uploadName: bytesReturn.metadata.name,
      originalName: bytesReturn.metadata.customMetadata.originalName,
      contentType: bytesReturn.metadata.contentType,
      size: bytesReturn.metadata.size,
      downloadURL,
      createdAt: bytesReturn.metadata.timeCreated,
      updatedAt: bytesReturn.metadata.updated,
    };
  }

  async getDownloadUrl(path: string, filename: string): Promise<GetFileDataResponseInterface> {
    const storageRef = ref(this.firebaseStorage, `${path}/${filename}`);

    const downloadURL = await getDownloadURL(storageRef);

    const { name, customMetadata, contentType, size, timeCreated, updated } = await getMetadata(storageRef);

    return {
      uploadName: name,
      originalName: customMetadata?.originalName,
      contentType: contentType,
      size: size,
      downloadURL,
      createdAt: timeCreated,
      updatedAt: updated,
    };
  }

  async getAllDownloadUrls(path: string, limit?: number, offset?: number, order?: string): Promise<GetAllFileDataResponseInterface> {
    const storageRef = ref(this.firebaseStorage, path);

    const children = await listAll(storageRef);

    const fileDataPromiseList = children.items.map((child) => {
      const downloadUrlPromise = getDownloadURL(child);
      const metadataPromise = getMetadata(child);

      return Promise.all([downloadUrlPromise, metadataPromise]);
    });

    const fileDataList = await Promise.all(fileDataPromiseList);

    const fileDataListMapped: GetFileDataResponseInterface[] = fileDataList.map((fileData) => ({
      uploadName: fileData[1]?.name,
      originalName: fileData[1]?.customMetadata?.originalName,
      contentType: fileData[1]?.contentType,
      size: fileData[1]?.size,
      downloadURL: fileData[0],
      createdAt: fileData[1]?.timeCreated,
      updatedAt: fileData[1]?.updated,
    }));

    const fileDataListSorted =
      order === 'asc'
        ? fileDataListMapped.sort((fileA, fileB) => fileA.updatedAt.localeCompare(fileB.updatedAt))
        : fileDataListMapped.sort((fileA, fileB) => fileB.updatedAt.localeCompare(fileA.updatedAt));

    const fileDataListSliced = fileDataListSorted.slice(offset, offset + limit);

    return { fileDataList: fileDataListSliced || [], metadata: { count: fileDataListSorted.length } };
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
