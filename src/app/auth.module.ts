import { Module } from "@nestjs/common";
import { AuthService } from "src/app/service/auth.service";

@Module({
  imports: [],
  providers: [AuthService],
})
export class AuthModule {}
