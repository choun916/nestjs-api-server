import { PickType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { UserDto } from "../users/user.dto";

@Exclude()
export class CreateCompanyDto extends PickType(UserDto, [
  "email",
  "name",
  "password",
]) { }
