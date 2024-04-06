import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}
  catch(exp: any, host: ArgumentsHost) {
    //console.log(exp);
    this.logger.error(exp);
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const hasKey =
      Object.keys(exp).length > 0 && exp.hasOwnProperty('response')
        ? true
        : false;
    const isHttpInstance = exp instanceof HttpException ? true : false;

    const validErrors =
      hasKey && Array.isArray(exp.response.message) ? exp.response.message : [];
    const statusCode = isHttpInstance
      ? exp.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const type =
      hasKey && exp.response.type ? exp.response.type : 'some_thing_went_error';
    //const message = isHttpInstance ? exp.message : 'Oops Something went wrong!';
    const message = exp.message;
    const error = hasKey ? exp.response.error : exp;

    response.status(statusCode).json({
      message,
      type,
      validationErrors: validErrors,
      statusCode,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
