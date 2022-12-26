import { WinstonModuleOptions } from "nest-winston";
import * as winston from "winston";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import path from "path";

export const winstonConfig: WinstonModuleOptions = {
  silent: false,
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === "production" ? "info" : "silly",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike("App", {
          prettyPrint: true,
          colors: true,
        })
      ),
    }),
  ],
};
