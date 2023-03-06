import { cloneDeep } from '../deps.ts';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { InterfaceDefinition } from './generic/components-definitions.ts';

export class Interface extends AbstractComponent {
  public props: any;

  public template: string;

  public vDom: any;

  public instance?: HTMLElement;

  public loaded: boolean;

  constructor(data: InterfaceDefinition) {
    super(Type.Interface);
    this.props = data?.props || {};
    this.template = data.template;
    this.loaded = false;
  }

  _clone(): Interface {
    return new Interface({
      props: cloneDeep(this.props),
      template: this.template,
    });
  }
}
