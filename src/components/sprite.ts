import { Sprite as TSprite } from 'https://esm.sh/three@0.150.0';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import { SpriteDefinition } from './generic/components-definitions.ts';

type Animation = {
  active: boolean;
  tickCount: number;
  ticksPerFrame?: number;
  sequence: {
    name: string;
    currentFrame: number;
  };
  sequences: Record<string, Array<number>>;
};

export class Sprite extends AbstractComponent {
  public source: string;

  public width: number;

  public height: number;

  public pivot: string;

  public row: number;

  public column: number;

  public animation: Animation;

  // INTERNAL DATA
  public instance?: TSprite;

  public spriteMap?: any;

  public spriteMaterial?: any;

  constructor(data: SpriteDefinition) {
    super(Type.Sprite);
    this.source = data == null ? 'enjin' : data.source;
    this.width = data.width || 32;
    this.height = data.height || 32;
    this.pivot = data.pivot || 'BOTTOM_CENTER';

    this.row = data.row || 1;
    this.column = data.column || 1;

    this.animation = {
      active: true,
      sequence: {
        name: 'idle',
        currentFrame: 0,
      },
      sequences: {
        idle: [0],
        moveUp: [0, 1, 2, 4, 5],
        moveDown: [0, 1, 2, 4, 5],
      },
      tickCount: 0,
      ticksPerFrame: 7,
    };
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
