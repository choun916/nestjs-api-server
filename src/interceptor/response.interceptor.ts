import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

export interface Response<T> {
  statusCode: number;
  status: string;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((data) => {
        const message = data["message"] || "";
        delete data["message"];
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          status: "OK",
          message,
          data,
        };
      })
    );
  }
}
