import { AppDataSource } from '../../data-source.js';
import { Movie } from '../entity/movie.model.js';
export const MovieRepository = AppDataSource.getRepository(Movie);
