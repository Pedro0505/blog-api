import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelNames from '../../constants/ModelNames';
import { Projects } from '../../db/model/projects.model';
import { Model } from 'mongoose';
import { UpdateProjectDto } from './dto/UpdateProject.dto';
import { CreateProjectDto } from './dto/CreateProject.dto';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(ModelNames.PROJECTS) private projectsModel: Model<Projects>,
  ) {}

  public async getAllProjects() {
    return await this.projectsModel.find();
  }

  public async createProject(project: CreateProjectDto) {
    return await this.projectsModel.create(project);
  }

  public async deleteProjectBydId(id: string) {
    await this.projectsModel.deleteOne({ _id: id });
  }

  public async updateProjectById(project: UpdateProjectDto, id: string) {
    return await this.projectsModel.findByIdAndUpdate(id, project);
  }
}
