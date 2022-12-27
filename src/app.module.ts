import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeORMConfig } from "./config/typeorm.config";
import { UsersModule } from "./users/users.module";
import { CompaniesModule } from "./companies/companies.module";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./config/winston.config";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { constConfig } from "./config/const.config";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({
      validationSchema: Joi.object({ 
        NODE_ENV: Joi.valid(...constConfig.NODE_ENV_LIST).required(),
        DB_MASTER_HOST: Joi.string().valid().required(),
        DB_MASTER_USERNAME: Joi.string().required(),
        DB_MASTER_PASSWORD: Joi.string().required(),
        DB_MASTER_DATABASE: Joi.string().required(),
        DB_SLAVE_HOST: Joi.string().required(),
        DB_SLAVE_USERNAME: Joi.string().required(),
        DB_SLAVE_PASSWORD: Joi.string().required(),
        DB_SLAVE_DATABASE: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_ACCESS_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_EXPIRES_IN: Joi.string().required()
      })
    }),
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
export class AppModule { }
