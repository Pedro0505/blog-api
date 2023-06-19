import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import IProjectBodyCreate from './interfaces/IProjectBodyCreate';
import IProjectBodyUpdate from './interfaces/IProjectBodyUpdate';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepository: ProjectsRepository) {}

  public async getAllProjects() {
    return await this.projectsRepository.getAllProjects();
  }

  public async createProject(project: IProjectBodyCreate) {
    return await this.projectsRepository.createProject(project);
  }

  public async deleteProjectBydId(id: string) {
    await this.projectsRepository.deleteProjectBydId(id);
  }

  public async updateProjectById(project: IProjectBodyUpdate, id: string) {
    return await this.projectsRepository.updateProjectById(project, id);
  }
}
