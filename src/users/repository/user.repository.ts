import {
  BadRequestException,
  Logger,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../entities/user.entity";
import { CreateUserDto } from "../dto/create-user.dto";
import { Repository } from "typeorm";
import { UserProfileDto } from "../dto/user-profile.dto";
import { instanceToPlain, plainToInstance } from "class-transformer";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) { }

  async profileByEmail(email: string): Promise<UserProfileDto> {
    const data = instanceToPlain(await this.repository.findOneBy({ email }));
    return plainToInstance(UserProfileDto, data);
  }

  async existsByEmail(email: string): Promise<boolean> {
    return (await this.repository.countBy({ email })) > 0;
  }

  async passwordByEmail(email: string): Promise<string> {
    const { password } = await this.repository.findOneBy({ email });
    if (!password) {
      throw new Error("bad request");
    }
    return password;
  }

  async create({ email, name, password }: CreateUserDto): Promise<boolean> {
    try {
      await this.repository.save(
        this.repository.create({
          email,
          name,
          password,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        {
          reload: false,
        }
      );
    } catch (error) {
      throw new HttpException(
        `[${error.errno}:${error.code}] ${error.name} - ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }

    return true;
  }

  async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
    try {
      const userEntity: UserEntity = this.repository.create({ refreshToken });
      Logger.log(userEntity, "UserRepository.updateRefreshToken");
      await this.repository.update({ email }, userEntity);
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
