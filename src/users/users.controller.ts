import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { RestApiController } from "src/controller/rest-api.controller";
import { UserTokenDto } from "./dto/user-access-token.dto";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { UserProfileDto } from "./dto/user-profile.dto";
import { Public } from "src/decorator/public.decorator";

@Controller("user")
export class UsersController extends RestApiController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Public()
  @Post("join")
  async join(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    this.logger.debug(JSON.stringify(createUserDto));
    return (await this.usersService.create(createUserDto)) === true;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserTokenDto> {
    this.logger.debug(JSON.stringify(loginUserDto));
    return await this.usersService.login(loginUserDto);
  }

  @Get("profile")
  async profile(@Request() req: any): Promise<UserProfileDto> {
    return req.user + 3;
  }

  @Patch(":id")
  async update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<boolean> {
    return;
  }

  @Get("logout")
  logout() { }
}
