// core framework
import { AppDataSource } from './data-source.js';
import express, { urlencoded, json, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import 'reflect-metadata';
import './config/container.js';
import { ResponseDto } from './shared/base.response.js';
import { container } from 'tsyringe';
import { LoadData } from './utils/reload-data.js';
import { MovieReloadData } from './utils/reload-movie-data.js';

// feature
import { authRouter } from './auth/router/auth.router.js';
import { movieRouter } from './movie/router/movie.router.js';

// environment
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
const app = express();
const load = container.resolve(LoadData);
const movieReloadData = new MovieReloadData();

app.use(json());
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(morgan(':date[iso] | :method | :url | :status | :res[content-length] - :response-time ms'));

// default route
app.get('/', (req: Request, res: Response) => {
    let message = 'Hello, ';
    if (process.env.NODE_ENV === 'dev') {
        message = message.concat(' Development Environment');
    }
    if (process.env.NODE_ENV === 'prod') {
        message = message.concat(' Production Environment');
    }
    if (process.env.NODE_ENV === 'qa') {
        message = message.concat(' Test Environment');
    }
    const response: ResponseDto<string> = new ResponseDto({
        data: message,
        message: 'application is running',
    });
    res.json(response);
});

// auth feature route
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/movie', movieRouter);

// global error handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        console.error(err.stack);
        const errResponse: ResponseDto<string> = new ResponseDto({
            message: err.message,
            status: 500,
        });
        res.status(500).json(errResponse);
    } else {
        console.error('Unknown error:', err);
        console.log(next.toString());
        const errorResponse: ResponseDto<string> = new ResponseDto({
            message: 'Internal Server Error',
            status: 500,
        });
        res.status(500).json(errorResponse);
    }
});

// start server
AppDataSource.initialize()
    .then(async () => {
        console.log('Database connected');
        await load.load();
        await movieReloadData.loadData();
        app.listen(PORT, () => {
            console.log(`Server running at http://${HOST}:${PORT}`);
        });
    })
    .catch((error) => console.log(error));
