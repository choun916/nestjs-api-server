import { HttpException, HttpStatus } from "@nestjs/common";

export class ExistsException extends HttpException {
  constructor() {
    super("existsException", HttpStatus.BAD_REQUEST);
  }
}
