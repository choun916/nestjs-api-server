import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repository/user.repository";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "src/auth/local.strategy";
import { AccessJwtStrategy } from "src/auth/access-jwt.strategy";

@Module({
  imports: [PassportModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    ConfigService,
    UsersService,
    UserRepository,
    JwtService,
    LocalStrategy,
    AccessJwtStrategy,
  ],
})
export class UsersModule { }
