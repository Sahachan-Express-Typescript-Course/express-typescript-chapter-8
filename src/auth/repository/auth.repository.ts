import { AppDataSource } from '../../data-source.js';
import { Auth } from '../entity/auth.js';
export const authRepository = AppDataSource.getRepository(Auth);