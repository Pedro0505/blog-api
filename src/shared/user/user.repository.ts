import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ModelNames from '../../constants/ModelNames';
import { User } from '../../db/model/user.model';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(ModelNames.USER) private userModel: Model<User>) {}

  public async createUser(user: CreateUserDto) {
    return await this.userModel.create(user);
  }

  public async getUserByUsername(username: string) {
    return await this.userModel.findOne({ username });
  }
}
