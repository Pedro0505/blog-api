import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PostsService } from '../../shared/posts/posts.service';
import { postsData, projectsData } from './data';
import { ProjectsService } from '../../shared/projects/projects.service';

@Injectable()
export default class Seeds implements OnApplicationBootstrap {
  constructor(
    private readonly postService: PostsService,
    private readonly projectService: ProjectsService,
  ) {}

  public async createPostSeed() {
    const posts = await this.postService.getAllPosts();

    if (posts.length === 0) {
      const postsPromise = postsData.map((e) => this.postService.createPost(e));

      await Promise.all(postsPromise);

      console.log('Posts seeds were applied');
    }
  }

  public async createProjectSeed() {
    const projects = await this.projectService.getAllProjects();

    if (projects.length === 0) {
      const projectsPromise = projectsData.map((e) =>
        this.projectService.createProject(e),
      );

      await Promise.all(projectsPromise);

      console.log('Projects seeds were applied');
    }
  }

  onApplicationBootstrap() {
    const NODE_ENV = process.env.NODE_ENV || 'DEV';

    if (NODE_ENV === 'DEV') {
      this.createPostSeed();
      this.createProjectSeed();
    }
  }
}
