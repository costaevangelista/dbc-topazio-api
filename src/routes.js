import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/muter';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import PublisherHouseController from './app/controllers/PublisherHouseController';
import BookController from './app/controllers/BookController';
import BookFavoriteController from './app/controllers/BookFavoriteController';

import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const updload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/users', UserController.index);
routes.get('/users/:id', UserController.show);
routes.put('/users', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.get('/publishers', PublisherHouseController.index);
routes.post('/publishers', PublisherHouseController.store);
routes.put('/publishers/:id', PublisherHouseController.update);
routes.delete('/publishers/:id', PublisherHouseController.delete);

routes.get('/books', BookController.index);
routes.get('/books/:id', BookController.show);
routes.post('/books', BookController.store);
routes.put('/books/:id', BookController.update);
routes.delete('/books/:id', BookController.delete);

routes.post('/books/:id/favorite', BookFavoriteController.store);

routes.post('/files', updload.single('file'), FileController.store);

export default routes;
