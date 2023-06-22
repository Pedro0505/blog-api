import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import { CreateProjectDto } from './dto/CreateProject.dto';
import isValidObjectId from '../utils/isValidObjectId';

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
    const validateObjectId = isValidObjectId(id);

    if (validateObjectId) {
      const projectExist = await this.projectsRepository.deleteProjectBydId(id);

      if (projectExist === null) {
        throw new NotFoundException('Project id not found');
      }
    } else {
      throw new BadRequestException('Invalid id');
    }
  }

  public async updateProjectById(project: UpdateProjectDto, id: string) {
    const validateObjectId = isValidObjectId(id);

    if (validateObjectId) {
      const projectExist = await this.projectsRepository.updateProjectById(
        project,
        id,
      );

      if (projectExist === null) {
        throw new NotFoundException('Project id not found');
      } else {
        return projectExist;
      }
    } else {
      throw new BadRequestException('Invalid id');
    }
  }
}
