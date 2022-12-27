import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Res, UseInterceptors, Logger } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { RestApiController } from "src/controller/rest-api.controller";
import { UserTokenDto } from "./dto/user-access-token.dto";
import { LocalAuthGuard } from "src/auth/local-auth.guard";
import { UserProfileDto } from "./dto/user-profile.dto";
import { Public } from "src/decorator/public.decorator";
import { Response } from "express";
import { AuthTokenInterceptor } from "src/interceptor/auth-token.interceptor";


@Controller("user")
export class UsersController extends RestApiController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Post("join")
  @Public()
  async join(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    Logger.log(JSON.stringify(createUserDto), 'UsersController.join');
    return (await this.usersService.create(createUserDto)) === true;
  }

  @Public()
  @UseGuards(LocalAuthGuard)

  @Post("login")
  @UseInterceptors(AuthTokenInterceptor)
  async login(
    @Body() loginUserDto: LoginUserDto
  ): Promise<UserTokenDto> {
    Logger.log(JSON.stringify(loginUserDto), 'UsersController.login');
    return await this.usersService.login(loginUserDto);
  }

  @Get("profile")
  async profile(@Req() req: any): Promise<UserProfileDto> {
    return req.user;
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto): Promise<boolean> {
    return;
  }

  @Get("logout")
  logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response) {
    Logger.log(req.user, 'UsersController.logout');
    this.usersService.logout(req.user.id);
    res.set({
      'Authorization': '',
      'X-Access-Token': '',
      'X-Refresh-Token': ''
    });
    return true;
  }
}
