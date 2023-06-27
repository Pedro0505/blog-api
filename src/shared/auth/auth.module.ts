import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UtilsModule } from '../utils/utils.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [UtilsModule],
  providers: [AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
