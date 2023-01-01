import { Controller, Post, Body, Delete, Get, Param, Patch, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { CompaniesService } from "src/app/service/companies.service";
import { CreateCompanyDto } from "src/app/dto/companies/create-company.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RestApiController } from "./rest-api.controller";
import { Public } from "../decorator/public.decorator";
import { AuthTokenDto } from "../dto/auth/auth-token.dto";
import { CompanyProfileDto } from "../dto/companies/company-profile.dto";
import { LoginCompanyDto } from "../dto/companies/login-company.dto";
import { UpdateCompanyDto } from "../dto/companies/update-company.dto";
import { AuthTokenInterceptor } from "../interceptors/auth-token.interceptor";
import { Response } from "express";
import { LocalCompanyAuthGuard } from "../guards/auth/local-company-auth.guard";

@ApiTags('company')
@Controller("company")
export class CompaniesController extends RestApiController {

  constructor(private readonly companiesService: CompaniesService) {
    super();
  }

  @Public()
  @Post('join')
  async join(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companiesService.create(createCompanyDto);
  }

  @ApiOperation({ summary: '회원 로그인' })
  @Public()
  @UseGuards(LocalCompanyAuthGuard)
  @UseInterceptors(AuthTokenInterceptor)
  @Post("login")
  async login(@Body() loginCompanyDto: LoginCompanyDto): Promise<AuthTokenDto> {
    return await this.companiesService.login(loginCompanyDto);
  }

  @ApiOperation({ summary: '회원 정보 조회' })
  @Get("profile")
  async profile(@Req() req: any): Promise<CompanyProfileDto> {
    return req.user;
  }

  @ApiOperation({ summary: '회원 정보 업데이트' })
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateCompanyDto: UpdateCompanyDto): Promise<boolean> {
    return;
  }

  @ApiOperation({ summary: '회원 로그아웃' })
  @Get("logout")
  logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    this.companiesService.logout(req.user.id);
    res.set({
      'Authorization': '',
      'X-Access-Token': '',
      'X-Refresh-Token': ''
    });
    return true;
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete("delete")
  delete(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    this.companiesService.delete(req.user.id);
    res.set({
      'Authorization': '',
      'X-Access-Token': '',
      'X-Refresh-Token': ''
    });
    return true;
  }

}
