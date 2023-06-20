import { Module } from '@nestjs/common';
import PostSeed from './PostSeed';
import { PostsModule } from 'src/shared/posts/posts.module';
import { ProjectsModule } from 'src/shared/projects/projects.module';

@Module({
  imports: [PostsModule, ProjectsModule],
  providers: [PostSeed],
  exports: [PostSeed],
})
export class SeedsModule {}
