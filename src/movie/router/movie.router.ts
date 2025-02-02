import { Router } from 'express';
import { MovieController } from '../controller/movie.controller.js';
import { adminGuard } from '../../middleware/admin.middleware.js';
import { asyncHandler } from '../../utils/handler.global.js';
import { staffGuard } from '../../middleware/staff.middleware.js';

const movieRouter = Router();
const movieController = new MovieController();

// filter name
movieRouter.get('/filter/name/:title', movieController.getMoviesByTitle); // ✅ เพิ่ม route สำหรับค้นหาหนังตามชื่อ

// movie feature
movieRouter.get('/', movieController.getAllMovies);
movieRouter.get('/:id', movieController.getMovieById);
movieRouter.post('/', adminGuard, asyncHandler(movieController.createMovie));
movieRouter.put('/:id', movieController.updateMovie);
movieRouter.delete('/:id', movieController.deleteMovie);

// comment feature
movieRouter.post('/:id/comment', movieController.addComment);
movieRouter.get('/:id/comment/:comment_id', movieController.getCommentById);
movieRouter.put('/:id/comment/:comment_id', movieController.updateComment);
movieRouter.delete('/:id/comment/:comment_id', movieController.deleteComment);

// advance feature
movieRouter.get('/:id/avg', staffGuard, asyncHandler(movieController.getAvgRating));
movieRouter.get('/summary/comment', staffGuard, asyncHandler(movieController.getTotalCommentFromEachMovie));
movieRouter.get('/summary/rating', staffGuard, asyncHandler(movieController.getMovieRateSummary));
movieRouter.get('/summary/search', staffGuard, asyncHandler(movieController.searchMovie));

//sorting by name
movieRouter.get('/sorting/sort-by', movieController.sortedMoviesbyname);


// New feature: Filter movies by release date
movieRouter.get('/filter/release', movieController.searchMoviesByReleaseDate);

export { movieRouter };
