import { Controller, Get } from "@nestjs/common";
import { MovieService } from "./movie.service";

@Controller("movies")
export class MovieController {
  constructor(private readonly movieServices: MovieService) {}
  @Get()
  getAll() {
    return this.movieServices.findAll();
  }
}
