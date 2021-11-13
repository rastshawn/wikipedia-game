import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
}

async function bootstrap() {
  //const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create(AppModule, { cors: true }); // TODO remove CORS for release
  app.useWebSocketAdapter(new SocketAdapter(app)); // TODO remove CORS for release
  await app.listen(3000);
}
bootstrap();
