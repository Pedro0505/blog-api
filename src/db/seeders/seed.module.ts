import { Module } from '@nestjs/common';
import Seeds from './Seeds';
import { PostsModule } from '../../shared/posts/posts.module';
import { ProjectsModule } from '../../shared/projects/projects.module';

@Module({
  imports: [PostsModule, ProjectsModule],
  providers: [Seeds],
  exports: [Seeds],
})
export class SeedsModule {}
