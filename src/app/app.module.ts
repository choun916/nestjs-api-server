import { envConfig } from "src/app/config/env.config";
import { Module } from "@nestjs/common";
import { AppController } from "src/app/controller/app.controller";
import { AppService } from "src/app/service/app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "src/app/config/typeorm.config";
import { UsersModule } from "./users.module";
import { CompaniesModule } from "src/app/companies.module";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "src/app/config/winston.config";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(envConfig),
    WinstonModule.forRoot(winstonConfig),
    TypeOrmModule.forRoot(typeORMConfig),
    UsersModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
