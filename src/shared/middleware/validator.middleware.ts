import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import MongoValidator from '../utils/validateObjectId';

@Injectable()
export default class ValidatorMiddleware implements NestMiddleware {
  constructor(private readonly mongoValidator: MongoValidator) {}

  use(req: Request, res: Response, next: NextFunction) {
    const id = req.query.id as string | undefined;

    if (id !== undefined) {
      const isValidId = this.mongoValidator.validateObjectId(id);

      if (!isValidId) {
        throw new BadRequestException('Invalid id');
      } else {
        return next();
      }
    }

    return next();
  }
}
