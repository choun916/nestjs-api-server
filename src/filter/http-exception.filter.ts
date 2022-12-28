import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, InternalServerErrorException, } from "@nestjs/common";
import { Request, Response } from "express";
import { WinstonLogger, WINSTON_MODULE_PROVIDER } from "nest-winston";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    // this.logger.error(
    //   JSON.stringify({
    //     url: req.url,
    //     response,
    //     // stack: exception.stack
    //   })
    // );

    res.status((exception as HttpException).getStatus()).json({
      statusCode: response["statusCode"],
      status: "ERROR",
      message: response["message"],
      error: response["error"],
    });
  }
}
