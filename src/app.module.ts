import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './shared/posts/posts.module';
import { ProjectsModule } from './shared/projects/projects.module';
import { SeedsModule } from './db/seeders/seed.module';

@Module({
  imports: [
    PostsModule,
    ProjectsModule,
    SeedsModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
