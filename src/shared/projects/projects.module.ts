import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';
import { ProjectsService } from './projects.service';
import { modelForFeature, modelForRoot } from '../../db/model.db';

@Module({
  imports: [modelForFeature, modelForRoot],
  controllers: [ProjectsController],
  providers: [ProjectsRepository, ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
