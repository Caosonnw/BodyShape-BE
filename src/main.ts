import { AppModule } from '@/app.module';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(express.static('.'));
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Body Shape API')
    .setDescription('Body Shape API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(process.env.PORT_BE ?? 8080, '0.0.0.0');
  console.log(
    `Swagger: http://localhost:${process.env.PORT_BE ?? 8080}/swagger`,
  );
}
bootstrap();

//  ngrok http 8080
