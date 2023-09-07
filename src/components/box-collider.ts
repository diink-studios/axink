import { Vector2 } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { BoxColliderDefinition } from './generic/components-definitions.ts';

export class BoxCollider extends AbstractComponent {
  public readonly width: number;

  public readonly height: number;

  public readonly mass: number;

  public readonly mesh: boolean;

  public readonly offset: Vector2;

  public readonly isStatic: boolean;

  public readonly isTrigger: boolean;

  public readonly pivot: string;

  public readonly fixedRotation: boolean;

  public instance?: any;

  public triggerInfo: any;

  public debug?: any;

  constructor(data?: BoxColliderDefinition) {
    super(Type.BoxCollider);
    this.width = data?.width || 32;
    this.height = data?.height || 32;
    this.mass = data?.mass || 5;
    this.offset = data && data.offset || new Vector2();
    this.pivot = data == null ? 'BOTTOM_CENTER' : data.pivot;
    this.isStatic = data == null ? false : data.isStatic;
    this.isTrigger = data && data.isTrigger || false;
    this.fixedRotation = data && data.fixedRotation || false;
    this.mesh = data && data.mesh || true;
  }

  _clone(): BoxCollider {
    return new BoxCollider({
      width: this.width,
      height: this.height,
      mass: this.mass,
      mesh: this.mesh,
      offset: this.offset,
      pivot: this.pivot,
      isStatic: this.isStatic,
      isTrigger: this.isTrigger,
      fixedRotation: this.fixedRotation,
    });
  }
}
