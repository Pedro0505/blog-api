import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  public async getAll() {
    return await this.postsService.getAll();
  }
}
