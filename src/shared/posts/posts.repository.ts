import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelNames from 'src/constants/ModelNames';
import { Posts } from 'src/db/model/posts.model';
import { Model } from 'mongoose';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(ModelNames.POSTS) private postsModel: Model<Posts>,
  ) {}

  public async getAll() {
    return await this.postsModel.find();
  }
}
