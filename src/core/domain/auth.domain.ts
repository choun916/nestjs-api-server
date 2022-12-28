import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { instanceToPlain } from "class-transformer";
import { string } from "joi";
import { UserProfileDto } from "src/users/dto/user-profile.dto";

interface AuthInterface {
  createAccessToken(userProfileDto: UserProfileDto): string;
  createRefreshToken(userProfileDto: UserProfileDto): string;
  refreshAccessToken(userProfileDto: UserProfileDto): string;
}

export interface AuthOptions {
  JWT_ACCESS_SECRET: string,
  JWT_ACCESS_EXPIRES_IN: string,
  JWT_REFRESH_SECRET: string,
  JWT_REFRESH_EXPIRES_IN: string,
}

@Injectable()
export class Auth implements AuthInterface {

  private readonly accessSignOptions: JwtSignOptions;
  private readonly refreshSignOptions: JwtSignOptions;

  constructor(
    private readonly jwtService: JwtService,
    @Inject('authOptions') private readonly authOptions: AuthOptions
  ) {
    this.accessSignOptions = {
      secret: this.authOptions.JWT_ACCESS_SECRET,
      expiresIn: this.authOptions.JWT_ACCESS_EXPIRES_IN
    };

    this.refreshSignOptions = {
      secret: this.authOptions.JWT_REFRESH_SECRET,
      expiresIn: this.authOptions.JWT_REFRESH_EXPIRES_IN
    };
  }

  /**
   * 인증 토근 생성
   */
  createAccessToken(userProfileDto: UserProfileDto): string {
    return this.jwtService.sign(instanceToPlain(userProfileDto), this.accessSignOptions);
  }

  /**
   * 갱신 토근 생성
   */
  createRefreshToken(userProfileDto: UserProfileDto): string {
    return this.jwtService.sign({ userProfileDto }, this.refreshSignOptions);
  }

  /**
   * 인증 토근 재발급
   */
  refreshAccessToken(userProfileDto: UserProfileDto): string {
    return this.createAccessToken(userProfileDto);
  }
}
