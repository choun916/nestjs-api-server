import { PickType } from "@nestjs/mapped-types";
import { UserDto } from "../users/user.dto";

export class LoginCompanyDto extends PickType(UserDto, [
  "email",
  "password",
]) { }
