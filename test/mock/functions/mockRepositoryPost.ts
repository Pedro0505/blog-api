import { PostsRepository } from 'src/shared/posts/posts.repository';
import { postsMock } from '../data';

const mockRepositoryPost: Partial<PostsRepository> = {
  getAllPosts: jest.fn().mockResolvedValue(postsMock.posts),
  getPostById: jest.fn().mockResolvedValue(postsMock.posts[0]),
};

export default mockRepositoryPost;
