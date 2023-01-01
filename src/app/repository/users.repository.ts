import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/app/entities/user.entity";
import { DataSource } from "typeorm";
import { UsersAbstractRepository } from "./users.abstract.repository";

@Injectable()
export class UserRepository extends UsersAbstractRepository {

  constructor(protected dataSource: DataSource) {
    super(UserEntity, dataSource);
  }

  // async profileByEmail(email: string): Promise<UserProfileDto> {
  //   const data = instanceToPlain(await this.findOneBy({ email }));
  //   return plainToInstance(UserProfileDto, data);
  // }

  // async existsByEmail(email: string): Promise<boolean> {
  //   try {
  //     return (await this.countBy({ email })) > 0;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // async passwordByEmail(email: string): Promise<string> {
  //   const { password } = await this.findOneBy({ email });
  //   if (!password) {
  //     throw new Error("bad request");
  //   }
  //   return password;
  // }

  // async create({ email, name, password }: CreateUserDto): Promise<boolean> {
  //   try {
  //     const createdAt = new Date(), updatedAt = new Date();
  //     await this.save(
  //       this.manager.create(UserEntity, { email, name, password, createdAt, updatedAt }),
  //       { reload: false }
  //     );
  //   } catch (error) {
  //     throw new HttpException(
  //       `[${error.errno}:${error.code}] ${error.name} - ${error.message}`,
  //       HttpStatus.BAD_REQUEST
  //     );
  //   }
  //   return true;
  // }

  // async updateRefreshToken(email: string, refreshToken: string): Promise<void> {
  //   await this.update({ email }, this.manager.create(UserEntity, { refreshToken }));
  // }

  // async removeRefreshToken(userId: number): Promise<void> {
  //   await this.update(userId, {
  //     refreshToken: null
  //   });
  // }

  // async deleteById(userId: number): Promise<void> {
  //   await this.delete(userId);
  // }
}
