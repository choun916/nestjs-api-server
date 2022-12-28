import { Injectable } from "@nestjs/common";
import { CreateCompanyDto } from "src/app/dto/companies/create-company.dto";

@Injectable()
export class CompaniesService {
  create(createCompanyDto: CreateCompanyDto) {
    return "This action adds a new company";
  }
}
