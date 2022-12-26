import { PickType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { UserDto } from "./user.dto";

@Exclude()
export class UserProfileDto extends PickType(UserDto, [
  "id",
  "email",
  "name",
]) {}
