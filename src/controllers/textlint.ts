import { TextLintEngine } from 'textlint';
import { Request, Response } from 'express';
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
