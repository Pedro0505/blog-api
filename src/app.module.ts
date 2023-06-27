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
import ValidatorMiddleware from './shared/middleware/validator.middleware';
import { UserModule } from './shared/user/user.module';
import AuthMiddleware from './shared/middleware/auth.middleware';
import { UtilsModule } from './shared/utils/utils.module';

@Module({
  imports: [
    PostsModule,
    ProjectsModule,
    UserModule,
    SeedsModule,
    UtilsModule,
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

    consumer
      .apply(ValidatorMiddleware)
      .exclude({ path: '/posts', method: RequestMethod.POST })
      .forRoutes('/posts');

    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/projects', method: RequestMethod.GET })
      .forRoutes('/projects');

    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/posts', method: RequestMethod.GET })
      .forRoutes('/posts');
  }
}
