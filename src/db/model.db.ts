import { MongooseModule } from '@nestjs/mongoose';
import { PostsSchema } from './model/posts.model';
import { ProjectsSchema } from './model/projects.model';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ModelNames from '../constants/ModelNames';
import { UserSchema } from './model/user.model';

export const modelForFeature = MongooseModule.forFeature([
  {
    name: ModelNames.POSTS,
    schema: PostsSchema,
  },
  {
    name: ModelNames.PROJECTS,
    schema: ProjectsSchema,
  },
  {
    name: ModelNames.USER,
    schema: UserSchema,
  },
]);

export const modelForRoot = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (config: ConfigService) => {
    const nodeEnv = config.get<string>('NODE_ENV');
    const dbName = nodeEnv === 'DEV' ? 'DATABASE_URL' : 'DATABASE_URL_TEST';
    const uri = config.get<string>(dbName);
    return {
      uri,
    };
  },
});
