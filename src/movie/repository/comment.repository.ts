import { AppDataSource } from '../../data-source.js';
import { Comment } from '../entity/comment.model.js';
export const CommentRepository = AppDataSource.getRepository(Comment);
