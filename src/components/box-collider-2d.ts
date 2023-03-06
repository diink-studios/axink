import { Vector2 } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { BoxCollider2DDefinition } from './generic/components-definitions.ts';

export class BoxCollider2D extends AbstractComponent {
  public readonly width: number;

  public readonly height: number;

  public readonly offset: Vector2;

  public readonly isStatic: boolean;

  public readonly isTrigger: boolean;

  public readonly pivot: string;

  public readonly fixedRotation: boolean;

  public instance?: any;

  public triggerInfo: any;

  public debug?: any;

  constructor(data?: BoxCollider2DDefinition) {
    super(Type.BoxCollider2D);
    this.width = data == null ? 32 : data.width;
    this.height = data == null ? 32 : data.height;
    this.offset = data && data.offset || new Vector2();
    this.pivot = data == null ? 'BOTTOM_CENTER' : data.pivot;
    this.isStatic = data == null ? false : data.isStatic;
    this.isTrigger = data && data.isTrigger || false;
    this.fixedRotation = data && data.fixedRotation || false;
  }

  onTriggerEnter(value: string): boolean {
    if (this.triggerInfo) {
      if (
        (this.triggerInfo.state === 'enter' &&
          value === this.triggerInfo.other.name) ||
        (this.triggerInfo.state === 'enter' &&
          value === this.triggerInfo.otherTag)
      ) {
        return true;
      }
    }
    return false;
  }

  onTriggerStay(value: string): boolean {
    if (this.triggerInfo) {
      if (
        (this.triggerInfo.state === 'stay' &&
          value === this.triggerInfo.other.name) ||
        (this.triggerInfo.state === 'stay' &&
          value === this.triggerInfo.otherTag)
      ) {
        return true;
      }
    }
    return false;
  }

  onTriggerExit(value: string): boolean {
    if (this.triggerInfo) {
      if (
        (this.triggerInfo.state === 'exit' &&
          value === this.triggerInfo.other.name) ||
        (this.triggerInfo.state === 'exit' &&
          value === this.triggerInfo.otherTag)
      ) {
        return true;
      }
    }
    return false;
  }

  _clone(): BoxCollider2D {
    return new BoxCollider2D({
      width: this.width,
      height: this.height,
      offset: this.offset,
      pivot: this.pivot,
      isStatic: this.isStatic,
      isTrigger: this.isTrigger,
      fixedRotation: this.fixedRotation,
    });
  }
}
