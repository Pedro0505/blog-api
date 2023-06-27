import { Module } from '@nestjs/common';
import { PassCryptography } from './passCryptography';
import { JwtService } from './jwtService';

@Module({
  providers: [PassCryptography, JwtService],
  exports: [PassCryptography, JwtService],
})
export class UtilsModule {}
