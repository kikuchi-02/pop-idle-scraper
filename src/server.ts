import compression from 'compression';
import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { setRoutes } from './router';

createConnection()
  .then((connection) => {
    const app = express();

    const port = 3000;
    app.set('port', port);

    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(compression());

    setRoutes(app);

    app.listen(app.get('port'), () => {
      console.log(`app is running at http://localhost:${app.get('port')}`);
    });
  })
  .catch((error) => console.error('TypeORM connection error', error));
