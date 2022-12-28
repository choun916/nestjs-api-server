import { envConfig } from "./config/env.config";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";
import { CompaniesModule } from "./companies/companies.module";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./config/winston.config";
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
