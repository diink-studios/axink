import ScriptInstance from '../core/script/script-instance.ts';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { LightDefinition } from './generic/components-definitions.ts';
import { Color, Light as TLight } from 'https://esm.sh/three@0.150.0';

export class Light extends AbstractComponent {
  public light: 'directional' | 'ambient' | 'hemisphere' | 'point' | 'spot';

  public color: Color;

  public intensity: number;

  public instance?: TLight;

  constructor(data: LightDefinition) {
    super(Type.Light);
    this.light = data.light;
    this.color = data.color || new Color(0xffffff);
    this.intensity = data.intensity || 1;
  }

  _clone(): Light {
    return new Light({
      light: this.light,
      color: this.color,
      intensity: this.intensity,
    });
  }
}
