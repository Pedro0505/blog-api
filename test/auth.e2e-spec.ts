import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { authMock, postsMock, projectsMock } from './mock/data';
import { MongooseConnections } from './utils/MongooseConnections';

describe('Testing Auth (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const originalEnv = process.env;
  const mongooseConnections = new MongooseConnections();

  beforeAll(async () => {
    jest.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'TEST',
      OWNER_KEY: 'secreto',
      JWT_SECRET: 'muito_secreto',
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const fakeUser = { username: 'Jonh Doe', password: 'minhaIncrivelSenha1' };

    await request(app.getHttpServer())
      .post('/user/register')
      .send(fakeUser)
      .set('owner-key', 'secreto');

    const { body } = await request(app.getHttpServer())
      .post('/user/login')
      .send(fakeUser);

    token = body.token;
  });

  afterAll(async () => {
    process.env = originalEnv;
    await app.close();
    jest.restoreAllMocks();
  });

  beforeEach(async () => {
    await mongooseConnections.insert('projects', projectsMock.projects);
    await mongooseConnections.insert('posts', postsMock.posts);
  });

  afterEach(async () => {
    await mongooseConnections.remove('projects');
    await mongooseConnections.remove('posts');
  });

  describe('Testing auth in POST routes', () => {
    describe('Testing in projects route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(projectsMock.projectToCreate);

        expect(status).toBe(201);
        expect(body.name).toBeDefined();
        expect(body.url).toBeDefined();
        expect(body.description).toBeDefined();
        expect(body.id).toBeDefined();
      });

      it('Testing when authentication data are invalid', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', authMock.invalidToken)
          .send(projectsMock.projectToCreate);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });

      it('Testing when Authorization is not set', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(projectsMock.projectToCreate);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });

    describe('Testing in posts route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(postsMock.postToCreate);

        expect(status).toBe(201);
        expect(body.category).toBeDefined();
        expect(body.content).toBeDefined();
        expect(body.description).toBeDefined();
        expect(body.published).toBeDefined();
        expect(body.title).toBeDefined();
        expect(body.id).toBeDefined();
      });

      it('Testing when authentication data are invalid', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', authMock.invalidToken)
          .send(postsMock.postToCreate);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });

      it('Testing when Authorization is not set', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/posts')
          .send(postsMock.postToCreate);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });
  });

  describe('Testing auth in DELETE routes', () => {
    describe('Testing in project route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );

        const { body, status } = await request(app.getHttpServer())
          .delete(`/projects/?id=${get[0].id}`)
          .set('Authorization', token);

        expect(status).toBe(204);
        expect(body).toStrictEqual({});
      });

      it('Testing when authentication data are invalid', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );

        const { body, status } = await request(app.getHttpServer())
          .delete(`/projects/?id=${get[0].id}`)
          .set('Authorization', authMock.invalidToken);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });

      it('Testing when Authorization is not set', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );

        const { body, status } = await request(app.getHttpServer())
          .delete(`/projects/?id=${get[0].id}`)
          .send(projectsMock.projectToCreate);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });

    describe('Testing in posts route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .delete(`/posts/?id=${get[0].id}`)
          .set('Authorization', token)
          .send(postsMock.postToCreate);

        expect(status).toBe(204);
        expect(body).toStrictEqual({});
      });
      it('Testing when authentication data are invalid', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .delete(`/posts/?id=${get[0].id}`)
          .set('Authorization', authMock.invalidToken)
          .send(postsMock.postToCreate);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });

      it('Testing when Authorization is not set', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .delete(`/posts/?id=${get[0].id}`)
          .send(postsMock.postToCreate);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });
  });
});
