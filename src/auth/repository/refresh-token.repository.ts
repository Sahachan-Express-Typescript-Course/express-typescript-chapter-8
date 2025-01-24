import { AppDataSource } from '../../data-source.js';
import { RefreshToken } from '../entity/refresh-token.js';
export const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
