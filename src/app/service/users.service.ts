import { Injectable } from "@nestjs/common";
import { ExistsException } from "src/core/exceptions/exists.exception";
import { UserRepository } from "src/app/repository/users.repository";
import { CreateUserDto } from "src/app/dto/users/create-user.dto";
import { LoginUserDto } from "src/app/dto/users/login-user.dto";
import { UserProfileDto } from "src/app/dto/users//user-profile.dto";
import { AuthTokenDto } from "src/app/dto/auth/auth-token.dto";;
import { PasswordHash } from "src/core/utils/password.hash";
import { Auth } from "src/core/domain/auth.domain";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auth: Auth
  ) { }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    if (await this.userRepository.existsByEmail(createUserDto.email)) {
      throw new ExistsException();
    }
    return await this.userRepository.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthTokenDto> {
    let userProfileDto: UserProfileDto;
    let accessToken: string, refreshToken: string;

    userProfileDto = await this.userRepository.profileByEmail(loginUserDto.email);
    accessToken = this.auth.createAccessToken(userProfileDto);
    refreshToken = this.auth.createRefreshToken(userProfileDto);
    await this.userRepository.updateRefreshToken(userProfileDto.email, refreshToken);

    return { accessToken, refreshToken };
  }

  async logout(userId: number): Promise<void> {
    this.userRepository.removeRefreshToken(userId);
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<boolean> {
    const password = await this.userRepository.passwordByEmail(loginUserDto.email);
    return await PasswordHash.verify(loginUserDto.password, password);
  }

  async delete(userId: number): Promise<void> {
    await this.userRepository.deleteById(userId);
  }

}
