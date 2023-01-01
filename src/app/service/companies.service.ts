import { Injectable } from "@nestjs/common";
import { CreateCompanyDto } from "src/app/dto/companies/create-company.dto";
import { Auth } from "src/core/domain/auth.domain";
import { ExistsException } from "src/core/exceptions/exists.exception";
import { PasswordHash } from "src/core/utils/password.hash";
import { AuthTokenDto } from "../dto/auth/auth-token.dto";
import { CompanyProfileDto } from "../dto/companies/company-profile.dto";
import { LoginCompanyDto } from "../dto/companies/login-company.dto";
import { CompaniesRepository } from "../repository/companies.repository";

@Injectable()
export class CompaniesService {
  constructor(
    private readonly companiesRepository: CompaniesRepository,
    private readonly auth: Auth
  ) { }

  async create(createCompanyDto: CreateCompanyDto) {
    if (await this.companiesRepository.existsByEmail(createCompanyDto.email)) {
      throw new ExistsException();
    }
    return await this.companiesRepository.create(createCompanyDto);
  }

  async login(loginCompanyDto: LoginCompanyDto): Promise<AuthTokenDto> {
    let companyProfileDto: CompanyProfileDto;
    let accessToken: string, refreshToken: string;

    companyProfileDto = await this.companiesRepository.profileByEmail(loginCompanyDto.email);
    accessToken = this.auth.createAccessToken(companyProfileDto);
    refreshToken = this.auth.createRefreshToken(companyProfileDto);
    await this.companiesRepository.updateRefreshToken(companyProfileDto.email, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(companyId: number): Promise<void> {
    this.companiesRepository.removeRefreshToken(companyId);
  }

  async validateUser(loginCompanyDto: LoginCompanyDto): Promise<boolean> {
    const password = await this.companiesRepository.passwordByEmail(loginCompanyDto.email);
    return await PasswordHash.verify(loginCompanyDto.password, password);
  }

  async delete(companyId: number): Promise<void> {
    await this.companiesRepository.deleteById(companyId);
  }
}
