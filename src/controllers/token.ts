import { Request, Response } from 'express';
import { builder, IpadicFeatures, Tokenizer } from 'kuromoji';

let tokenizer: Tokenizer<IpadicFeatures>;

const createTokenizer = async (): Promise<Tokenizer<IpadicFeatures>> => {
  if (tokenizer) {
    return Promise.resolve(tokenizer);
  }
  return new Promise((resolve, reject) => {
    builder({ dicPath: './node_modules/kuromoji/dict/' }).build(function (
      err,
      newTokenizer
    ) {
      if (err) {
        reject(err);
      } else {
        tokenizer = newTokenizer;
        resolve(newTokenizer);
      }
    });
  });
};

export const postTokenize = async (req: Request, res: Response) => {
  const text = req.body.text;

  const tokenizer = await createTokenizer();
  const tokens = tokenizer.tokenize(text);

  res.json(tokens);
  return;
};
