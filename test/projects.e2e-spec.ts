import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProjectsService } from '../src/shared/projects/projects.service';
import { ProjectsRepository } from '../src/shared/projects/projects.repository';
import { ProjectsController } from '../src/shared/projects/projects.controller';
import { projectsMock } from './mock';

describe('Testing Projects Route (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const mockRepository: Partial<ProjectsRepository> = {
      getAllProjects: jest.fn().mockResolvedValue(projectsMock.projects),
      createProject: jest.fn().mockResolvedValue(projectsMock.projectCreated),
      deleteProjectBydId: jest.fn().mockResolvedValue(undefined),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsRepository, ProjectsService],
    })
      .overrideProvider(ProjectsRepository)
      .useValue(mockRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/projects (GET)', async () => {
    const { body, status } = await request(app.getHttpServer()).get(
      '/projects',
    );

    expect(body).toStrictEqual(projectsMock.projects);
    expect(status).toStrictEqual(200);
  });

  it('/projects (POST)', async () => {
    const { body, status } = await request(app.getHttpServer())
      .post('/projects')
      .send(projectsMock.projectToCreate);

    expect(body).toStrictEqual(projectsMock.projectCreated);
    expect(status).toStrictEqual(201);
  });

  it('/projects (DELETE)', async () => {
    const { body: projectsBody } = await request(app.getHttpServer()).get(
      '/projects',
    );

    const { body, status } = await request(app.getHttpServer()).delete(
      `/projects?id=${projectsBody[0].id}`,
    );

    expect(body).toEqual({});
    expect(status).toStrictEqual(204);
  });
});
