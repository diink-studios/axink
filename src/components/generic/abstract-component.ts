import { Components, Type } from './components.ts';
import { ComponentsDefinitions } from './components-definitions.ts';

export interface Component {
  type: Type;
  _clone(): Components;
}

export abstract class AbstractComponent implements Component {
  public type: Type;

  constructor(type: Type) {
    this.type = type;
  }

  abstract _clone(): Components;
}
