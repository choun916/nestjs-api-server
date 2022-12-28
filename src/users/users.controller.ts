import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Res, UseInterceptors, Logger, Delete } from "@nestjs/common";
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
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AppService } from "src/app.service";
import { instanceToPlain } from "class-transformer";

@ApiTags('user')
@Controller("user")
export class UsersController extends RestApiController {

  constructor(private readonly usersService: UsersService) {
    super();
  }

  @ApiOperation({ summary: '회원 가입', description: '' })
  @ApiCreatedResponse({ description: '' })
  @Public()
  @Post("join")
  async join(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    this.logger.debug(JSON.stringify(createUserDto), 'UsersController.join');
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '회원 로그인', description: '' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(AuthTokenInterceptor)
  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserTokenDto> {
    this.logger.debug(JSON.stringify(loginUserDto), 'UsersController.login');
    return await this.usersService.login(loginUserDto);
  }

  @ApiOperation({ summary: '회원 정보 조회', description: '' })
  @Get("profile")
  async profile(@Req() req: any): Promise<UserProfileDto> {
    return req.user;
  }

  @ApiOperation({ summary: '회원 정보 업데이트', description: '' })
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto): Promise<boolean> {
    return;
  }

  @ApiOperation({ summary: '회원 로그아웃', description: '' })
  @Get("logout")
  logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    this.logger.debug(req.user, 'UsersController.logout');
    this.usersService.logout(req.user.id);
    res.set({
      'Authorization': '',
      'X-Access-Token': '',
      'X-Refresh-Token': ''
    });
    return true;
  }

  @ApiOperation({ summary: '회원 탈퇴', description: '' })
  @Delete("delete")
  delete(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    this.logger.debug(req.user, 'UsersController.delete');
    this.usersService.delete(req.user.id);
    res.set({
      'Authorization': '',
      'X-Access-Token': '',
      'X-Refresh-Token': ''
    });
    return true;
  }
}
