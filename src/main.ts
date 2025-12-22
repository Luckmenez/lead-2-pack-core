import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: true, // Em produção, especificar origins permitidas
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  if (configService.get('SWAGGER_ENABLED', 'true') === 'true') {
    const config = new DocumentBuilder()
      .setTitle(configService.get('SWAGGER_TITLE', 'Lead2Pack API'))
      .setDescription(
        configService.get(
          'SWAGGER_DESCRIPTION',
          'Marketplace B2B de Embalagens - API com Clean Architecture',
        ),
      )
      .setVersion(configService.get('SWAGGER_VERSION', '1.0'))
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = configService.get('PORT', 3000);
  await app.listen(port);

  console.log(`🚀 Application running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
  console.log(`🔗 API prefix: /${apiPrefix}`);
}

bootstrap();
