import { RectangleShapeDefinition } from '../generic/components-definitions.ts';
import { Shape } from '../shape.ts';

export class Rectangle extends Shape {
  public width: number;

  public height: number;

  public radius: number | number[];

  constructor(data: RectangleShapeDefinition) {
    super({
      ...data,
      shape: 'rectangle',
    });
    this.width = data.width || 32;
    this.height = data.height || 32;
    this.radius = data.radius || 2;
  }

  _clone(): Rectangle {
    return new Rectangle({
      width: this.width,
      height: this.height,
      radius: this.radius,
      pivot: this.pivot,
      shape: this.shape,
    });
  }
}
