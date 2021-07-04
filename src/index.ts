import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { dbConfig } from './conf';
import { User } from './entity/User';

import bcrypt from 'bcrypt';

createConnection(dbConfig)
  .then(async (connection) => {
    console.log('Inserting a new user into the database...');
    const user = new User();
    user.name = 'Timber';
    user.email = 'Saw';
    user.password = '23';
    // await connection.manager.save(user);
    const userRepository = connection.getRepository(User);
    // await userRepository.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // console.log("Loading users from the database...");
    const users = await userRepository.find();
    console.log('Loaded users: ', users);

    for (const user of users) {
      const compared = await bcrypt.compare('23', user.password);
      console.log(compared);
    }

    console.log('Here you can setup and run express/koa/any other framework.');
  })
  .catch((error) => console.log(error));
