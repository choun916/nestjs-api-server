import { envConfig } from "src/app/config/env.config";
import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as request from "supertest";
import { typeORMConfig } from "src/app/config/typeorm.config";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "src/app/config/winston.config";
import { ConfigModule } from "@nestjs/config";
import { CompaniesModule } from "src/app/companies.module";
import { CreateCompanyDto } from "src/app/dto/companies/create-company.dto";
import { LoginCompanyDto } from "src/app/dto/companies/login-company.dto";

describe('기업 회원 /company', () => {
  const company = {
    email: Date.now() + ".e2e.test.com",
    name: "e2e company",
    password: "password1234!@#$"
  }
  let _accessToken: string;
  let _refreshToken: string;

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(envConfig),
        WinstonModule.forRoot(winstonConfig),
        TypeOrmModule.forRoot(typeORMConfig),
        CompaniesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('가입 [POST] join', () => {
    return request(app.getHttpServer())
      .post('/company/join')
      .send(company as CreateCompanyDto)
      .expect(201)
      .then(({ body: { status } }) => {
        expect(status).toEqual('OK');
      });
  });

  it('로그인 [POST] login', () => {
    return request(app.getHttpServer())
      .post('/company/login')
      .send(company as LoginCompanyDto)
      .expect(201)
      .then(({ body }) => {
        const { status, data: { accessToken, refreshToken } } = body;
        expect(status).toEqual('OK');
        expect(accessToken).toBeDefined();
        expect(refreshToken).toBeDefined();
        expect(typeof accessToken).toEqual('string');
        expect(typeof refreshToken).toEqual('string');

        _accessToken = accessToken;
        _refreshToken = refreshToken;
      });
  });

  it('프로필 [GET] profile', () => {
    return request(app.getHttpServer())
      .get('/company/profile')
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
      .get('/company/logout')
      .set({ 'Authorization': 'Bearer ' + _accessToken })
      .expect(200)
      .then(({ body: { status } }) => {
        expect(status).toEqual('OK');
      });
  });

  it('탈퇴 [DELETE] delete', () => {
    return request(app.getHttpServer())
      .delete('/company/delete')
      .set({ 'Authorization': 'Bearer ' + _accessToken })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });

});