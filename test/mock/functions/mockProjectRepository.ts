import { ProjectsRepository } from 'src/shared/projects/projects.repository';
import { projectsMock } from '../data';

const mockRepositoryProjects: Partial<ProjectsRepository> = {
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

export default mockRepositoryProjects;
