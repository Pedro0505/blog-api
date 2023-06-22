import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProjectsService } from '../src/shared/projects/projects.service';
import { ProjectsRepository } from '../src/shared/projects/projects.repository';
import { ProjectsController } from '../src/shared/projects/projects.controller';
import { projectsMock } from './mock';
import SerializeBody from './utils/SerializeBody';
import ValidatorMiddleware from '../src/shared/middleware/Validator.middleware';

describe('Testing Projects Route (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockRepository: Partial<ProjectsRepository> = {
      getAllProjects: jest.fn().mockResolvedValue(projectsMock.projects),
      createProject: jest.fn().mockResolvedValue(projectsMock.projectCreated),
      deleteProjectBydId: jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValue(undefined),
      updateProjectById: jest
        .fn()
        .mockResolvedValueOnce(null)
        .mockResolvedValue(projectsMock.projectUpdated),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsRepository, ProjectsService],
    })
      .overrideProvider(ProjectsRepository)
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    app.use(new ValidatorMiddleware().use);
    await app.init();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('/projects (GET)', async () => {
    const { body, status } = await request(app.getHttpServer()).get(
      '/projects',
    );

    expect(body).toStrictEqual(projectsMock.projects);
    expect(status).toBe(200);
  });

  describe('/projects (POST)', () => {
    const serializeBodyCreate = new SerializeBody(projectsMock.projectToCreate);

    it('Testing post with sucess', async () => {
      const { body, status } = await request(app.getHttpServer())
        .post('/projects')
        .send(projectsMock.projectToCreate);

      expect(body).toStrictEqual(projectsMock.projectCreated);
      expect(status).toBe(201);
    });

    describe('Testing name DTO erros', () => {
      it('Testing post when dont recive name', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.removeKey('name'));

        expect(body.message).toContain('O nome não pode ser vazio');
        expect(status).toBe(400);
      });

      it('Testing post when name have more than 50 characters', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.repeatChar('name', 25));

        expect(body.message).toContain(
          'O nome precisa ter entre 1 e 50 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing post when name isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.changeKeyValue('name', 1));

        expect(body.message).toContain('O nome precisa ser uma strig');
        expect(status).toBe(400);
      });
    });

    describe('Testing description DTO erros', () => {
      it('Testing post when dont recive description', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.removeKey('description'));

        expect(body.message).toContain('A descrição não pode ser vazia');
        expect(status).toBe(400);
      });

      it('Testing post when description have more than 255 characters', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.repeatChar('description', 65));

        expect(body.message).toContain(
          'A descrição precisa ter entre 1 e 255 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing post when description isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.changeKeyValue('description', 1));

        expect(body.message).toContain('A descrição precisa ser uma strig');
        expect(status).toBe(400);
      });
    });

    describe('Testing url DTO erros', () => {
      it('Testing post when dont recive url', async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.removeKey('url'));

        expect(body.message).toContain('A url não pode ser vazia');
        expect(status).toBe(400);
      });

      it("Testing post when url isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .post('/projects')
          .send(serializeBodyCreate.changeKeyValue('url', 1));

        expect(body.message).toContain('A url precisa ser uma strig');
        expect(status).toBe(400);
      });
    });
  });

  describe('/projects (DELETE)', () => {
    const id = projectsMock.projects[0].id;

    it('Testing delete with id which not exist', async () => {
      const { body, status } = await request(app.getHttpServer()).delete(
        '/projects?id=64934e56e1ed93d36835277b',
      );

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Project id not found');
      expect(status).toBe(404);
    });

    it('Testing delete with invalid id', async () => {
      const { body, status } = await request(app.getHttpServer()).delete(
        '/projects?id=123',
      );

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
      expect(status).toBe(400);
    });

    it('Testing delete with sucess', async () => {
      const { body, status } = await request(app.getHttpServer()).delete(
        `/projects?id=${id}`,
      );

      expect(body).toEqual({});
      expect(status).toBe(204);
    });
  });

  describe('/projects (PATCH)', () => {
    const id = projectsMock.projects[0].id;

    it('Testing patch with id that not exist', async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch('/projects?id=64934e56e1ed93d36835277b')
        .send(projectsMock.projectToPatch);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Project id not found');
      expect(status).toBe(404);
    });

    it('Testing patch with invalid id', async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch('/projects?id=123')
        .send(projectsMock.projectToPatch);

      expect(body).toHaveProperty('message');
      expect(body.message).toBe('Invalid id');
      expect(status).toBe(400);
    });

    it('Testing patch with sucess', async () => {
      const { body, status } = await request(app.getHttpServer())
        .patch(`/projects?id=${id}`)
        .send(projectsMock.projectToPatch);

      expect(body).toEqual(projectsMock.projectUpdated);
      expect(id).toBe(projectsMock.projectUpdated.id);
      expect(status).toBe(200);
    });

    describe('Testing name DTO erros', () => {
      const serializeBodyPatch = new SerializeBody({ name: 'Projeto 1' });

      it('Testing patch when name have more than 50 characters', async () => {
        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .send(serializeBodyPatch.repeatChar('name', 20));

        expect(body.message).toContain(
          'O nome precisa ter entre 1 e 50 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing patch when name isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .send(serializeBodyPatch.changeKeyValue('name', 1));

        expect(body.message).toContain('O nome precisa ser uma strig');
        expect(status).toBe(400);
      });
    });

    describe('Testing description DTO erros', () => {
      const serializeBodyPatch = new SerializeBody({ description: 'Good' });

      it('Testing patch when description have more than 255 characters', async () => {
        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .send(serializeBodyPatch.repeatChar('description', 65));

        expect(body.message).toContain(
          'A descrição precisa ter entre 1 e 255 caracteres',
        );
        expect(status).toBe(400);
      });

      it("Testing patch when description isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
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
          .send(serializeBodyPatch.changeKeyValue('url', ''));

        expect(body.message).toContain('A url não pode ser vazia');
        expect(status).toBe(400);
      });

      it("Testing patch when url isn't a string", async () => {
        const { body, status } = await request(app.getHttpServer())
          .patch(`/projects?id=${id}`)
          .send(serializeBodyPatch.changeKeyValue('url', 1));

        expect(body.message).toContain('A url precisa ser uma strig');
        expect(status).toBe(400);
      });
    });
  });
});
