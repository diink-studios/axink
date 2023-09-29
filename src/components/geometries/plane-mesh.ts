import { Mesh as TMesh, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from '../generic/abstract-component.ts';
import { Type, } from '../generic/components.ts';
import { Mesh } from '../mesh.ts';

import {
  PlaneMeshDefinition,
} from '../generic/components-definitions.ts';

export class PlaneMesh extends Mesh {
  private width: number;
  private height: number;
  private color?: number;

  constructor(data: PlaneMeshDefinition) {
    super({
      ...data,
      model: 'PlaneMesh',
    });

    this.width = data && data.width || 10;
    this.height = data && data.height || 10;
  }

  _clone(): PlaneMesh {
    return new PlaneMesh({
      width: this.width,
      height: this.height,
      castShadow: this.castShadow,
      receiveShadow: this.receiveShadow,
      visible: this.visible,
      material: this.material,
      fileType: this.fileType,
      shader: this.shader,
    });
  }
}
