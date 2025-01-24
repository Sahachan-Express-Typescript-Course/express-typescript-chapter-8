import { AppDataSource } from '../../data-source.js';
import { Role } from '../entity/role.js';
export const roleRepository = AppDataSource.getRepository(Role);
