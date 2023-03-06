import { Axink } from '../axink.ts';
import { Type } from '../components/generic/components.ts';
import { QueryEvent, queryManager } from '../core/query-manager.ts';
import { Entity } from '../index.ts';

export interface System {
  context: Axink;
  queryComponents: Array<Type>;
  start(): Promise<void>;
  run(): Promise<void>;
  // query(): void;
}

export abstract class AbstractSystem implements System {
  public readonly context: Axink;
  public queryComponents!: Array<Type>;

  constructor(context: Axink) {
    this.context = context;
  }

  async start(deltaTime?: number): Promise<void> {
    // intentionally left blank
  }

  async run(deltaTime?: number): Promise<void> {
    // intentionally left blank
  }

  query(event: QueryEvent): Entity[] {
    if (!this.queryComponents) {
      throw new Error(
        `[AbstractSystem]::No query components defined for ${this}`,
      );
    }

    const validEntities = queryManager.getQuery(
      event,
      this.queryComponents,
    );

    if (validEntities.length > 0) {
      console.log('Query: [', event, ']', validEntities);
    }

    return validEntities;
  }
}
