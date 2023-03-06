import { cloneDeep } from '../deps.ts';
import { AbstractComponent } from './generic/abstract-component.ts';
import { Type } from './generic/components.ts';
import {
  Layer,
  TileDefinition,
  TilemapDefinition,
} from './generic/components-definitions.ts';

export class Tileset extends AbstractComponent {
  public name: string;
  public infinite: boolean;
  public rows: number | null;
  public columns: number | null;
  public layers: Array<Layer>;
  public instance?: HTMLElement;

  constructor(data: TilemapDefinition) {
    super(Type.TileMap);
    this.name = data && data.name;
    this.infinite = data && data.infinite || true;
    this.rows = data && data.rows || null;
    this.columns = data && data.columns || null;
    this.layers = data && data.layers;
  }

  _clone(): Tileset {
    return new Tileset({
      name: this.name,
      infinite: this.infinite,
      rows: this.rows,
      columns: this.columns,
      layers: cloneDeep(this.layers),
    });
  }
}
