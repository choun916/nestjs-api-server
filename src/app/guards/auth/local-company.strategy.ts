import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { CompaniesService } from "src/app/service/companies.service";

@Injectable()
export class LocalCompanyStrategy extends PassportStrategy(Strategy, "local-company") {
  constructor(private companiesService: CompaniesService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<boolean> {
    return await this.companiesService.validateUser({ email, password });
  }
}
