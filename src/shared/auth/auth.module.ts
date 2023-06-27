import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UtilsModule } from '../utils/Utils.module';
import { AuthController } from './auth.controller';
import { JwtService } from '../utils/JwtService';

@Module({
  imports: [UtilsModule],
  providers: [AuthService, JwtService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
