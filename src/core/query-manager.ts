import { Type } from '../components/generic/components.ts';
import { Axink } from '../index.ts';
import { Entity } from './entity.ts';

export type QueryEvent = 'add' | 'update' | 'remove';

class QueryManager {
  public context!: Axink;

  public readonly events: Record<QueryEvent, Array<string>> = {
    add: [],
    update: [],
    remove: [],
  };

  add(eventType: QueryEvent, entityID: string) {
    this.events[eventType].push(entityID);
  }

  getQuery(event: QueryEvent, components: Array<Type>) {
    if (!this.context.sceneManager.currentScene) {
      console.log(this.context.sceneManager);
      throw new Error('[Query Manager]::No scene scene instantiated.');
    }

    const entities = this.context.sceneManager.currentScene?.entitiesManager
      .getAllWithComponents(...components);

    // console.log('GetQuery:', entities);
    return entities?.filter((entity) => this.events[event].includes(entity.id));
  }

  reset() {
    this.events.add = [];
    this.events.update = [];
    this.events.remove = [];
  }
}

export const queryManager = new QueryManager();
