import { Module } from "@nestjs/common";
import { UsersService } from "src/app/service/users.service";
import { UsersController } from "src/app/controller/users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repository/users.repository";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "src/app/guards/auth/local.strategy";
import { AccessJwtStrategy } from "src/app/guards/auth/access-jwt.strategy";
import { Auth, AuthOptions } from "src/core/domain/auth.domain";

const authOptions: AuthOptions = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
}

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    {
      module: Auth,
      providers: [
        JwtService,
        {
          provide: 'authOptions',
          useValue: authOptions
        }
      ],
      exports: [Auth]
    }
  ],
  controllers: [UsersController],
  providers: [
    ConfigService,
    UsersService,
    UserRepository,
    // JwtService,
    LocalStrategy,
    AccessJwtStrategy
  ],
})
export class UsersModule { }
