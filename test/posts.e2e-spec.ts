import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import ValidatorMiddleware from '../src/shared/middleware/Validator.middleware';
import { PostsRepository } from '../src/shared/posts/posts.repository';
import { PostsService } from '../src/shared/posts/posts.service';
import { PostsController } from '../src/shared/posts/posts.controller';
import { mockRepositoryPost } from './mock/functions';
import { postsMock } from './mock/data';

describe('Testing Posts Route (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [PostsRepository, PostsService],
    })
      .overrideProvider(PostsRepository)
      .useValue(mockRepositoryPost)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(new ValidatorMiddleware().use);
    await app.init();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('/posts (GET)', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/posts');

    expect(status).toBe(200);
    expect(body).toStrictEqual(postsMock.posts);
  });
});
