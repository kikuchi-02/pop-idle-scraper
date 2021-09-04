import { EntityRepository, Repository } from 'typeorm';
import { Script, ScriptRevision } from '../entity/Script';
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
        /* 'status'*/
      ],
      relations: ['author'],
      order: { updated: 'DESC' },
    });
  }
  findById(id: number) {
    return this.createQueryBuilder('script')
      .leftJoinAndSelect('script.revisions', 'script_revision')
      .leftJoinAndSelect('script.author', 'author')
      .where('script.id = :id', { id })
      .orderBy('script_revision.created')
      .getOne();
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
    const updated = await this.manager.save(script);
    return this.findById(updated.id);
  }

  async createAndSave(params: ScriptParams) {
    const script = new Script();
    script.title = params.title;
    script.deltaOps = params.deltaOps;
    script.author = params.author;
    const created = await this.manager.save(script);
    return this.findById(created.id);
  }

  deleteById(id: number) {
    return this.delete(id);
  }

  deleteBulk(ids: number[] | string[]) {
    return this.delete(ids);
  }
}

@EntityRepository(ScriptRevision)
export class ScriptRevisionRepository extends Repository<ScriptRevision> {
  findLatest(scriptId: number) {
    return this.createQueryBuilder('script_revision')
      .where('script_revision.scriptId = :scriptId', {
        scriptId,
      })
      .orderBy('script_revision.created', 'DESC')
      .getOne();
  }

  findOldRevisions(scriptId: number, offset: number) {
    return this.createQueryBuilder('script_revision')
      .where('script_revision.scriptId = :scriptId', {
        scriptId,
      })
      .orderBy('script_revision.created', 'DESC')
      .offset(offset)
      .getMany();
  }

  createRevision(script: Script, created?: Date) {
    return this.createQueryBuilder()
      .insert()
      .into(ScriptRevision)
      .values({
        script: script,
        title: script.title,
        created: created ? created : script.created,
        deltaOps: script.deltaOps,
      })
      .execute();
  }

  updateRevision(targetRevisionId: number, script: Script) {
    return this.createQueryBuilder()
      .update(ScriptRevision)
      .set({
        title: script.title,
        deltaOps: script.deltaOps,
        created: script.updated,
      })
      .where('id = :id', { id: targetRevisionId })
      .execute();
  }

  deleteRevisions(ids: number[]) {
    return this.createQueryBuilder()
      .delete()
      .from(ScriptRevision)
      .where('id IN (:...ids)', { ids })
      .execute();
  }
}
