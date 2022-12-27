import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { ExistsException } from "../exceptions/exists.exception";
import { UserRepository } from "./repository/user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { UserProfileDto } from "./dto/user-profile.dto";
import { UserTokenDto } from "./dto/user-access-token.dto";
import { JwtService } from "@nestjs/jwt";
import { instanceToPlain } from "class-transformer";
import { ConfigService } from "@nestjs/config";
import { PasswordHash } from "src/utils/password.hash";

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private userRepository: UserRepository,
    private configService: ConfigService,
    private jwtService: JwtService
  ) { }

  /**
   *
   * @param createUserDto
   * @returns
   */
  async create(createUserDto: CreateUserDto): Promise<boolean> {
    if (await this.userRepository.existsByEmail(createUserDto.email)) {
      throw new ExistsException();
    }
    return await this.userRepository.create(createUserDto);
  }

  /**
   *
   * @param loginUserDto
   * @returns
   */
  async login(loginUserDto: LoginUserDto): Promise<UserTokenDto> {
    let userProfileDto: UserProfileDto;
    let accessToken: string, refreshToken: string;

    try {
      userProfileDto = await this.userRepository.profileByEmail(loginUserDto.email);
      accessToken = this.jwtService.sign(instanceToPlain(userProfileDto), {
        secret: this.configService.get("JWT_ACCESS_SECRET"),
        expiresIn: this.configService.get("JWT_ACCESS_EXPIRES_IN"),
      });

      refreshToken = this.jwtService.sign(instanceToPlain(userProfileDto), {
        secret: this.configService.get("JWT_REFRESH_SECRET"),
        expiresIn: this.configService.get("JWT_REFRESH_EXPIRES_IN"),
      });

      await this.userRepository.updateRefreshToken(
        userProfileDto.email,
        refreshToken
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }

    return { accessToken, refreshToken };
  }

  async logout(userId: number): Promise<void> {
    this.userRepository.removeRefreshToken(userId);
  }

  /**
   *
   * @param loginUserDto
   * @returns
   */
  async validateUser(loginUserDto: LoginUserDto): Promise<boolean> {
    const password = await this.userRepository.passwordByEmail(
      loginUserDto.email
    );
    return (
      (await PasswordHash.verify(loginUserDto.password, password)) === true
    );
  }
}
