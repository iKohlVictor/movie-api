import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./common/config/prisma.service";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MovieModule } from "./core/movie.module";

@Module({
  imports: [
    PrismaModule.register(),
    // MovieModule.register(),
    // TypeOrmModule.forRoot({
    //   type: "mysql",
    //   host: "localhost",
    //   port: 3307,
    //   username: "root",
    //   password: "admin",
    //   database: "db",
    //   autoLoadEntities: true,
    //   synchronize: false,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
