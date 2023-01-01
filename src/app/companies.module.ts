import { Module } from "@nestjs/common";
import { CompaniesService } from "src/app/service/companies.service";
import { CompaniesController } from "src/app/controller/companies.controller";
import { AuthModule } from "./auth.module";
import { CompaniesRepository } from "./repository/companies.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CompanyEntity } from "./entities/company.entity";
import { ConfigService } from "@nestjs/config";
import { AccessJwtStrategy } from "./guards/auth/access-jwt.strategy";
import { LocalCompanyStrategy } from "./guards/auth/local-company.strategy";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([CompanyEntity])
  ],
  controllers: [
    CompaniesController
  ],
  providers: [
    ConfigService,
    LocalCompanyStrategy,
    AccessJwtStrategy,
    CompaniesService,
    CompaniesRepository,
  ],
})
export class CompaniesModule { }
