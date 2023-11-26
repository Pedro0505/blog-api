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

  public async getPaginablePosts(page: string, limit?: string) {
    const newLimit = +limit || 5;
    const pag = +page <= 0 ? 1 : +page;

    const posts = await this.postsRepository.getPostPaginable(pag, newLimit);
    const total = await this.postsRepository.count();

    return {
      posts,
      total: total,
      page: pag,
      lastPage: Math.ceil(total / newLimit),
    };
  }

  public async getPostById(id: string) {
    const post = await this.postsRepository.getPostById(id);

    if (post === null) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
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
    const updatedPost = await this.postsRepository.updatePostById(body, id);

    if (updatedPost === null) {
      throw new NotFoundException('Post id not found');
    }

    return updatedPost;
  }
}
