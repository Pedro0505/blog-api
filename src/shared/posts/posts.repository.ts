import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelNames from '../../constants/ModelNames';
import { Posts } from '../../../src/db/model/posts.model';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/CreatePost.dto';
import { UpdatePostDto } from './dto/UpdatePost.dto';

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

  public async createPost(post: CreatePostDto) {
    return await this.postsModel.create(post);
  }

  public async deletePostBydId(id: string) {
    await this.postsModel.deleteOne({ _id: id });
  }

  public async updatePostById(body: UpdatePostDto, id: string) {
    return await this.postsModel.findByIdAndUpdate(id, body, {
      returnDocument: 'after',
    });
  }
}
