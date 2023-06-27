import { Injectable, UnauthorizedException } from '@nestjs/common';
import IPayload from './interfaces/IPayload';
import { PassCryptography } from '../utils/passCryptography';
import { JwtService } from '../utils/jwtService';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private passCryptography: PassCryptography,
  ) {}

  public async verifyToken(token: string | undefined) {
    try {
      this.jwtService.verify(token);

      return true;
    } catch (error) {
      return false;
    }
  }

  public async generateToken(payload: IPayload) {
    return this.jwtService.generate(payload);
  }

  public async signIn(pass: string, dbPass: string, id: string, name: string) {
    const verify = await this.passCryptography.bcryptVerify(pass, dbPass);

    if (!verify) return new UnauthorizedException('Usuário ou senha incorreta');

    const token = this.generateToken({ userId: id, username: name });

    return token;
  }
}
