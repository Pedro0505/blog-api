import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProjectsService } from '../src/shared/projects/projects.service';
import { ProjectsRepository } from '../src/shared/projects/projects.repository';
import { ProjectsController } from '../src/shared/projects/projects.controller';

describe('Testing Projects Route (e2e)', () => {
  let app: INestApplication;

  const projects = [
    {
      id: '6491cd4543f10f90bb09ed7d',
      name: 'Projeto 1',
      url: 'https://projeto1.com',
      description: 'Good',
    },
    {
      id: '6491cd4543f10f90bb09ed7c',
      name: 'Projeto 2',
      url: 'https://projeto2.com',
      description: 'Good',
    },
  ];

  beforeAll(async () => {
    const mockRepository = {
      getAllProjects: jest.fn().mockResolvedValue(projects),
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

    expect(body).toStrictEqual(projects);
    expect(status).toStrictEqual(200);
  });
});
