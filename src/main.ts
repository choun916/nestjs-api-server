import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`),
});

import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app/app.module";
import { ValidationPipe } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "src/app/config/winston.config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: process.env.NODE_ENV != "development",
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('API Document')
    .setDescription('The API description')
    .setVersion('1.0')

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.NODE_APP_PORT);
}
bootstrap();
