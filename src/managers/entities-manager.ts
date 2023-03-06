import { cloneDeep } from '../deps.ts';
import { Type } from '../components/generic/components.ts';
import { Entity } from '../core/entity.ts';
import { queryManager } from '../core/query-manager.ts';
// import { query } from '../core/query';
import { entitiesLoader } from '../loaders/loader-entities.ts';
/**
 * Entities Manager
 * Description: TODO
 */
export default class EntitiesManager {
  private _entitiesNames: string[];
  private _entities: Map<string, Entity> = new Map();

  constructor(entitiesNames: string[]) {
    this._entitiesNames = entitiesNames;
    entitiesNames.forEach((name: string) => {
      this.add(entitiesLoader.getEntity(name));
    });
  }

  getAll(): Entity[] {
    return Array.from(this._entities.values());
  }

  getAllWithComponents(...componentTypes: Type[]): Entity[] {
    const entities = [];
    for (const [, entity] of this._entities) {
      const hasAllTypes = componentTypes.every((type) =>
        entity.components.has(type)
      );
      if (hasAllTypes) {
        entities.push(entity);
      }
    }
    return entities;
  }

  getAllWithOneOfComponents(...componentTypes: Type[]): Entity[] {
    const entities = [];
    for (const [, entity] of this._entities) {
      const hasAllTypes = componentTypes.find((type) =>
        entity.components.has(type)
      );
      if (hasAllTypes) {
        entities.push(entity);
      }
    }
    return entities;
  }

  getByName(name: string): Entity | undefined {
    for (const [, entity] of this._entities) {
      if (entity.name === name && entity.visible) {
        return entity;
      }
    }
  }

  getByTag(name: string): Entity[] {
    const entities = [];
    for (const [, entity] of this._entities) {
      if (entity.name === name) {
        entities.push(entity);
      }
    }
    return entities;
  }

  getById(entityId: string): Entity | undefined {
    return this._entities.get(entityId);
  }

  getAllWithID(entitiesIDs: Array<string>): Array<Entity> | undefined {
    const entities = [];
    for (const [, entity] of this._entities) {
      if (entitiesIDs.includes(entity.id)) {
        entities.push(entity);
      }
    }

    return entities;
  }

  add(entity: Entity): void {
    this._entities.set(entity.id, cloneDeep(entity));
    console.log(`HALLO ${entity.id}`, entity);
    queryManager.add('add', entity.id);
    // query.push(entity, 'add');
  }

  remove(entityID: string): void {
    this._entities.delete(entityID);
    queryManager.add('remove', entityID);
  }

  reset(): void {
    queryManager.reset();
    this._entities = new Map();
    this._entitiesNames.forEach((name: string) => {
      const entity = entitiesLoader.getEntity(name);
      this._entities.set(entity.id, cloneDeep(entity));
      queryManager.add('add', entity.id);
    });
  }
}
