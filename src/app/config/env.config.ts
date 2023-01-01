import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`),
});
import { ConfigModuleOptions } from "@nestjs/config";
import * as Joi from "joi";
import { constConfig } from "./const.config";

export const envConfig: ConfigModuleOptions = {
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
};
