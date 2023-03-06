import {
  Color,
  OrthographicCamera,
  PerspectiveCamera,
} from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { CameraDefinition } from './generic/components-definitions.ts';

export class Camera extends AbstractComponent {
  public instance?: PerspectiveCamera | OrthographicCamera;

  public active: boolean;

  public projection: 'perspective' | 'orthographic';

  public fov: number;

  public near: number;

  public far: number;

  public background?: Color;

  public context: '3d' | '2d';

  constructor(data?: CameraDefinition) {
    super(Type.Camera);
    this.context = data?.context || '3d';
    this.active = data?.active || true;
    this.projection = data?.projection || 'perspective';
    this.fov = data?.fov || 45;
    this.near = data?.near || 1;
    this.far = data?.far || 1000;
    this.background = data?.background || new Color(0xffffff);
  }

  _clone(): Camera {
    return new Camera({
      active: this.active,
      projection: this.projection,
      fov: this.fov,
      near: this.near,
      far: this.far,
      background: this.background,
    });
  }
}
