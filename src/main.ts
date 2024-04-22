import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().addBasicAuth().setTitle('DontWannaLogin API').setDescription('Description').setVersion('1.0').build();

  const document = SwaggerModule.createDocument(app, config);

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  SwaggerModule.setup('api', app, document);

  app.enableCors();

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port || 3000);
}

bootstrap();
