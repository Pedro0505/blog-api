import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './posts.model';
import { ProjectSchema } from './projects.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ModelNames from 'src/constants/ModelNames';

export const postsForFeature = MongooseModule.forFeature([
  {
    name: ModelNames.POSTS,
    schema: PostsSchema,
  },
  {
    name: ModelNames.PROJECT,
    schema: ProjectSchema,
  },
]);

export const postsForRoot = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => ({
    uri: config.get<string>('DATABASE_URL'),
  }),
});
