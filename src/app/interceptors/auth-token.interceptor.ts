import { CallHandler, ExecutionContext, Injectable, NestInterceptor, } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";
import { AuthTokenDto } from "src/app/dto/auth/auth-token.dto";

@Injectable()
export class AuthTokenInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data) => {
        const authTokenDto: AuthTokenDto = plainToInstance(AuthTokenDto, data);
        context.switchToHttp().getResponse().set({
          'Authorization': 'Bearer ' + authTokenDto.accessToken,
          'X-Access-Token': authTokenDto.accessToken,
          'X-Refresh-Token': authTokenDto.refreshToken
        });
        return data;
      })
    );
  }
}
