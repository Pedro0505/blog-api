import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/CreateProject.dto';
import { UpdateProjectDto } from './dto/UpdateProject.dto';

@Controller('/projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  public async getAllProjects() {
    return await this.projectsService.getAllProjects();
  }

  @Post()
  @HttpCode(201)
  public async createProject(@Body() project: CreateProjectDto) {
    return await this.projectsService.createProject(project);
  }

  @Delete()
  @HttpCode(204)
  public async deleteProjectBydId(@Query() query: { id: string }) {
    await this.projectsService.deleteProjectBydId(query.id);
  }

  @Patch()
  @HttpCode(200)
  public async updateProjectById(
    @Body() project: UpdateProjectDto,
    @Query() query: { id: string },
  ) {
    return await this.projectsService.updateProjectById(project, query.id);
  }
}
