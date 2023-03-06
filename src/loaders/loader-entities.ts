import { Entity } from '../core/entity.ts';

class EntitiesLoader {
  private _entities: Map<string, Entity>;

  constructor() {
    this._entities = new Map();
  }

  addEntities(entities: Map<string, Entity>): void {
    this._entities = entities;
  }

  instantiate(name: string): Entity {
    const entity = this.getEntity(name);
    return entity._clone();
  }

  getEntity(name: string): Entity {
    const entity = this._entities.get(name);

    if (!entity) {
      throw new Error(
        `[EntitiesLoader] entity with name "${name}" doesn't exist`,
      );
    }

    return entity._clone();
  }
}

export const entitiesLoader = new EntitiesLoader();
