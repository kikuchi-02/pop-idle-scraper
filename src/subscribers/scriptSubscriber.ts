import {
  EntityManager,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { Script } from '../entity/Script';
import { ScriptRevisionRepository } from '../repositories/script';
import { DeltaOperation } from '../typing';

@EventSubscriber()
export class ScriptSubscriber implements EntitySubscriberInterface<Script> {
  listenTo() {
    return Script;
  }

  async afterInsert(event: InsertEvent<Script>): Promise<void> {
    const scriptRevisionRepository = event.manager.getCustomRepository(
      ScriptRevisionRepository
    );
    await scriptRevisionRepository.createRevision(event.entity);
  }

  async afterUpdate(event: UpdateEvent<Script>): Promise<void> {
    const script = event.entity;
    const scriptRevisionRepository = event.manager.getCustomRepository(
      ScriptRevisionRepository
    );
    const latestScriptRevision = await scriptRevisionRepository.findLatest(
      script.id
    );

    const latestCreated = latestScriptRevision.created;
    latestCreated.setHours(latestCreated.getHours() + 3);
    const is3HoursOld = latestCreated < script.created;

    if (
      is3HoursOld ||
      this.isVastlyDifferent(script.deltaOps, latestScriptRevision.deltaOps)
    ) {
      // new
      await scriptRevisionRepository.createRevision(
        event.entity,
        event.entity.updated
      );
      await this.sortOutRevisions(event.manager, script.id);
    } else {
      // update
      await scriptRevisionRepository.updateRevision(
        latestScriptRevision.id,
        event.entity
      );
    }
  }

  private isVastlyDifferent(
    deltaOps1: DeltaOperation[],
    deltaOps2: DeltaOperation[]
  ): boolean {
    const isHugeDeltaDiff = Math.abs(deltaOps1.length - deltaOps2.length) > 30;
    if (isHugeDeltaDiff) {
      return true;
    }

    const extractTextLength = (op: DeltaOperation) => {
      if (op.insert) {
        return op.insert.length;
      } else if (op.retain) {
        return op.retain;
      } else {
        return 0;
      }
    };

    const length1 = deltaOps1.reduce(
      (prev, curr) => prev + extractTextLength(curr),
      0
    );
    const length2 = deltaOps2.reduce(
      (prev, curr) => prev + extractTextLength(curr),
      0
    );
    const isHugeTextDiff = Math.abs(length1 - length2) > 100;
    if (isHugeTextDiff) {
      return true;
    }

    return false;
  }

  private async sortOutRevisions(manager: EntityManager, scriptId: number) {
    const scriptRevisionRepository = manager.getCustomRepository(
      ScriptRevisionRepository
    );

    const revisions = await scriptRevisionRepository.findOldRevisions(
      scriptId,
      15
    );
    if (revisions.length > 0) {
      await scriptRevisionRepository.deleteRevisions(
        revisions.map((rev) => rev.id)
      );
    }
  }
}
