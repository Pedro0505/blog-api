import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from './posts.repository';
import { CreatePostDto } from './dto/CreatePost.dto';
import { UpdatePostDto } from './dto/UpdatePost.dto';

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
    const postDeleted = await this.postsRepository.deletePostBydId(id);

    if (postDeleted === null) {
      throw new NotFoundException('Post id not found');
    }
  }

  public async updatePostById(body: UpdatePostDto, id: string) {
    return await this.postsRepository.updatePostById(body, id);
  }
}
