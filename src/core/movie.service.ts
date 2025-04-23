import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Movie } from "./movie.entity";
import { Repository } from "typeorm";

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie) private movieRepository: Repository<Movie>
  ) {}

  findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }
}
