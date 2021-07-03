import app from './app';

import { createConnection, getConnection } from 'typeorm';
import { dbConfig } from './conf';

import 'reflect-metadata';

createConnection(dbConfig)
  .then(async (connection) => {
    const server = app.listen(app.get('port'), () => {
      console.log(`app is running at http://localhost:${app.get('port')}`);
    });
  })
.catch((error) => console.error('TypeORM connection error', error))
