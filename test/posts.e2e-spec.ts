import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { postsMock } from './mock/data';
import SerializeBody from './utils/SerializeBody';
import { AppModule } from '../src/app.module';
import { MongooseConnections } from './utils/MongooseConnections';

describe('Testing Posts Route (e2e)', () => {
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
    await mongooseConnections.insert('posts', postsMock.posts);
  });

  afterEach(async () => {
    await mongooseConnections.remove('posts');
  });

  it('/posts (GET)', async () => {
    const { status, body } = await request(app.getHttpServer()).get('/posts');

    expect(status).toBe(200);
    expect(body).toHaveLength(3);
    expect(body).toBeInstanceOf(Array);
    body.map((e, i) => {
      expect(e.id).toBeDefined();
      expect(e.title).toBe(postsMock.posts[i].title);
      expect(e.description).toBe(postsMock.posts[i].description);
      expect(e.category).toBe(postsMock.posts[i].category);
      expect(e.published).toBe(postsMock.posts[i].published);
      expect(e.content).toBe(postsMock.posts[i].content);
    });
  });

  describe('/posts/?id (GET)', () => {
    it('Testing when get a post with success', async () => {
      const { body: get } = await request(app.getHttpServer()).get('/posts');
      const id = get[0].id;

      const { status, body } = await request(app.getHttpServer()).get(
        `/posts/?id=${id}`,
      );

      expect(status).toBe(200);
      expect(body.id).toBeDefined();
      expect(body.title).toBe(postsMock.posts[0].title);
      expect(body.description).toBe(postsMock.posts[0].description);
      expect(body.category).toBe(postsMock.posts[0].category);
      expect(body.published).toBe(postsMock.posts[0].published);
      expect(body.content).toBe(postsMock.posts[0].content);
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
    const serializeBodyCreate = new SerializeBody(postsMock.postToCreate);

    it('Testing post creating with success', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', token)
        .send(postsMock.postToCreate);

      const date = new Date(body.published);
      const testDate = !isNaN(date.getTime());

      expect(status).toBe(201);
      expect(body.id).toBeDefined();
      expect(body.category).toStrictEqual(postsMock.postCreated.category);
      expect(body.content).toStrictEqual(postsMock.postCreated.content);
      expect(body.description).toStrictEqual(postsMock.postCreated.description);
      expect(body.title).toStrictEqual(postsMock.postCreated.title);
      expect(testDate).toBeTruthy();
    });

    describe('Testing DTO erros in title', () => {
      it('Testing post when dont recive title', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.removeKey('title'));

        expect(body.message).toContain('O título não pode ser vazio');
        expect(status).toBe(400);
      });

      it('Testing when title is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('title', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O título precisa ser uma strig');
      });

      it('Testing when title is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('title', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O título não pode ser vazio');
      });

      it('Testing when title have more than 50 char', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.repeatChar('title', 25));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain(
          'O título precisa ter entre 1 e 50 caracteres',
        );
      });
    });

    describe('Testing DTO erros in description', () => {
      it('Testing post when dont recive description', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.removeKey('description'));

        expect(body.message).toContain('A descrição não pode ser vazia');
        expect(status).toBe(400);
      });

      it('Testing when description is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('description', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A descrição precisa ser uma strig');
      });

      it('Testing when description is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('description', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A descrição não pode ser vazia');
      });

      it('Testing when description have more than 50 char', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.repeatChar('description', 25));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain(
          'A descrição precisa ter entre 1 e 255 caracteres',
        );
      });
    });

    describe('Testing DTO erros in category', () => {
      it('Testing post when dont recive category', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.removeKey('category'));

        expect(body.message).toContain('A categoria não pode ser vazia');
        expect(status).toBe(400);
      });

      it('Testing when category is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('category', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A categoria precisa ser uma strig');
      });

      it('Testing when category is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('category', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A categoria não pode ser vazia');
      });

      it('Testing when category have more than 50 char', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.repeatChar('category', 25));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain(
          'A categoria precisa ter entre 1 e 30 caracteres',
        );
      });
    });

    describe('Testing DTO erros in content', () => {
      it('Testing post when dont recive content', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.removeKey('content'));

        expect(body.message).toContain('O conteúdo não pode ser vazio');
        expect(status).toBe(400);
      });

      it('Testing when content is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('content', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O conteúdo precisa ser uma strig');
      });

      it('Testing when content is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .post('/posts')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('content', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O conteúdo não pode ser vazio');
      });
    });
  });

  describe('/posts (DELETE)', () => {
    const inexistentId = '6499779d633d9e256958fb13';

    it('Testing delete with id which not exist', async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete(`/posts/?id=${inexistentId}`)
        .set('Authorization', token);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Post id not found');
      expect(status).toBe(404);
    });

    it('Testing when post is delete with success', async () => {
      const { body: get } = await request(app.getHttpServer()).get('/posts');
      const id = get[0].id;

      const { status, body } = await request(app.getHttpServer())
        .delete(`/posts/?id=${id}`)
        .set('Authorization', token);

      expect(status).toBe(204);
      expect(body).toStrictEqual({});
    });

    it('Testing delete with invalid id', async () => {
      const { status, body } = await request(app.getHttpServer())
        .delete('/posts/?id=123')
        .set('Authorization', token);

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
        .set('Authorization', token)
        .send(postsMock.postToPatch);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Post id not found');
      expect(status).toBe(404);
    });

    it('Testing when post is patch with success', async () => {
      const { body: get } = await request(app.getHttpServer()).get('/posts');
      const id = get[0].id;

      const { status, body } = await request(app.getHttpServer())
        .patch(`/posts/?id=${id}`)
        .set('Authorization', token)
        .send(postsMock.postToPatch);

      expect(status).toBe(200);
      expect(body.id).toBeDefined();
      expect(body.category).toStrictEqual(postsMock.postUpdated.category);
      expect(body.content).toStrictEqual(postsMock.postUpdated.content);
      expect(body.description).toStrictEqual(postsMock.postUpdated.description);
      expect(body.title).toStrictEqual(postsMock.postUpdated.title);
      expect(body.published).toStrictEqual(postsMock.postUpdated.published);
    });

    it('Testing patch with invalid id', async () => {
      const { status, body } = await request(app.getHttpServer())
        .patch('/posts/?id=123')
        .set('Authorization', token)
        .send(postsMock.postToPatch);

      expect(status).toBe(400);
      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
    });

    describe('Testing DTO erros in title', () => {
      const serializeBodyUpdate = new SerializeBody({
        title: 'Post do ano 2021',
      });

      it('Testing when title is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('title', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O título precisa ser uma strig');
      });

      it('Testing when title is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('title', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O título não pode ser vazio');
      });

      it('Testing when title have more than 50 char', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.repeatChar('title', 25));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain(
          'O título precisa ter entre 1 e 50 caracteres',
        );
      });
    });

    describe('Testing DTO erros in description', () => {
      const serializeBodyUpdate = new SerializeBody({
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing 2022',
      });

      it('Testing when description is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('description', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A descrição precisa ser uma strig');
      });

      it('Testing when description is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('description', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A descrição não pode ser vazia');
      });

      it('Testing when description have more than 50 char', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.repeatChar('description', 25));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain(
          'A descrição precisa ter entre 1 e 255 caracteres',
        );
      });
    });

    describe('Testing DTO erros in category', () => {
      const serializeBodyUpdate = new SerializeBody({
        category: 'Node',
      });

      it('Testing when category is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('category', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A categoria precisa ser uma strig');
      });

      it('Testing when category is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('category', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('A categoria não pode ser vazia');
      });

      it('Testing when category have more than 50 char', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.repeatChar('category', 25));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain(
          'A categoria precisa ter entre 1 e 30 caracteres',
        );
      });
    });

    describe('Testing DTO erros in content', () => {
      const serializeBodyUpdate = new SerializeBody({
        content:
          '<p>Lorem ipsum dolor sit amet, consectetur adipiscing 2022</p>',
      });

      it('Testing when content is not a string', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('content', 1));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O conteúdo precisa ser uma strig');
      });

      it('Testing when content is empty', async () => {
        const { status, body } = await request(app.getHttpServer())
          .patch('/posts')
          .set('Authorization', token)
          .send(serializeBodyUpdate.changeKeyValue('content', ''));

        expect(status).toBe(400);
        expect(body).toHaveProperty('message');
        expect(body.message).toContain('O conteúdo não pode ser vazio');
      });
    });
  });
});
