import { Router } from 'express';
import { handleFile } from '../controller/media.controller.js';

const mediaRouter = Router();

mediaRouter.post('/upload', handleFile);

export { mediaRouter };
