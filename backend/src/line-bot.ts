import { Client, ClientConfig, Message } from '@line/bot-sdk';
import { ENV_SETTINGS } from './conf';
import { todaysMagazines } from './magazine';

const magazineText = async (): Promise<string> => {
  const magazines = await todaysMagazines();

  let text = '今日の雑誌\n';

  text += magazines.reduce((accText, group, index) => {
    accText += `優先度${index + 1}\n`;
    accText +=
      group.reduce((acc, curr) => {
        acc += `${curr.title}\n${curr.link || 'no link'}\n`;
        return acc;
      }, '') || 'なし';
    accText += '\n';
    return accText;
  }, '');
  return text;
};

(async () => {
  const clientConfig: ClientConfig = {
    channelAccessToken: ENV_SETTINGS.LINE_CHANNEL_ACCESS_TOKEN,
  };

  const client = new Client(clientConfig);

  let text = '';
  text += await magazineText();
  const message: Message = {
    type: 'text',
    text: text,
  };
  client.broadcast(message);
})();
