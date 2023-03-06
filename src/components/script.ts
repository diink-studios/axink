import ScriptInstance from '../core/script/script-instance.ts';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { ScriptDefinition } from './generic/components-definitions.ts';

export class Script extends AbstractComponent {
  public name: string;
  public instance?: ScriptInstance;

  constructor(data: ScriptDefinition) {
    super(Type.Script);
    this.name = data.name;
  }

  _clone(): Script {
    return new Script({
      name: this.name,
    });
  }
}
