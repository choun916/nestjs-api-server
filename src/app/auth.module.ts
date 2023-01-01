import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Auth, AuthOptions } from "src/core/domain/auth.domain";

const authOptions: AuthOptions = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
}

@Module({
  imports: [
    PassportModule
  ],
  providers: [
    Auth,
    JwtService,
    {
      provide: 'authOptions',
      useValue: authOptions
    },
  ],
  exports: [
    Auth
  ]
})

export class AuthModule { }
