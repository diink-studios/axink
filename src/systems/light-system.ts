import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight,
  PointLightHelper,
} from 'https://esm.sh/three@0.150.0';
import { Light, Transform, Type } from '../components/generic/components.ts';
import { Entity } from '../index.ts';
import { AbstractSystem } from './abstract-system.ts';

export class LightSystem extends AbstractSystem {
  async start(deltaTime?: number | undefined): Promise<void> {
    this.queryComponents = [
      Type.Transform,
      Type.Light,
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
          const lightComponent = entity.components.get(Type.Light) as Light;
          const { position: { x, y, z } } = entity.components.get(
            Type.Transform,
          ) as Transform;

          if (!lightComponent.instance) {
            switch (lightComponent.light) {
              case 'point':
                lightComponent.instance = new PointLight(
                  0xffffff,
                  1,
                  500,
                );
                break;
              case 'directional':
                lightComponent.instance = new DirectionalLight(0xffffff);
                lightComponent.instance.color.setHSL(0.1, 1, 0.95);
                lightComponent.instance.position.multiplyScalar(30);
                break;
              case 'hemisphere':
                lightComponent.instance = new HemisphereLight(
                  0xffffff,
                  0xffffff,
                  0.6,
                );
                lightComponent.instance.color.setHSL(0.6, 1, 0.6);
                // deno-lint-ignore ban-ts-comment
                // @ts-ignore
                lightComponent.instance.groundColor.setHSL(0.095, 1, 0.75); // GroundColor
                break;
              case 'ambient':
                lightComponent.instance = new AmbientLight(0xffffff);
                break;
              case 'spot':
                lightComponent.instance = new PointLight(0xffffff);
                lightComponent.instance.shadow.mapSize.width = 1024;
                lightComponent.instance.shadow.mapSize.height = 1024;

                // lightComponent.instance.shadow.camera.near = 500;
                // lightComponent.instance.shadow.camera.far = 4000;
                // lightComponent.instance.shadow.camera.fov = 30;
                break;
              default:
                break;
            }
            // deno-lint-ignore ban-ts-comment
            // @ts-ignore
            scene.instance.add(lightComponent.instance);
          }

          if (lightComponent.instance) {
            lightComponent.instance?.position.set(x, y, z);
          }
        },
      );

      // this.query('update').filter((entity) => entity.visible).forEach(
      //   (entity: Entity) => {
      //     const shapeComponent = entity.components.get(Type.Shape) as Shape;
      //     const { position: { x, y, z } } = entity.components.get(
      //       Type.Transform,
      //     ) as Transform;

      //     if (shapeComponent.instance) {
      //       shapeComponent.instance.material.color = shapeComponent.fill;
      //       shapeComponent.instance.position.set(x, y, z);
      //     }
      //   },
      // );
    });
  }
}
