import { Injectable } from '@nestjs/common';
import { SignOptions, sign, verify } from 'jsonwebtoken';
import IPayload from '../auth/interfaces/IPayload';

@Injectable()
export class JwtService {
  private static jwtConfig: SignOptions = {
    expiresIn: '1d',
    algorithm: 'HS256',
  };

  public generate(playload: IPayload) {
    return sign(
      { tokenData: playload },
      process.env.JWT_SECRET,
      JwtService.jwtConfig,
    );
  }

  public verify(authorization: string) {
    return verify(authorization, process.env.JWT_SECRET);
  }
}
