import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConnections } from './utils/MongooseConnections';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { userMock } from './mock/data';

describe('Testing Users Route (e2e)', () => {
  let app: INestApplication;
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
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    process.env = originalEnv;
    await mongooseConnections.remove('users');
    await app.close();
  });

  describe('Testing /user/register POST', () => {
    it('Testing when successfully register', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post('/user/register')
        .send({ username: 'Pedro', password: 'mimhaSenha2' })
        .set('owner-key', 'secreto');

      expect(status).toBe(201);
      expect(body.id).toBeDefined();
      expect(body.username).toBe('Pedro');

      await mongooseConnections.remove('users');
    });

    it('Testing when uses wrong credentials to register', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post('/user/register')
        .send(fakeUser)
        .set('owner-key', 'pouco_secreto');

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('User unauthorized');
    });

    it('Testing when trying to create a user that already exists', async () => {
      await request(app.getHttpServer())
        .post('/user/register')
        .send(fakeUser)
        .set('owner-key', 'secreto');

      const { body, status } = await request(app.getHttpServer())
        .post('/user/register')
        .send(fakeUser)
        .set('owner-key', 'secreto');

      expect(status).toBe(409);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Usuário já existe');
    });
  });

  describe('Testing /user/login POST', () => {
    beforeAll(async () => {
      await mongooseConnections.insert('users', [userMock.user]);
    });

    afterAll(async () => {
      await mongooseConnections.remove('users');
    });

    it('Testing when successfully login', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post('/user/login')
        .send(fakeUser);

      expect(status).toBe(201);
      expect(body.token).toBeDefined();
    });

    it('Testing when trying to login a user that not exists', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post('/user/login')
        .send({ username: 'Pedro', password: 'minhaSenha1' });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Usuário não cadastrado');
    });

    it('Testing when trying to login a user using wrong password', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post('/user/login')
        .send({ username: 'Jonh Doe', password: 'senhaNova1' });

      expect(status).toBe(401);
      expect(body.message).toBeDefined();
      expect(body.message).toBe('Usuário ou senha incorreta');
    });
  });
});
