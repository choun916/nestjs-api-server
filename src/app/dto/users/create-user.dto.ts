import { PickType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { UserDto } from "./user.dto";

@Exclude()
export class CreateUserDto extends PickType(UserDto, [
  "email",
  "name",
  "password",
]) { }
