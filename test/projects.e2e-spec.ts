import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { projectsMock } from './mock/data';
import SerializeBody from './utils/SerializeBody';
import { AppModule } from '../src/app.module';
import { MongooseConnections } from './utils/MongooseConnections';

describe('Testing Projects Route (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const mongooseConnections = new MongooseConnections();
  const originalEnv = process.env;

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
    jest.restoreAllMocks();
    process.env = originalEnv;
    await app.close();
  });

  beforeEach(async () => {
    await mongooseConnections.insert('projects', projectsMock.projects);
  });

  afterEach(async () => {
    await mongooseConnections.remove('projects');
  });

  it('/projects (GET)', async () => {
    const { body, status } = await request(app.getHttpServer()).get(
      '/projects',
    );

    expect(status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body).toBeInstanceOf(Array);
    body.map((e, i) => {
      expect(e.name).toBe(projectsMock.projects[i].name);
      expect(e.url).toBe(projectsMock.projects[i].url);
      expect(e.description).toBe(projectsMock.projects[i].description);
    });
  });

  describe('/projects (POST)', () => {
    const serializeBodyCreate = new SerializeBody(projectsMock.projectToCreate);

    it('Testing post with sucess', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', token)
        .send(projectsMock.projectToCreate);

      expect(status).toBe(201);
      expect(body.id).toBeDefined();
      expect(body.name).toBe(projectsMock.projectCreated.name);
      expect(body.description).toBe(projectsMock.projectCreated.description);
      expect(body.url).toBe(projectsMock.projectCreated.url);
    });

    describe('Testing name DTO erros', () => {
      it('Testing post when dont recive name', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.removeKey('name'));

        expect(body.message).toContain('O nome não pode ser vazio');
        expect(status).toBe(400);
      });

      it('Testing post when name have more than 50 characters', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.repeatChar('name', 25));

        expect(body.message).toContain(
          'O nome precisa ter entre 1 e 50 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing post when name isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('name', 1));

        expect(body.message).toContain('O nome precisa ser uma strig');
        expect(status).toBe(400);
      });
    });

    describe('Testing description DTO erros', () => {
      it('Testing post when dont recive description', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.removeKey('description'));

        expect(body.message).toContain('A descrição não pode ser vazia');
        expect(status).toBe(400);
      });

      it('Testing post when description have more than 255 characters', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.repeatChar('description', 65));

        expect(body.message).toContain(
          'A descrição precisa ter entre 1 e 255 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing post when description isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('description', 1));

        expect(body.message).toContain('A descrição precisa ser uma strig');
        expect(status).toBe(400);
      });
    });

    describe('Testing url DTO erros', () => {
      it('Testing post when dont recive url', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.removeKey('url'));

        expect(body.message).toContain('A url não pode ser vazia');
        expect(status).toBe(400);
      });

      it("Testing post when url isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .set('Authorization', token)
          .send(serializeBodyCreate.changeKeyValue('url', 1));

        expect(body.message).toContain('A url precisa ser uma strig');
        expect(status).toBe(400);
      });
    });
  });

  describe('/projects (DELETE)', () => {
    it('Testing delete with id which not exist', async () => {
      const { body, status } = await request(app.getHttpServer())
        .delete('/projects?id=64934e56e1ed93d36835277b')
        .set('Authorization', token);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Project id not found');
      expect(status).toBe(404);
    });

    it('Testing delete with invalid id', async () => {
      const { body, status } = await request(app.getHttpServer())
        .delete('/projects?id=123')
        .set('Authorization', token);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
      expect(status).toBe(400);
    });

    it('Testing delete with sucess', async () => {
      const { body: get } = await request(app.getHttpServer()).get('/projects');

      const { body, status } = await request(app.getHttpServer())
        .delete(`/projects?id=${get[0].id}`)
        .set('Authorization', token);

      expect(body).toEqual({});
      expect(status).toBe(204);
    });
  });

  describe('/projects (PATCH)', () => {
    it('Testing patch with id that not exist', async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch('/projects?id=64934e56e1ed93d36835277b')
        .set('Authorization', token)
        .send(projectsMock.projectToPatch);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Project id not found');
      expect(status).toBe(404);
    });

    it('Testing patch with invalid id', async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch('/projects?id=123')
        .set('Authorization', token)
        .send(projectsMock.projectToPatch);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
      expect(status).toBe(400);
    });

    it('Testing patch with sucess', async () => {
      const { body: get } = await request(app.getHttpServer()).get('/projects');

      const { body, status } = await request(app.getHttpServer())
        .patch(`/projects?id=${get[0].id}`)
        .set('Authorization', token)
        .send(projectsMock.projectToPatch);

      expect(body.name).toEqual(projectsMock.projectUpdated.name);
      expect(body.description).toEqual(projectsMock.projectUpdated.description);
      expect(body.url).toEqual(projectsMock.projectUpdated.url);
      expect(get[0].id).toBe(body.id);
      expect(status).toBe(200);
    });

    describe('Testing name DTO erros', () => {
      const serializeBodyPatch = new SerializeBody({ name: 'Projeto 1' });

      it('Testing patch when name have more than 50 characters', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );
        const id = get[0].id;

        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .set('Authorization', token)
          .send(serializeBodyPatch.repeatChar('name', 20));

        expect(body.message).toContain(
          'O nome precisa ter entre 1 e 50 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing patch when name isn't a string", async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );
        const id = get[0].id;

        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .set('Authorization', token)
          .send(serializeBodyPatch.changeKeyValue('name', 1));

        expect(body.message).toContain('O nome precisa ser uma strig');
        expect(status).toBe(400);
      });
    });

    describe('Testing description DTO erros', () => {
      const serializeBodyPatch = new SerializeBody({ description: 'Good' });

      it('Testing patch when description have more than 255 characters', async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );
        const id = get[0].id;

        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .set('Authorization', token)
          .send(serializeBodyPatch.repeatChar('description', 65));

        expect(body.message).toContain(
          'A descrição precisa ter entre 1 e 255 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing patch when description isn't a string", async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );
        const id = get[0].id;

        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .set('Authorization', token)
          .send(serializeBodyPatch.changeKeyValue('description', 1));

        expect(body.message).toContain('A descrição precisa ser uma strig');
        expect(status).toBe(400);
      });
    });

    describe('Testing url DTO erros', () => {
      const serializeBodyPatch = new SerializeBody({
        url: 'http://project3.com',
      });

      it('Testing patch when dont recive url', async () => {
        const { body, status } = await request(app.getHttpServer())
          .patch('/projects')
          .set('Authorization', token)
          .send(serializeBodyPatch.changeKeyValue('url', ''));

        expect(body.message).toContain('A url não pode ser vazia');
        expect(status).toBe(400);
      });

      it("Testing patch when url isn't a string", async () => {
        const { body: get } = await request(app.getHttpServer()).get(
          '/projects',
        );
        const id = get[0].id;

        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .set('Authorization', token)
          .send(serializeBodyPatch.changeKeyValue('url', 1));

        expect(body.message).toContain('A url precisa ser uma strig');
        expect(status).toBe(400);
      });
    });
  });
});
