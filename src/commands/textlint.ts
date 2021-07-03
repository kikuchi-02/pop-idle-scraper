import { TextLintEngine } from 'textlint';
import { join } from 'path';

const textLintEngine = new TextLintEngine();

(async () => {
  const fp = join(process.cwd(), 'sample.txt');
  const res = await textLintEngine.executeOnFiles([fp]);
  const result = textLintEngine.formatResults(res);

  // writeFileSync('result.txt', result);
  console.log(result);
})();
