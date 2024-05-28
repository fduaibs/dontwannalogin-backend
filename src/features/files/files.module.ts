import { Module } from '@nestjs/common';
import { FirebaseStorageRepositoryModule } from '../../repository/firebase-storage-repository/firebase-storage.repository.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [FirebaseStorageRepositoryModule.forRoot()],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
