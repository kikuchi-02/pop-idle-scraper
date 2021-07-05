import { Request, Response } from 'express';
import { TextLintEngine } from 'textlint';
const textLintEngine = new TextLintEngine();

export const postTextLint = async (req: Request, res: Response) => {
  const text = req.body?.text;
  if (!text) {
    res.sendStatus(400).end();
    return;
  }
  const result = await textLintEngine.executeOnText(text);
  res.send(result).end();
};
