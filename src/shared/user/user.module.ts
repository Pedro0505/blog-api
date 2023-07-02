import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { modelForFeature, modelForRoot } from '../../db/model.db';
import { UtilsModule } from '../utils/utils.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [modelForFeature, modelForRoot, UtilsModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
