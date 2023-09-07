import { cloneDeep } from '../deps.ts';
import { Vector3 } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { TransformDefinition } from './generic/components-definitions.ts';

export class Transform extends AbstractComponent {
  public position: Vector3;

  public rotation: Vector3;

  public scale: Vector3;

  private initialData: TransformDefinition;

  constructor(transform?: TransformDefinition) {
    super(Type.Transform);

    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    this.initialData = cloneDeep(transform);

    this.position = transform?.position == null
      ? new Vector3()
      : transform.position;
    this.rotation = transform?.rotation == null
      ? new Vector3()
      : transform.rotation;
    this.scale = transform?.scale == null
      ? new Vector3(1, 1, 1)
      : transform.scale;
    // this.displacement = transform?.displacement == null ? new Vector3() : transform.displacement;
  }

  _clone(): Transform {
    // const { position, rotation, scale } = this.initialData;
    return new Transform({
      position: this.position,
      rotation: this.rotation,
      scale: this.scale,
    });
  }
}
