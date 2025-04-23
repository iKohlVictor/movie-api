import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaClient } from "@prisma/client";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3333;
  await app.listen(port);
}
bootstrap();
