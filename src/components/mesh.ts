import { AnimationMixer, Object3D } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import {
  MeshDefinition,
  SpriteDefinition,
} from './generic/components-definitions.ts';

export class Mesh extends AbstractComponent {
  public model: string;

  public castShadow?: boolean;

  public receiveShadow?: boolean;

  public visible?: boolean;

  public animation: boolean;

  public material?: any;

  public fileType?: string;

  public shader?: string;

  public instance?: Object3D;

  public mixer?: AnimationMixer;

  constructor(data: MeshDefinition) {
    super(Type.Mesh);
    this.model = data.model;
    this.castShadow = data.castShadow || false;
    this.receiveShadow = data.receiveShadow || false;
    this.visible = data.visible || true;
    this.material = data.material || false;
    this.fileType = data.fileType || 'gltf';
    this.animation = data.animation || false;
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
      animation: this.animation,
    });
  }
}
