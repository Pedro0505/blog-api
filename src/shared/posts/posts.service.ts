import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import IPostBodyUpdate from './interfaces/IPostBodyUpdate';
import { CreatePostDto } from './dto/CreatePost.dto';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  public async getAllPosts() {
    return await this.postsRepository.getAllPosts();
  }

  public async getPostById(id: string) {
    return await this.postsRepository.getPostById(id);
  }

  public async createPost(post: CreatePostDto) {
    const newPost = { ...post, published: new Date().toISOString() };

    return await this.postsRepository.createPost(newPost);
  }

  public async deletePostBydId(id: string) {
    await this.postsRepository.deletePostBydId(id);
  }

  public async updatePostById(body: IPostBodyUpdate, id: string) {
    return await this.postsRepository.updatePostById(body, id);
  }
}
