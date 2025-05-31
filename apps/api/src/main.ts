import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';

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

  await app.listen(process.env.PORT ?? 8080, () => {
    console.log(
      `Server is running on port http://localhost:${process.env.PORT ?? 8080}`,
    );
  });
}
bootstrap();
