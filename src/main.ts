import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { SwaggerUiOptions } from '@nestjs/swagger/dist/interfaces/swagger-ui-options.interface';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder().addBasicAuth().setTitle('DontWannaLogin API').setDescription('Description').setVersion('1.0').build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const swaggerCustomOptions: SwaggerUiOptions = { defaultModelRendering: 'model', defaultModelsExpandDepth: 99, defaultModelExpandDepth: 99 };

  SwaggerModule.setup('api', app, document, { swaggerOptions: swaggerCustomOptions });

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port || 3000);
}

bootstrap();
