import {
  Color,
  Mesh,
  MeshBasicMaterial,
  Shape as TShape,
  ShapeGeometry,
} from 'https://esm.sh/three@0.150.0';
import { Shape, Transform, Type } from '../components/generic/components.ts';
import { Rectangle } from '../components/shapes/rectangle-shape.ts';
// import { resourcesLoader } from '../loaders/ResourcesLoader';
import { Entity } from '../core/entity.ts';
import { queryManager } from '../core/query-manager.ts';
import { AbstractSystem } from './abstract-system.ts';

export class ShapeSystem extends AbstractSystem {
  async start(deltaTime?: number | undefined): Promise<void> {
    console.log('Shape System Starting!');
    this.queryComponents = [
      Type.Shape,
      Type.Transform,
    ];
  }

  async run(): Promise<void> {
    const scenes = this.context.sceneManager.renderScenes;
    if (scenes.length === 0) {
      return;
    }

    scenes.forEach((scene) => {
      this.query('add').filter((entity) => entity.visible).forEach(
        (entity: Entity) => {
          const shapeComponent = entity.components.get(Type.Shape) as Shape;
          const { position: { x, y, z } } = entity.components.get(
            Type.Transform,
          ) as Transform;

          if (!shapeComponent.instance) {
            if (shapeComponent.shape === 'rectangle') {
              const { width, height, radius, pivot } =
                shapeComponent as Rectangle;
              shapeComponent.instance = this.generateRectangle({
                width,
                height,
                radius,
              });
              // shapeComponent.instance.scale.set(.01, .01, .01);
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            scene.instance.add(shapeComponent.instance);
          }

          if (shapeComponent.instance) {
            // shapeComponent.instance.material.color = shapeComponent.fill;
            shapeComponent.instance?.position.set(x, y, z);
          }
        },
      );

      this.query('update').filter((entity) => entity.visible).forEach(
        (entity: Entity) => {
          const shapeComponent = entity.components.get(Type.Shape) as Shape;
          const { position: { x, y, z } } = entity.components.get(
            Type.Transform,
          ) as Transform;

          if (shapeComponent.instance) {
            // shapeComponent.instance.material.color = shapeComponent.fill;
            shapeComponent.instance.position.set(x, y, z);
          }
        },
      );
    });
  }

  generateRectangle({
    x = 0,
    y = 0,
    radius,
    width,
    height,
  }: {
    x?: number;
    y?: number;
    radius: number | number[];
    width: number;
    height: number;
  }): Mesh {
    const radiusp = radius as number;
    const shape = new TShape()
      .moveTo(x, y + radiusp)
      .lineTo(x, y + height - radiusp)
      .quadraticCurveTo(x, y + height, x + radiusp, y + height)
      .lineTo(x + width - radiusp, y + height)
      .quadraticCurveTo(x + width, y + height, x + width, y + height - radiusp)
      .lineTo(x + width, y + radiusp)
      .quadraticCurveTo(x + width, y, x + width - radiusp, y)
      .lineTo(x + radiusp, y)
      .quadraticCurveTo(x, y, x, y + radiusp);

    const geometry = new ShapeGeometry(shape);

    return new Mesh(geometry, new MeshBasicMaterial({ color: 0x000000 }));
  }
}
