import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { dbConfig } from './conf';
import { User } from './entity/User';
import { RefreshTokenRepository } from './repositories/refreshToken';

// import * as uuid from 'uuid';

Object.assign(dbConfig, {
  // synchronize: true,
  // migrationsRun: false,
  // dropSchema: true,
});

createConnection(dbConfig)
  .then(async (connection) => {
    // console.log('Inserting a new user into the database...');
    const user = new User();
    user.name = 'Timber';
    user.email = 'test@example.com';
    user.password = 'password';
    // // await connection.manager.save(user);
    const userRepository = connection.getRepository(User);
    await userRepository.save(user);
    // console.log("Saved a new user with id: " + user.id);

    // // console.log("Loading users from the database...");
    // const users = await userRepository.findOne(99);
    // console.log('Loaded users: ', users);

    // const token = new RefreshToken();
    // const now = new Date();
    // token.expiryDate = new Date(now.getTime() + 1000 * 60 * 60 * 48);
    // token.user = users;
    // // await connection.manager.save(token);

    const tokenRepository = connection.getCustomRepository(
      RefreshTokenRepository
    );
    // const uid = uuid.v4();
    // const newToken = await tokenRepository.findByToken(uid);
    // console.log({ newToken });

    // const newUser = await userRepository.findOne();
    // console.log({ token, newToken, newUser });
  })
  .catch((error) => console.log(error));
