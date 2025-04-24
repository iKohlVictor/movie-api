import { Injectable } from "@nestjs/common";
import { Readable, Writable } from "stream";
import { PrismaClient } from "@prisma/client";
import { Workbook } from "exceljs";
import { createWriteStream, createReadStream, WriteStream } from "fs";

const prisma = new PrismaClient({
  log: ["query"],
});
@Injectable()
export class AppService {
  async getMovies() {
    return this.streamMovies(1000);
  }

  streamMovies(batchSize: number): Readable {
    let cursorId = undefined;

    return new Readable({
      objectMode: true,
      async read() {
        try {
          const items = await prisma.movie.findMany({
            take: batchSize,
            skip: cursorId ? 1 : 0,
            cursor: cursorId ? { id: cursorId } : undefined,
          });

          if (items.length === 0) {
            this.push(null);
          } else {
            for (const item of items) {
              this.push(item);
            }
            cursorId = items[items.length - 1].id;
          }
        } catch (err) {
          if (err instanceof Error) this.destroy(err);
        }
      },
    });
  }

  createWorksheet(workbook: Workbook) {
    const worksheet = workbook.addWorksheet("Movies");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Title", key: "title", width: 30 },
      { header: "Created_at", key: "created_at", width: 10 },
      { header: "Updated_at", key: "updated_at", width: 10 },
      { header: "Description", key: "description", width: 10 },
      { header: "Release_date", key: "release_date", width: 10 },
      { header: "Rating", key: "rating", width: 10 },
    ];

    return worksheet;
  }

  async getMoviesInFormatExcel(stream: WriteStream) {
    const workbook = new Workbook();
    const worksheet = this.createWorksheet(workbook);
    for await (const movie of this.streamMovies(1000)) {
      worksheet.addRow(movie);
    }
    await workbook.xlsx.write(stream);
  }

  async getMoviesInFormatCSV(stream: WriteStream) {
    const workbook = new Workbook();
    const worksheet = this.createWorksheet(workbook);

    for await (const movie of this.streamMovies(10000)) {
      worksheet.addRow(movie);
    }
    await workbook.csv.write(stream);
  }
}
