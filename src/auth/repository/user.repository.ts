import { AppDataSource } from '../../data-source.js';
import { User } from '../entity/user.js';
export const userRepository = AppDataSource.getRepository(User);
