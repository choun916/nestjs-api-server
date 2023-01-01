import { PickType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { UserDto } from "../users/user.dto";

@Exclude()
export class CompanyProfileDto extends PickType(UserDto, [
  "id",
  "email",
  "name",
]) {}
