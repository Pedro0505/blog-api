import { Module } from '@nestjs/common';
import { PassCryptography } from './passCryptography';
import { JwtService } from './jwtService';
import MongoValidator from './validateObjectId';

@Module({
  providers: [PassCryptography, JwtService, MongoValidator],
  exports: [PassCryptography, JwtService, MongoValidator],
})
export class UtilsModule {}
