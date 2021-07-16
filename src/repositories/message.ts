import { EntityRepository, getCustomRepository, Repository } from 'typeorm';
import { Message } from '../entity/Message';
import { User } from '../entity/User';
import { ScriptRepository } from './script';

export interface MessageParams {
  id?: number;
  scriptId: number;
  body: string;
  author: User;
  created: Date;
}

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  findByScriptId(scriptId: number) {
    return this.find({
      where: { script: scriptId },
      relations: ['author'],
      order: { created: 'ASC' },
    });
  }

  async createAndSave(params: MessageParams) {
    const scriptRepository = getCustomRepository(ScriptRepository);
    const script = await scriptRepository.findByIdOrFail(params.scriptId);

    const message = new Message();
    message.script = script;
    message.body = params.body;
    message.author = params.author;
    message.created = params.created;
    return this.manager.save(message);
  }
}
