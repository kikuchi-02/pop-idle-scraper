import { Express, Router } from 'express';
import * as authController from './controllers/authentication';
import * as dictionaryController from './controllers/dictionary';
import * as magazineController from './controllers/magazine';
import * as messageController from './controllers/message';
import * as scraperController from './controllers/scrape';
import * as scriptController from './controllers/script';
import * as textlintController from './controllers/textlint';
import * as twitterController from './controllers/twitter';
import { verifyToken } from './middleware/authentication';

export const setRoutes = (app: Express) => {
  app.use('*', (req, res, next) => {
    console.log('request', req.method, req.baseUrl);

    // TODO
    // const cacher = new Cacher<ScrapedResult>(req.originalUrl);
    // const cache = await cacher.getCache();
    // if (cache) {
    //   res.send();
    // }
    next();
  });

  const authRouter = Router();
  authRouter.post('/login', authController.login);
  authRouter.post('/refresh', authController.refresh);
  app.use('/api/auth', authRouter);

  const routeV1 = Router();
  routeV1.get('/twitter', twitterController.getTwitter);
  routeV1.get('/site', scraperController.getSite);
  routeV1.get('/member-table', scraperController.getMemberTable);
  routeV1.get('/member-links', scraperController.getMemberLinks);
  routeV1.get('/magazines', magazineController.getMagazines);

  routeV1.get('/scripts', verifyToken, scriptController.readScripts);
  routeV1.get('/scripts/:id', verifyToken, scriptController.readScript);
  routeV1.put('/scripts/:id', verifyToken, scriptController.updateScript);
  routeV1.post('/scripts', verifyToken, scriptController.createScript);
  routeV1.delete('/scripts', verifyToken, scriptController.deleteScripts);
  routeV1.delete('/scripts/:id', verifyToken, scriptController.deleteScript);

  routeV1.get('/messages', verifyToken, messageController.readMessage);
  routeV1.post('/messages', verifyToken, messageController.createMessage);
  routeV1.delete('/messages', verifyToken, messageController.deleteMessages);
  routeV1.delete('/messages/:id', verifyToken, messageController.deleteMessage);

  routeV1.post('/textlint', verifyToken, textlintController.postTextLint);

  routeV1.get(
    '/dictionary',
    verifyToken,
    dictionaryController.getUserDictionary
  );
  routeV1.put(
    '/dictionary',
    verifyToken,
    dictionaryController.updateUserDictionary
  );

  app.use('/api/v1', routeV1);
  return app;
};
