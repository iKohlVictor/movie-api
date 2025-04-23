import { DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Movie } from "./movie.entity";
import { MovieController } from "./movie.controller";
import { MovieService } from "./movie.service";

export class MovieModule {
  static register(): DynamicModule {
    return {
      module: MovieModule,
      imports: [TypeOrmModule.forFeature([Movie])],
      exports: [TypeOrmModule],
      controllers: [MovieController],
      providers: [MovieService],
    };
  }
}
