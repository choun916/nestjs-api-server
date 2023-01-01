import { PartialType } from "@nestjs/mapped-types";
import { Exclude } from "class-transformer";
import { CreateUserDto } from "./create-user.dto";

@Exclude()
export class UpdateUserDto extends PartialType(CreateUserDto) {}
