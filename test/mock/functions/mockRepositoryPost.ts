import { PostsRepository } from 'src/shared/posts/posts.repository';
import { postsMock } from '../data';

const mockRepositoryPost: Partial<PostsRepository> = {
  getAllPosts: jest.fn().mockResolvedValue(postsMock.posts),
};

export default mockRepositoryPost;
