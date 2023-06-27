import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import validateObjectId from '../utils/validateObjectId';

@Injectable()
export default class ValidatorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.query.id as string | undefined;

    if (Boolean(id)) {
      const isValidId = validateObjectId(id);

      if (!isValidId) {
        throw new BadRequestException('Invalid id');
      } else {
        return next();
      }
    }

    return next();
  }
}
