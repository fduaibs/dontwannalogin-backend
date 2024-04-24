import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './common/auth/auth.module';
import { AnnotationsModule } from './features/annotations/annotations.module';
import { ImagesModule } from './features/images/images.module';
import { OpenAIInternalModule } from './features/open-ai/open-ai-internal.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    AnnotationsModule,
    ImagesModule,
    OpenAIInternalModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
