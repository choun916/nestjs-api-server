import { Controller, Post, Body } from "@nestjs/common";
import { CompaniesService } from "src/app/service/companies.service";
import { CreateCompanyDto } from "src/app/dto/companies/create-company.dto";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { RestApiController } from "./rest-api.controller";

@ApiTags('company')
@Controller("company")
export class CompaniesController extends RestApiController {
  constructor(private readonly companiesService: CompaniesService) {
    super();
  }

  @Post('join')
  join(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }
  
}
