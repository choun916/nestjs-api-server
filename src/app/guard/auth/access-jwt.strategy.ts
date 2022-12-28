import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { plainToInstance } from "class-transformer";
import { UserProfileDto } from "src/app/dto/users/user-profile.dto";

const ACCESS_JWT = 'access-jwt';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, ACCESS_JWT) {
  /**
   *
   * @param configService
   */
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_SECRET"),
    });
  }

  /**
   *
   * @param payload
   * @returns
   */
  async validate(payload: any): Promise<any> {
    Logger.log(payload, "AccessJwtStrategy.validate");
    return plainToInstance(UserProfileDto, payload);
  }
}
