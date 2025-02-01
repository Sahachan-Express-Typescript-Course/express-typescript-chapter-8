import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Auth } from './auth/entity/auth.js';
import { RefreshToken } from './auth/entity/refresh-token.js';
import { Role } from './auth/entity/role.js';
import { User } from './auth/entity/user.js';
import { Movie } from './movie/entity/movie.model.js';
import { Comment } from './movie/entity/comment.model.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.RESET_DB === 'true',
    logging: false,
    entities: [Auth, RefreshToken, Role, User, Movie, Comment],
    // migrations: [Auth, RefreshToken, Role, User, Movie, Comment],
});
