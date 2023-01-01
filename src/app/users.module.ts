import { Module } from "@nestjs/common";
import { UsersService } from "src/app/service/users.service";
import { UsersController } from "src/app/controller/users.controller";
import { UserRepository } from "./repository/users.repository";
import { ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth.module";
import { LocalStrategy } from "./guards/auth/local.strategy";
import { AccessJwtStrategy } from "./guards/auth/access-jwt.strategy";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [
    UsersController
  ],
  providers: [
    ConfigService,
    LocalStrategy,
    AccessJwtStrategy,
    UsersService,
    UserRepository
  ]
})
export class UsersModule { }
