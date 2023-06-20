import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './model/posts.model';
import { ProjectsSchema } from './model/projects.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ModelNames from '../constants/ModelNames';

export const modelForFeature = MongooseModule.forFeature([
  {
    name: ModelNames.POSTS,
    schema: PostsSchema,
  },
  {
    name: ModelNames.PROJECTS,
    schema: ProjectsSchema,
  },
]);

export const modelForRoot = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    uri: config.get<string>('DATABASE_URL'),
  }),
});
