import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { ExistsException } from "src/core/exceptions/exists.exception";
import { UserRepository } from "src/app/repository/users.repository";
import { CreateUserDto } from "src/app/dto/users/create-user.dto";
import { LoginUserDto } from "src/app/dto/users/login-user.dto";
import { UserProfileDto } from "src/app/dto/users//user-profile.dto";
import { UserTokenDto } from "src/app/dto/users//user-access-token.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PasswordHash } from "src/core/utils/password.hash";
import { Auth } from "src/core/domain/auth.domain";

@Injectable()
export class UsersService {
  constructor(
    @Inject(UserRepository) private userRepository: UserRepository,
    // private configService: ConfigService,
    // private jwtService: JwtService,
    private auth: Auth
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
      accessToken = this.auth.createAccessToken(userProfileDto);
      refreshToken = this.auth.createRefreshToken(userProfileDto);
      await this.userRepository.updateRefreshToken(userProfileDto.email, refreshToken);
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
    const password = await this.userRepository.passwordByEmail(loginUserDto.email);
    return await PasswordHash.verify(loginUserDto.password, password);
  }

  /**
   * 
   * @param userId 
   */
  async delete(userId: number): Promise<void> {
    await this.userRepository.delete(userId);
  }

}
