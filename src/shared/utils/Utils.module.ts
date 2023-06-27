import { Module } from '@nestjs/common';
import { PassCryptography } from './PassCryptography';

@Module({
  providers: [PassCryptography],
  exports: [PassCryptography],
})
export class UtilsModule {}
