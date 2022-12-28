import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";
import { UserTokenDto } from "src/app/dto/users/user-access-token.dto";

@Injectable()
export class AuthTokenInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data) => {
        const userTokenDto: UserTokenDto = plainToInstance(UserTokenDto, data);
        context.switchToHttp().getResponse().set({
          'Authorization': 'Bearer ' + userTokenDto.accessToken,
          'X-Access-Token': userTokenDto.accessToken,
          'X-Refresh-Token': userTokenDto.refreshToken
        });
        return data;
      })
    );
  }
}
