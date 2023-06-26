import { PostsRepository } from 'src/shared/posts/posts.repository';
import { postsMock } from '../data';

const mockRepositoryPost: Partial<PostsRepository> = {
  getAllPosts: jest.fn().mockResolvedValue(postsMock.posts),
  getPostById: jest.fn().mockResolvedValue(postsMock.posts[0]),
  createPost: jest.fn().mockResolvedValue(postsMock.postCreated),
  deletePostBydId: jest
    .fn()
    .mockResolvedValueOnce(null)
    .mockResolvedValue(postsMock.posts[0]),
  updatePostById: jest
    .fn()
    .mockResolvedValueOnce(null)
    .mockResolvedValue(postsMock.postUpdated),
};

export default mockRepositoryPost;
