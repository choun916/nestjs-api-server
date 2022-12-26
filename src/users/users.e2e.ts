import { INestApplication } from "@nestjs/common";

describe("Users", () => {
  let app: INestApplication;
  app.close();
  const usersService = {
    create: () => ["test"],
  };
});
