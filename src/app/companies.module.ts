import { Module } from "@nestjs/common";
import { CompaniesService } from "src/app/service/companies.service";
import { CompaniesController } from "src/app/controller/companies.controller";

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule { }
