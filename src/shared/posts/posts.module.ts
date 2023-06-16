import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './posts.service';
import { modelForFeature, modelForRoot } from 'src/db/model.db';

@Module({
  imports: [modelForFeature, modelForRoot],
  controllers: [PostsController],
  providers: [PostsRepository, PostsService],
})
export class PostsModule {}
