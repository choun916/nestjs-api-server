import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Observable, tap } from "rxjs";
import { Logger } from "winston";

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {

    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse<Response>();
    const { params, query, body, headers, user, method, url } = req;
    const pathname: string = url.split('?')[0];

    this.logger.debug(`Request [${method}] ${pathname}`, { pathname, headers, query, params, body, user });

    return next
      .handle()
      .pipe(tap((data) => {
        this.logger.debug(`Response [${method}] ${pathname}`, { ...data });
        this.logger.profile('test');
      }));

  }
}
