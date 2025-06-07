import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { EnvService } from '@/env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const envService = app.get(EnvService)

  const rabbitUrl = envService.get('RABBIT_HOST')

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: 'auth_queue',
    },
  });

  await app.startAllMicroservices();
  
  const port = envService.get('AUTH_PORT') ?? 3000;
  console.log('[BOOTSTRAP] Auth microservice will listen on port:', port);

  await app.listen(port);

  console.log('Auth microservice is listening on port', port);


  console.log('Auth microservice is listening on RabbitMQ')
}
bootstrap()

// import { NestFactory } from '@nestjs/core';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { AppModule } from '@/app.module';


// async function bootstrap() {
  
//   const app = await NestFactory.createMicroservice<MicroserviceOptions>(
//     AppModule,
//     {
//       transport: Transport.RMQ,
//       options: {
//         urls: [process.env.RABBITMQ_URL ],
//         queue: 'auth_queue'
//       }
//     }
//   )
//   app.listen().then(() => {
//   console.log('Auth microservice is listening on RabbitMQ');
// });
// }
// bootstrap();
