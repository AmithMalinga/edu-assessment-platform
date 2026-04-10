import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const port = Number(process.env.PORT ?? 3001);
    const host = '0.0.0.0';

    const config = new DocumentBuilder()
        .setTitle('Edu Assessment Platform API')
        .setDescription('API for the Education Assessment Platform')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(port, host);
    console.log(`Server is running on: ${await app.getUrl()}`);
    console.log(`Swagger docs available at: ${await app.getUrl()}/api`);
}
bootstrap();
