import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import ModelNames from 'src/constants/ModelNames';
import { Projects } from 'src/db/model/projects.model';
import { Model } from 'mongoose';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectModel(ModelNames.PROJECTS) private projectsModel: Model<Projects>,
  ) {}

  public async getAll() {
    return await this.projectsModel.find();
  }
}
