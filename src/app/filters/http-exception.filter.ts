import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, InternalServerErrorException, } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    console.log('HttpExceptionFilter', exception);
    if (!(exception instanceof HttpException)) {
      exception = new InternalServerErrorException();
    }

    const response = (exception as HttpException).getResponse();

    Logger.error(
      JSON.stringify({
        url: req.url,
        response,
        stack: exception.stack
      })
    );

    res.status((exception as HttpException).getStatus()).json({
      statusCode: response["statusCode"],
      status: "ERROR",
      message: response["message"],
      error: response["error"],
    });
  }
}
