import { Controller, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  public async verifyToken(@Headers() headers: { authorization?: string }) {
    const verify = await this.authService.verifyToken(headers.authorization);

    return { authorized: verify };
  }
}
