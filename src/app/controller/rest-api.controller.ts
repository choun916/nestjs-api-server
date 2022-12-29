import { Inject, UseFilters, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiHeader } from "@nestjs/swagger";
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from "nest-winston";
import { AccessJwtAuthGuard } from "src/app/guards/auth/access-jwt-auth.guard";
import { HttpExceptionFilter } from "src/app/filters/http-exception.filter";
import { LoggerInterceptor } from "src/app/interceptors/logging.interceptor";
import { ResponseInterceptor } from "src/app/interceptors/response.interceptor";

// @ApiHeader({ name: 'Authorization', description: '' })
@UseGuards(AccessJwtAuthGuard)
@UseInterceptors(LoggerInterceptor, ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export abstract class RestApiController {
  @Inject(WINSTON_MODULE_PROVIDER) protected readonly logger: WinstonLogger;
}
