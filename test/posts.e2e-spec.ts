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

  describe('/posts/?id (GET)', () => {
    it('Testing when get a post with success', async () => {
      const id = postsMock.posts[0].id;

      const { status, body } = await request(app.getHttpServer()).get(
        `/posts/?id=${id}`,
      );

      expect(status).toBe(200);
      expect(body).toStrictEqual(postsMock.posts[0]);
      expect(body.id).toBe(id);
    });

    it('Testing get with invalid id', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        '/posts/?id=123',
      );

      expect(status).toBe(400);
      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
    });
  });

  describe('/posts (POST)', () => {
    it('Testing post creating with success', async () => {
      const mockDate = new Date(postsMock.postCreated.published);

      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const { status, body } = await request(app.getHttpServer())
        .post('/posts')
        .send(postsMock.postToCreate);

      expect(status).toBe(201);
      expect(body).toStrictEqual(postsMock.postCreated);

      jest.spyOn(global, 'Date').mockRestore();
    });
  });

  describe('/posts (DELETE)', () => {
    const inexistentId = '6499779d633d9e256958fb13';

    it('Testing delete with id which not exist', async () => {
      const { status, body } = await request(app.getHttpServer()).delete(
        `/posts/?id=${inexistentId}`,
      );

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Post id not found');
      expect(status).toBe(404);
    });

    it('Testing when post is delete with success', async () => {
      const id = postsMock.posts[0].id;

      const { status, body } = await request(app.getHttpServer()).delete(
        `/posts/?id=${id}`,
      );

      expect(status).toBe(204);
      expect(body).toStrictEqual({});
    });

    it('Testing delete with invalid id', async () => {
      const { status, body } = await request(app.getHttpServer()).delete(
        '/posts/?id=123',
      );

      expect(status).toBe(400);
      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
    });
  });

  describe('/posts (PATCH)', () => {
    const inexistentId = '6499779d633d9e256958fb13';

    it('Testing patch with id which not exist', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch(`/posts/?id=${inexistentId}`)
        .send(postsMock.postToPatch);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Post id not found');
      expect(status).toBe(404);
    });

    it('Testing when post is patch with success', async () => {
      const id = postsMock.posts[0].id;

      const { status, body } = await request(app.getHttpServer())
        .patch(`/posts/?id=${id}`)
        .send(postsMock.postToPatch);

      expect(status).toBe(200);
      expect(body.id).toBe(id);
      expect(body).toStrictEqual(postsMock.postUpdated);
    });

    it('Testing patch with invalid id', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch('/posts/?id=123')
        .send(postsMock.postToPatch);

      expect(status).toBe(400);
      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
    });
  });
});
