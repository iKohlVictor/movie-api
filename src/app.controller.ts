import { Controller, Get, Query, Res } from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { WriteStream } from "fs";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getMovies() {
    return this.appService.getMovies();
  }

  @Get("movies/:format")
  async getMoviesInFormatExcelOrCSV(
    @Query("format") format: string,
    @Res() res: Response
  ) {
    const filename = format === "xlsx" ? "movies.xlsx" : "movies.csv";
    if (format === "xlsx") {
      res.set({
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      });
    } else {
      res.set({
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      });
    }

    if (format === "xlsx") {
      await this.appService.getMoviesInFormatExcel(
        res as unknown as WriteStream
      );
    } else {
      await this.appService.getMoviesInFormatCSV(res as unknown as WriteStream);
    }
    res.end();
  }

  @Get("movies/json")
  async getMoviesJson(@Res() res: Response) {
    res.setHeader("Content-Type", "application/json");
    res.write("[");
    let first = true;

    for await (const movie of this.appService.streamMovies(100)) {
      if (!first) {
        res.write(",");
      }
      res.write(JSON.stringify(movie));
      first = false;
    }

    res.write("]");
    res.end();
  }
}
