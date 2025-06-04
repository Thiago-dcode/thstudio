import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { LanguageMiddleware } from '@common/middlewares/language.middleware';
import { RequestService } from '@common/services/request/request.service';
import { PrismaService } from '@common/services/db/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const config = new DocumentBuilder()
    .setTitle('Camera hub API')
    .setDescription('API for camera hub')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  await app.listen(process.env.PORT ?? 8080, () => {
    console.log(
      `Server is running on port http://localhost:${process.env.PORT ?? 8080}`,
    );
  });
}
bootstrap();
