import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`),
});

import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";
import { typeORMConfig } from "../src/config/typeorm.config";
import { UsersModule } from "../src/users/users.module";
import { CreateUserDto } from "../src/users/dto/create-user.dto";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "src/config/winston.config";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { constConfig } from "src/config/const.config";
import { LoginUserDto } from "src/users/dto/login-user.dto";

describe('회원 /user', () => {
  const user = {
    email: Date.now() + ".e2e.test.com",
    name: "e2e user",
    password: "password1234!@#$"
  }
  let _accessToken: string;
  let _refreshToken: string;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('가입 [POST] join', () => {
    return request(app.getHttpServer())
      .post('/user/join')
      .send(user as CreateUserDto)
      .expect(201)
      .then(({ body: { status } }) => {
        expect(status).toEqual('OK');
      });
  });

  it('로그인 [POST] login', () => {
    return request(app.getHttpServer())
      .post('/user/login')
      .send(user as LoginUserDto)
      .expect(201)
      .then(({ body }) => {
        const { status, data: { accessToken, refreshToken } } = body;
        expect(status).toEqual('OK');
        expect(typeof accessToken).toEqual('string');
        expect(typeof refreshToken).toEqual('string');

        _accessToken = accessToken;
        _refreshToken = refreshToken;
      });
  });

  it('프로필 [GET] profile', () => {
    return request(app.getHttpServer())
      .get('/user/profile')
      .set({ 'Authorization': 'Bearer ' + _accessToken })
      .expect(200)
      .then(({ body: { data } }) => {
        expect('id' in data).toEqual(true);
        expect('email' in data).toEqual(true);
        expect('name' in data).toEqual(true);
        expect('password' in data).not.toEqual(true);
      });
  });

  it('로그아웃 [GET] logout', () => {
    return request(app.getHttpServer())
      .get('/user/logout')
      .set({ 'Authorization': 'Bearer ' + _accessToken })
      .expect(200)
      .then(({ body: { status } }) => {
        expect(status).toEqual('OK');
      });
  });

  it('탈퇴 [DELETE] delete', () => {
    return request(app.getHttpServer())
      .delete('/user/delete')
      .set({ 'Authorization': 'Bearer ' + _accessToken })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

});