import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelNames from 'src/constants/ModelNames';
import { Posts } from 'src/db/model/posts.model';
import { Model } from 'mongoose';
import IPost from './interfaces/IPost';
import IPostBodyUpdate from './interfaces/IPostBodyUpdate';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(ModelNames.POSTS) private postsModel: Model<Posts>,
  ) {}

  public async getAllPosts() {
    return await this.postsModel.find();
  }

  public async getPostById(id: string) {
    return await this.postsModel.findById(id);
  }

  public async createPost(post: IPost) {
    return await this.postsModel.create(post);
  }

  public async deletePostBydId(id: string) {
    await this.postsModel.deleteOne({ _id: id });
  }

  public async updatePostById(body: IPostBodyUpdate, id: string) {
    return await this.postsModel.updateOne({ _id: id }, body);
  }
}
