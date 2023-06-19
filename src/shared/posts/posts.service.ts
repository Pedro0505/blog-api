import { Injectable } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import IPostBodyCreate from './interfaces/IPostBodyCreate';
import IPostBodyUpdate from './interfaces/IPostBodyUpdate';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  public async getAllPosts() {
    return await this.postsRepository.getAllPosts();
  }

  public async getPostById(id: string) {
    return await this.postsRepository.getPostById(id);
  }

  public async createPost(post: IPostBodyCreate) {
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
