import 'express';
import { User } from './src/entity/User';

declare module 'express' {
  interface Request {
    user?: User;
  }
}
