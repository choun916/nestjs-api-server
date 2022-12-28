import { Exclude, Expose, Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
} from "class-validator";

@Exclude()
export class UserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsEmail()
  @Length(1, 100)
  @Transform((param) => param.value.trim())
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  @Matches(/^[a-z가-힣0-9\s]*$/i)
  @Transform((param) => param.value.trim())
  name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @Transform((param) => param.value.trim())
  @Matches(/^[a-z0-9!@#$%^&*()_+\-=]{8,32}$/i)
  password: string;
}
