import { DynamicModule, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

export class PrismaModule {
  static register(): DynamicModule {
    return {
      module: PrismaModule,
      global: true,
      providers: [PrismaService],
      exports: [PrismaService],
    };
  }
}
