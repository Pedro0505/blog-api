import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelNames from 'src/constants/ModelNames';
import { Projects } from 'src/db/model/projects.model';
import { Model } from 'mongoose';
import IProjectBodyCreate from './interfaces/IProjectBodyCreate';
import IProjectBodyUpdate from './interfaces/IProjectBodyUpdate';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(ModelNames.PROJECTS) private projectsModel: Model<Projects>,
  ) {}

  public async getAllProjects() {
    return await this.projectsModel.find();
  }

  public async createProject(project: IProjectBodyCreate) {
    return await this.projectsModel.create(project);
  }

  public async deleteProjectBydId(id: string) {
    await this.projectsModel.deleteOne({ _id: id });
  }

  public async updateProjectById(project: IProjectBodyUpdate, id: string) {
    return await this.projectsModel.findByIdAndUpdate(id, project);
  }
}
