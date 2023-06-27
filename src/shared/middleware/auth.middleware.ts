import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../utils/jwtService';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(@Inject(JwtService) private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      this.jwtService.verify(authorization);

      return next();
    } catch (error) {
      throw new UnauthorizedException('Expired or invalid token');
    }
  }
}
