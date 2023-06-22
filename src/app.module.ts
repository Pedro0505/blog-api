import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './shared/posts/posts.module';
import { ProjectsModule } from './shared/projects/projects.module';
import { SeedsModule } from './db/seeders/seed.module';
import ValidatorMiddleware from './shared/middleware/Validator.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidatorMiddleware)
      .exclude({ path: '/projects', method: RequestMethod.POST })
      .forRoutes('/projects');
  }
}
