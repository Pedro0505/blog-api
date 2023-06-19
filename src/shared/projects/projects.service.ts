import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import { CreateProjectDto } from './dto/CreateProject.dto';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepository: ProjectsRepository) {}

  public async getAllProjects() {
    return await this.projectsRepository.getAllProjects();
  }

  public async createProject(project: CreateProjectDto) {
    return await this.projectsRepository.createProject(project);
  }

  public async deleteProjectBydId(id: string) {
    await this.projectsRepository.deleteProjectBydId(id);
  }

  public async updateProjectById(project: UpdateProjectDto, id: string) {
    return await this.projectsRepository.updateProjectById(project, id);
  }
}
