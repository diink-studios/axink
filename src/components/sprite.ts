import { Sprite as TSprite } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { SpriteDefinition } from './generic/components-definitions.ts';

export class Sprite extends AbstractComponent {
  public source: string;

  public width: number;

  public height: number;

  public pivot: string;

  public instance?: TSprite;

  public spriteMap?: any;

  public spriteMaterial?: any;

  constructor(data?: SpriteDefinition) {
    super(Type.Sprite);
    this.source = data == null ? 'enjin' : data.source;
    this.width = data == null ? 32 : data.width;
    this.height = data == null ? 32 : data.height;
    this.pivot = data == null ? 'BOTTOM_CENTER' : data.pivot;
  }

  _clone(): Sprite {
    return new Sprite({
      source: this.source,
      width: this.width,
      height: this.height,
      pivot: this.pivot,
    });
  }
}
