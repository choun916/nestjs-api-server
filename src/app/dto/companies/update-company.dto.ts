import { PartialType } from "@nestjs/mapped-types";
import { UserDto } from "../users/user.dto";

export class UpdateCompanyDto extends PartialType(UserDto) {}
