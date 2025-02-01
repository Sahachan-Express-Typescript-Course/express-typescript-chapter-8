import { MovieService } from '../movie/service/movie.service.js';
import { MovieRequest } from '../movie/payload/request/movie.request.js';
import { CommentRequest } from '../movie/payload/request/comment.request.js';
import { AppDataSource } from '../data-source.js';
// import { MovieRepository } from '../movie/repository/movie.repository.js';
// import { CommentRepository } from '../movie/repository/comment.repository.js';

export class MovieReloadData {
    movieService: MovieService;
    constructor() {
        this.movieService = new MovieService();
    }

    async loadData() {
        if (process.env.RELOAD_MOVIE_DATA === 'true') {
            console.log('Reloading data');
            await AppDataSource.query('TRUNCATE TABLE tb_comment, tb_movie RESTART IDENTITY CASCADE');

            // await CommentRepository.clear();
            // await MovieRepository.clear();
            await this.addMovie();
            await this.addComment();
        }
    }

    async addMovie() {
        const movie1: MovieRequest = {
            poster: 'https://www.imdb.com/title/tt0111161/mediaviewer/rm10105600',
            title: 'Shawshank Redemption',
            description: 'Two imprisoned',
            releaseDate: new Date('1994-10-14'),
        };
        const movie2: MovieRequest = {
            poster: 'https://www.imdb.com/title/tt1375666/mediaviewer/rm10105600',
            title: 'Inception',
            description: 'A thief who enters the dreams of others',
            releaseDate: new Date('2010-07-16'),
        };
        const movie3: MovieRequest = {
            poster: 'https://www.imdb.com/title/tt0499549/mediaviewer/rm10105600',
            title: 'Avatar',
            description: 'A marine on an alien planet',
            releaseDate: new Date('2009-12-18'),
        };
        await this.movieService.saveMovie(movie1);
        await this.movieService.saveMovie(movie2);
        await this.movieService.saveMovie(movie3);
    }

    async addComment() {
        const movies = await this.movieService.getMovies();
        movies.forEach(async (movie) => {
            const comment1: CommentRequest = {
                content: 'Great movie',
                rate: 5,
            };
            const comment2: CommentRequest = {
                content: 'Not bad',
                rate: 3,
            };
            if (movie.id) {
                await this.movieService.addComment(movie.id, comment1);
                await this.movieService.addComment(movie.id, comment2);
            }
        });
    }
}