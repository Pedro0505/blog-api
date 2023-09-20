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
import { CreatePostDto } from './dto/CreatePost.dto';
import { UpdatePostDto } from './dto/UpdatePost.dto';
import ApiRoutes from '../../constants/ApiRoutes';

@Controller(ApiRoutes.POSTS)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  public async getPostById(
    @Query() query: { id: string; page: string; limit?: string },
  ) {
    if (query.id) {
      return await this.postsService.getPostById(query.id);
    }

    if (query.page) {
      return await this.postsService.getPaginablePosts(query.page, query.limit);
    }

    return await this.postsService.getAllPosts();
  }

  @Post()
  @HttpCode(201)
  public async createPost(@Body() post: CreatePostDto) {
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
    @Body() post: UpdatePostDto,
    @Query() query: { id: string },
  ) {
    return await this.postsService.updatePostById(post, query.id);
  }
}
