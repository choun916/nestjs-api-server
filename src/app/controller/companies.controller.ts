import { Controller, Post, Body } from "@nestjs/common";
import { CompaniesService } from "src/app/service/companies.service";
import { CreateCompanyDto } from "src/app/dto/companies/create-company.dto";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }
}
