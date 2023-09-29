import { AnimationMixer, Object3D } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from '../generic/abstract-component.ts';
import { Type, } from '../generic/components.ts';
import { Mesh } from '../mesh.ts';

import {
  BoxMeshDefinition,
} from '../generic/components-definitions.ts';

export class BoxMesh extends Mesh {
  constructor(data: BoxMeshDefinition) {
    super({
      ...data,
      model: 'BoxMesh'
    });
  }

  _clone(): Mesh {
    return new Mesh({
      model: this.model,
      castShadow: this.castShadow,
      receiveShadow: this.receiveShadow,
      visible: this.visible,
      material: this.material,
      fileType: this.fileType,
      shader: this.shader,
    });
  }
}
