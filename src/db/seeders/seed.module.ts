import { Module } from '@nestjs/common';
import Seeds from './Seeds';
import { PostsModule } from 'src/shared/posts/posts.module';
import { ProjectsModule } from 'src/shared/projects/projects.module';

@Module({
  imports: [PostsModule, ProjectsModule],
  providers: [Seeds],
  exports: [Seeds],
})
export class SeedsModule {}
