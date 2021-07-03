import { Request, Response } from 'express';
import { Magazine } from '../typing';

import { todaysMagazines } from '../libs/magazine';

export const getMagazines = async (req: Request, res: Response) => {
  const date = req.query.date;
  let magazines: Magazine[][];
  if (date) {
    magazines = await todaysMagazines(date as string);
  } else {
    magazines = await todaysMagazines();
  }
  res.send(JSON.stringify(magazines));
  return;
};
