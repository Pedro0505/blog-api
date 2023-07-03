import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MongooseConnections } from '../utils/MongooseConnections';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { authMock, postsMock, projectsMock } from '../mock/data';

describe('', () => {
  let app: INestApplication;
  let token: string;
  const originalEnv = process.env;
  const mongooseConnections = new MongooseConnections();
  const fakeUser = {
    username: 'Jonh Doe',
    password: 'minhaIncrivelSenha1',
  };

  beforeAll(async () => {
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

    await request(app.getHttpServer())
      .post('/user/register')
      .send(fakeUser)
      .set('owner-key', 'secreto');

    const { body } = await request(app.getHttpServer())
      .post('/user/login')
      .send(fakeUser);
    await mongooseConnections.insert('posts', postsMock.posts);
    await mongooseConnections.insert('projects', projectsMock.projects);
    token = body.token;
  }, 2000);

  afterAll(async () => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    await mongooseConnections.remove('posts');
    await mongooseConnections.remove('projects');
    await mongooseConnections.remove('users');
    await app.close();
  }, 2000);

  describe('Testing auth in projects route', () => {
    describe('Testing auth in POST route', () => {
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
    describe('Testing auth in DELETE route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );

        const { body, status } = await request(app.getHttpServer())
          .delete(`/projects/?id=${get[get.length - 1].id}`)
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

        const { body, status } = await request(app.getHttpServer()).delete(
          `/projects/?id=${get[0].id}`,
        );

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });

    describe('Testing auth in PATCH route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );

        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects/?id=${get[0].id}`)
          .send(projectsMock.projectToPatch)
          .set('Authorization', token);

        expect(status).toBe(200);
        expect(body.name).toBeDefined();
        expect(body.url).toBeDefined();
        expect(body.description).toBeDefined();
        expect(body.id).toBeDefined();
      });

      it('Testing when authentication data are invalid', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );

        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects/?id=${get[0].id}`)
          .send(projectsMock.projectToPatch)
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
          .patch(`/projects/?id=${get[0].id}`)
          .send(projectsMock.projectToPatch);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });
  });

  describe('Testing auth in projects route', () => {
    describe('Testing auth in POST route', () => {
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

    describe('Testing auth in DELETE route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .delete(`/posts/?id=${get[get.length - 1].id}`)
          .set('Authorization', token);

        expect(status).toBe(204);
        expect(body).toStrictEqual({});
      });

      it('Testing when authentication data are invalid', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .delete(`/posts/?id=${get[0].id}`)
          .set('Authorization', authMock.invalidToken);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });

      it('Testing when Authorization is not set', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer()).delete(
          `/posts/?id=${get[0].id}`,
        );

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });
    describe('Testing auth in PATCH route', () => {
      it('Testing when is successfully authenticated', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .patch(`/posts/?id=${get[0].id}`)
          .set('Authorization', token)
          .send(postsMock.postToPatch);

        expect(status).toBe(200);
        expect(body.category).toBeDefined();
        expect(body.content).toBeDefined();
        expect(body.description).toBeDefined();
        expect(body.published).toBeDefined();
        expect(body.title).toBeDefined();
        expect(body.id).toBeDefined();
      });

      it('Testing when authentication data are invalid', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .patch(`/posts/?id=${get[0].id}`)
          .set('Authorization', authMock.invalidToken)
          .send(postsMock.postToPatch);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Expired or invalid token');
      });

      it('Testing when Authorization is not set', async () => {
        const { body: get } = await request(app.getHttpServer()).get('/posts');

        const { body, status } = await request(app.getHttpServer())
          .patch(`/posts/?id=${get[0].id}`)
          .send(postsMock.postToPatch);

        expect(status).toBe(401);
        expect(body.message).toBeDefined();
        expect(body.message).toBe('Token not found');
      });
    });
  });
});
