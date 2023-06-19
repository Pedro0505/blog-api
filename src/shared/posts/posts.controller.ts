import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import IPost from './interfaces/IPost';
import IPostBodyUpdate from './interfaces/IPostBodyUpdate';

@Controller('/posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  public async getPostById(@Query() query: { id: string }) {
    if (query.id) {
      return await this.postsService.getPostById(query.id);
    }

    return await this.postsService.getAllPosts();
  }

  @Post()
  @HttpCode(201)
  public async createPost(@Body() post: IPost) {
    return await this.postsService.createPost(post);
  }

  @Delete()
  @HttpCode(204)
  public async deletePostBydId(@Query() query: { id: string }) {
    await this.postsService.deletePostBydId(query.id);
  }

  @Patch()
  @HttpCode(200)
  public async updatePostById(
    @Body() post: IPostBodyUpdate,
    @Query() query: { id: string },
  ) {
    return await this.postsService.updatePostById(post, query.id);
  }
}
