import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";
import { CompaniesModule } from "./companies/companies.module";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./config/winston.config";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    WinstonModule.forRoot(winstonConfig),
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: process.env.JWT_EXPIRES }
    // }),
    UsersModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
