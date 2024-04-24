import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { FirebaseStorageRepository } from './firebase-storage.repository';

@Module({})
export class FirebaseStorageRepositoryModule {
  static async forRoot(): Promise<DynamicModule> {
    const configService = new ConfigService();

    return {
      module: FirebaseStorageRepositoryModule,
      imports: [],
      providers: [
        {
          provide: 'FIREBASE_STORAGE_INJECTION_TOKEN',
          useFactory: () => {
            const app = initializeApp({
              apiKey: configService.get<string>('FIREBASE_API_KEY'),
              authDomain: configService.get<string>('FIREBASE_AUTH_DOMAIN'),
              projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
              storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
              messagingSenderId: configService.get<string>('FIREBASE_MESSAGING_SENDER_ID'),
              appId: configService.get<string>('FIREBASE_APP_ID'),
            });

            return getStorage(app);
          },
        },
        FirebaseStorageRepository,
      ],
      exports: [FirebaseStorageRepository],
    };
  }
}
