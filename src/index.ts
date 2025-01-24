import { AppDataSource } from './data-source.js';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan(':date[iso] | :method | :url | :status | :res[content-length] - :response-time ms'));

// default route
app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

AppDataSource.initialize()
    .then(async () => {
        console.log('Database connected');
        app.listen(PORT, () => {
            console.log(`Server running at http://${HOST}:${PORT}`);
        });
    })
    .catch((error) => console.log(error));
