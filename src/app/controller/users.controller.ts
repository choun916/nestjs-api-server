import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Res, UseInterceptors, Delete } from "@nestjs/common";
import { UsersService } from "src/app/service/users.service";
import { CreateUserDto } from "src/app/dto/users/create-user.dto";
import { UpdateUserDto } from "src/app/dto/users/update-user.dto";
import { LoginUserDto } from "src/app/dto/users/login-user.dto";
import { UserTokenDto } from "src/app/dto/users/user-access-token.dto";
import { UserProfileDto } from "src/app/dto/users/user-profile.dto";
import { RestApiController } from "src/app/controller/rest-api.controller";
import { LocalAuthGuard } from "src/app/guards/auth/local-auth.guard";
import { Public } from "src/app/decorator/public.decorator";
import { Response } from "express";
import { AuthTokenInterceptor } from "src/app/interceptors/auth-token.interceptor";
import { ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('user')
@Controller("user")
export class UsersController extends RestApiController {

  constructor(private readonly usersService: UsersService) {
    super();
  }

  @ApiOperation({ summary: '회원 가입' })
  @Public()
  @Post("join")
  async join(@Body() createUserDto: CreateUserDto): Promise<boolean> {
    return await this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: '회원 로그인' })
  @Public()
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(AuthTokenInterceptor)
  @Post("login")
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserTokenDto> {
    return await this.usersService.login(loginUserDto);
  }

  @ApiOperation({ summary: '회원 정보 조회' })
  @Get("profile")
  async profile(@Req() req: any): Promise<UserProfileDto> {
    return req.user;
  }

  @ApiOperation({ summary: '회원 정보 업데이트' })
  @Patch(":id")
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto): Promise<boolean> {
    return;
  }

  @ApiOperation({ summary: '회원 로그아웃' })
  @Get("logout")
  logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    this.usersService.logout(req.user.id);
    res.set({
      'Authorization': '',
      'X-Access-Token': '',
      'X-Refresh-Token': ''
    });
    return true;
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete("delete")
  delete(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    this.usersService.delete(req.user.id);
    res.set({
      'Authorization': '',
      'X-Access-Token': '',
      'X-Refresh-Token': ''
    });
    return true;
  }
}
