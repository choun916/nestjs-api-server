import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
  type: "mysql",
  replication: {
    master: {
      host: process.env.DB_MASTER_HOST,
      port: parseInt(process.env.DB_MASTER_PORT, 10),
      username: process.env.DB_MASTER_USERNAME,
      password: process.env.DB_MASTER_PASSWORD,
      database: process.env.DB_MASTER_DATABASE,
    },
    slaves: [
      {
        host: process.env.DB_SLAVE_HOST,
        port: parseInt(process.env.DB_SLAVE_PORT, 10),
        username: process.env.DB_SLAVE_USERNAME,
        password: process.env.DB_SLAVE_PASSWORD,
        database: process.env.DB_SLAVE_DATABASE,
      },
    ],
  },
  logging: true,
  entities: ["dist/**/*.entity.{ts,js}"],
  synchronize: false,
};
