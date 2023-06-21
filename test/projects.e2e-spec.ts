import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ProjectsService } from '../src/shared/projects/projects.service';
import { ProjectsRepository } from '../src/shared/projects/projects.repository';
import { ProjectsController } from '../src/shared/projects/projects.controller';
import { projectsMock } from './mock';
import SerializeBody from './utils/SerializeBody';

describe('Testing Projects Route (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockRepository: Partial<ProjectsRepository> = {
      getAllProjects: jest.fn().mockResolvedValue(projectsMock.projects),
      createProject: jest.fn().mockResolvedValue(projectsMock.projectCreated),
      deleteProjectBydId: jest.fn().mockResolvedValue(undefined),
      updateProjectById: jest
        .fn()
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
    await app.init();
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

      it('Testing post when description have more than 50 characters', async () => {
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
  });

  it('/projects (DELETE)', async () => {
    const { body: projectsBody } = await request(app.getHttpServer()).get(
      '/projects',
    );

    const { body, status } = await request(app.getHttpServer()).delete(
      `/projects?id=${projectsBody[0].id}`,
    );

    expect(body).toEqual({});
    expect(status).toBe(204);
  });

  it('/projects (PATCH)', async () => {
    const { body: projectsBody } = await request(app.getHttpServer()).get(
      '/projects',
    );

    const { body, status } = await request(app.getHttpServer())
      .patch(`/projects?id=${projectsBody[0].id}`)
      .send(projectsMock.projectToPatch);

    expect(body).toEqual(projectsMock.projectUpdated);
    expect(projectsBody[0].id).toBe(projectsMock.projectUpdated.id);
    expect(status).toBe(200);
  });
});
