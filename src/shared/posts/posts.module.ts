import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { modelForFeature, modelForRoot } from '../../db/model.db';

@Module({
  imports: [modelForFeature, modelForRoot],
  controllers: [PostsController],
  providers: [PostsRepository, PostsService],
  exports: [PostsService],
})
export class PostsModule {}
