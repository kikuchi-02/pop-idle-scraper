import express from 'express';
import compression from 'compression';

import * as twitterController from './controllers/twitter';
import * as scraperController from './controllers/scrape';
import * as textlintController from './controllers/textlint';
import * as magazineController from './controllers/magazine';
import * as authController from './controllers/auth';

import { verifyToken } from './middleware/authentication';

const app = express();

const port = 3000;
app.set('port', port);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());

app.get('*', (req, res, next) => {
  console.log('request', req.path);

  // TODO
  // const cacher = new Cacher<ScrapedResult>(req.originalUrl);
  // const cache = await cacher.getCache();
  // if (cache) {
  //   res.send();
  // }
  next();
});

const authRouter = express.Router();
authRouter.post('/login', authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);
app.use('/api/auth', authRouter);

const routeV1 = express.Router();
routeV1.get('/twitter', twitterController.getTwitter);
routeV1.get('/site', scraperController.getSite);
routeV1.get('/member-table', scraperController.getMemberTable);
routeV1.get('/member-links', scraperController.getMemberLinks);
routeV1.get('/magazines', magazineController.getMagazines);
routeV1.post('/textlint', textlintController.postTextLint);

routeV1.get('/protected', verifyToken, (req, res) => {
  console.log((req as any).decoded);
  res.sendStatus(200);
});

app.use('/api/v1', routeV1);

export default app;
