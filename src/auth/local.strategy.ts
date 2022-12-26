import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private userService: UsersService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, password: string): Promise<boolean> {
    return true === (await this.userService.validateUser({ email, password }));
  }
}
