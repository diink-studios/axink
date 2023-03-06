import { Color, Mesh as TMesh } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { ShapeDefinition } from './generic/components-definitions.ts';

export class Shape extends AbstractComponent {
  public pivot: string;

  public shape: 'rectangle';

  public fill: Color;

  public instance?: TMesh;

  constructor(data?: ShapeDefinition) {
    super(Type.Shape);
    this.shape = (data && data.shape) || 'rectangle';
    this.fill = (data && data.fill) || new Color(0x000000);
    this.pivot = (data && data.pivot) || 'BOTTOM_CENTER';
  }

  _clone(): Shape {
    return new Shape({
      shape: this.shape,
      pivot: this.pivot,
      fill: this.fill,
    });
  }
}
