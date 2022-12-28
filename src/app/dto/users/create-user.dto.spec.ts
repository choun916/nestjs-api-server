import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { CreateUserDto } from "./create-user.dto";

describe("CreateUserDto", () => {
  it.each([
    [{ email: "abc@email.com", name: "username", password: "Ab123!@#" }, 0],
    [{ email: "  abc@email.com  ", name: "  username  ", password: "  Ab123!@# ", }, 0,],
    [{ email: "", name: "", password: "" }, 3],
    [{ email: "email@email.com", name: "", password: "" }, 2],
    [{ email: "", name: "username", password: "" }, 2],
    [{ email: "", name: "사용자", password: "" }, 2],
    [{ email: "a@email.kr", name: "이름", password: "123" }, 1],
    [{ email: "a@email.kr", name: "이름", password: "111111111111111111111111length32", }, 0,],
    [{ email: "a@email.kr", name: "이름", password: "1111111111111111111111111length33", }, 1,],
    [{ email: "a@email.kr", name: "이름", password: "🤬🤬" }, 1],
  ])(
    "validate %s return %s",
    async (createUserDto: CreateUserDto, expected: number) => {
      const errors = await validate(plainToClass(CreateUserDto, createUserDto));
      expect(errors.length).toBe(expected);
    }
  );
});
