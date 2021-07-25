import {
  EntityRepository,
  getCustomRepository,
  IsNull,
  Repository,
} from 'typeorm';
import { Message } from '../entity/Message';
import { User } from '../entity/User';
import { ScriptRepository } from './script';

export interface MessageParams {
  id?: number;
  scriptId: number;
  body: string;
  author: User;
  uuid?: string;
  parentId?: number;
}

@EntityRepository(Message)
export class MessageRepository extends Repository<Message> {
  findByScriptIdWithChildren(scriptId: number) {
    return this.find({
      where: { script: scriptId, parent: IsNull() },
      relations: ['author', 'children', 'children.author'],
      order: { created: 'ASC' },
    });
  }

  findByIdOrFail(id: number) {
    return this.findOneOrFail(id);
  }

  async createAndSave(params: MessageParams) {
    const scriptRepository = getCustomRepository(ScriptRepository);
    const script = await scriptRepository.findByIdOrFail(params.scriptId);

    const message = new Message();
    message.script = script;
    message.body = params.body;
    message.author = params.author;
    message.uuid = params.uuid;
    if (params.parentId) {
      const parent = await this.findByIdOrFail(params.parentId);
      message.parent = parent;
    }
    return this.manager.save(message);
  }
}
