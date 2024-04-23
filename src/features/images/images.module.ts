import { Module } from '@nestjs/common';
import { FirebaseStorageRepositoryModule } from '../../repository/firebase-storage-repository/firebase-storage.repository.module';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [FirebaseStorageRepositoryModule.forRoot()],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
