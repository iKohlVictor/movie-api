import { Injectable } from "@nestjs/common";
import { Readable } from "stream";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
});
@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }

  async getMovies() {
    for await (const movie of this.streamMovies(100)) {
      console.log(movie);
    }
  }

  streamMovies(batchSize: number) {
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
}
