import { EntityRepository, Repository } from 'typeorm';
import { Script } from '../entity/Script';
import { User } from '../entity/User';
import { DeltaOperation } from '../typing';

export interface ScriptParams {
  id?: number;
  title: string;
  deltaOps: DeltaOperation[];
  author: User;
  // status: ScriptStatus;
}

@EntityRepository(Script)
export class ScriptRepository extends Repository<Script> {
  findBulk() {
    return this.find({
      select: [
        'id',
        'title',
        'created',
        'updated',
        /*'status'*/
      ],
      relations: ['author'],
      order: { updated: 'DESC' },
    });
  }
  findById(id: number) {
    return this.findOne(id, { relations: ['author'] });
  }
  findByIdOrFail(id: number) {
    return this.findOneOrFail(id, { relations: ['author'] });
  }

  async updateOrFail(params: ScriptParams) {
    const script = await this.findOneOrFail(params.id);
    script.title = params.title;
    script.deltaOps = params.deltaOps;
    script.author = params.author;
    // script.status = params.status;
    return this.manager.save(script);
  }

  createAndSave(params: ScriptParams) {
    const script = new Script();
    script.title = params.title;
    script.deltaOps = params.deltaOps;
    script.author = params.author;
    return this.manager.save(script);
  }

  deleteById(id: number) {
    return this.delete(id);
  }

  deleteBulk(ids: number[] | string[]) {
    return this.delete(ids);
  }
}
