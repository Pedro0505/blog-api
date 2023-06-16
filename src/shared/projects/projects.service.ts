import { Injectable } from '@nestjs/common';
import { ProjectsRepository } from './projects.repository';

@Injectable()
export class ProjectsService {
  constructor(private projectsRepository: ProjectsRepository) {}

  public async getAll() {
    return await this.projectsRepository.getAll();
  }
}
