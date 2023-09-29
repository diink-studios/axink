import {
  LinearFilter,
  NearestFilter,
  RepeatWrapping,
  Sprite as TSprite,
  SpriteMaterial,
  Vector2,
  DoubleSide,
  Mesh,
  Color,
  BoxGeometry,
  MeshBasicMaterial,
  PlaneGeometry
} from 'https://esm.sh/three@0.150.0';
import { keyBy } from 'https://esm.sh/v107/@types/lodash@4.14.191/index';
import { Sprite, Transform, Type } from '../components/generic/components.ts';
// import { resourcesLoader } from '../loaders/ResourcesLoader';
import { Entity } from '../core/entity.ts';
import { resourcesLoader } from '../loaders/loader-resources.ts';
import { AbstractSystem } from './abstract-system.ts';

export class SpriteSystem extends AbstractSystem {
  async start(deltaTime?: number | undefined): Promise<void> {
    this.queryComponents = [
      Type.Sprite,
      Type.Transform,
    ];

    const scenes = this.context.sceneManager.renderScenes;

    const demo = new MeshBasicMaterial();
    demo.color = new Color(0x000000);
    const geometry = new BoxGeometry(1, 1, 1);
    const mesh = new Mesh(geometry, demo);
    mesh.position.set(0, 0.5, -3)
    scenes.forEach((scene) => {
      scene.instance.add(mesh);
    });
  }

  async run(): Promise<void> {
    const scenes = this.context.sceneManager.renderScenes;
    if (scenes.length === 0) {
      return;
    }

    scenes.forEach((scene) => {
      this.query('add').filter((entity) => entity.visible).forEach(
        (entity: Entity) => {
          const spriteComponent = entity.components.get(Type.Sprite) as Sprite;
          const transformComponent = entity.components.get(
            Type.Transform,
          ) as Transform;
          const { position: { x, y, z } } = transformComponent;

          if (spriteComponent.instance == null) {
            console.log('Creating Sprite', entity, transformComponent);
            spriteComponent.spriteMap = resourcesLoader.resources.images.get(
              spriteComponent.source,
            );

            const { width, height } = spriteComponent;

            const columns = spriteComponent.spriteMap.source.data.width / width;
            const rows = spriteComponent.spriteMap.source.data.height / height;

            spriteComponent.spriteMap.repeat.set(1 / columns, 1 / rows);
            // Default Pivot Top / Left
            spriteComponent.spriteMap.center = new Vector2(0, 1);

            spriteComponent.spriteMap.offset.x = 0 / columns;
            spriteComponent.spriteMap.offset.y = 0 / rows;
            // spriteComponent.spriteMap.repeat.set(1 / (512 / 24), 1 / 2);
            spriteComponent.spriteMap.minFilter = LinearFilter;
            spriteComponent.spriteMap.magFilter = NearestFilter;
            spriteComponent.spriteMap.wrapS = RepeatWrapping;
            spriteComponent.spriteMap.wrapT = RepeatWrapping;

            spriteComponent.spriteMaterial = new MeshBasicMaterial({
              // map: spriteComponent.spriteMap,
              // side: DoubleSide
            });
            // spriteComponent.spriteMaterial.depthTest = false;
            // spriteComponent.spriteMaterial.transparent = true;
            // spriteComponent.spriteMaterial.depthWrite = false;

            const geometry = new BoxGeometry(this.getScaled(width), this.getScaled(height), .1);
            // @ts-ignore
            spriteComponent.instance = new Mesh(geometry, spriteComponent.spriteMaterial);

            // // @ts-ignore
            // spriteComponent.instance.renderOrder = 1;
            // spriteComponent.instance.position.set(0, 0, 1);
            // spriteComponent.instance.scale.set(
            //   this.getScaled(width),
            //   this.getScaled(height),
            //   1,
            // );
            // @ts-ignore
            scene.instance.add(spriteComponent.instance);
          }

          spriteComponent.instance?.position.set(x, y, z);
        },
      );

      // this.query('update').filter((entity) => entity.visible).forEach(
      //   (entity: Entity) => {
      //     console.log('Update Entity');
      //     const spriteComponent = entity.components.get(Type.Sprite) as Sprite;
      //     const { position: { x, y, z } } = entity.components.get(
      //       Type.Transform,
      //     ) as Transform;

      //     spriteComponent.instance?.position.set(x, y, z);
      //   },
      // );

      const validEntities = scene.entitiesManager
        .getAllWithComponents(...this.queryComponents);

      // Always run
      validEntities.forEach((entity: Entity) => {
        const spriteComponent = entity.components.get(Type.Sprite) as Sprite;
        const { position: { x, y, z } } = entity.components.get(
          Type.Transform,
        ) as Transform;

        if (spriteComponent.instance && spriteComponent.animation.active) {
          spriteComponent.instance?.position.set(x, y, z);

          const { active, sequences, sequence, ticksPerFrame } = spriteComponent.animation;
          if (active) {
            (spriteComponent.animation.tickCount as number) += 1;

            if (
              (spriteComponent.animation.tickCount as number) >
              (ticksPerFrame as number)
            ) {
              spriteComponent.animation.tickCount = 0;
              if (
                (sequences[sequence.name].length -
                  1) <=
                sequence.currentFrame
              ) {
                spriteComponent.animation.sequence.currentFrame = 0;
              } else {
                spriteComponent.animation.sequence.currentFrame += 1;
              }
            }
            const { width, height } = spriteComponent;

            const columns = spriteComponent.spriteMap.source.data.width / width;
            const rows = spriteComponent.spriteMap.source.data.height / height;
            sequences;
            const idx = Object.entries(sequences).findIndex(([key, value]) =>
              key === sequence.name
            );

            spriteComponent.spriteMap.offset.x = sequence.currentFrame /
              columns;
            spriteComponent.spriteMap.offset.y = idx /
              rows;
          }
        }
      });
    });
  }

  getScaled(value: number) {
    return (value * 1) / this.context.scaleFactor;
  }
}
