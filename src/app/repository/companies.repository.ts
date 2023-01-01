import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { CompanyEntity } from "../entities/company.entity";
import { UsersAbstractRepository } from "./users.abstract.repository";

@Injectable()
export class CompaniesRepository extends UsersAbstractRepository {
  constructor(protected dataSource: DataSource) {
    super(CompanyEntity, dataSource)
  }
}
