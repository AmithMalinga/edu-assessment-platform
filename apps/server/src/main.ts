import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // Swagger temporarily disabled due to type conflicts
    // const config = new DocumentBuilder()
    //     .setTitle('Edu Assessment Platform API')
    //     .setDescription('The API description for the Education Assessment Platform')
    //     .setVersion('1.0')
    //     .addBearerAuth()
    //     .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('api', app, document);

    await app.listen(3001);
    console.log(`Server is running on: ${await app.getUrl()}`);
}
bootstrap();
