import { Mesh, Transform, Type } from '../components/generic/components.ts';
import { Entity } from '../index.ts';
import { resourcesLoader } from '../loaders/loader-resources.ts';
import { AbstractSystem } from './abstract-system.ts';
import { AnimationMixer, Clock } from 'https://esm.sh/three@0.150.0';

export class FbxAnimationSystem extends AbstractSystem {
  private clock = new Clock();
  async start(deltaTime?: number | undefined): Promise<void> {
    this.queryComponents = [
      Type.Mesh,
    ];
  }
  async run() {
    const scenes = this.context.sceneManager.renderScenes;

    if (scenes.length === 0) {
      return;
    }

    scenes.forEach((scene) => {
      this.query('add').filter((entity) => entity.visible).forEach(
        (entity: Entity) => {
          const meshComponent = entity.components.get(Type.Mesh) as Mesh;

          console.log('FBX.ANIMAITON', meshComponent);
          if (
            !meshComponent.mixer &&
            meshComponent.instance &&
            meshComponent.animation
          ) {
            meshComponent.mixer = new AnimationMixer(meshComponent.instance);

            console.log('FBX.ANIMAITON', meshComponent.mixer);
            // @ts-ignore
            const action = meshComponent.mixer.clipAction(
              meshComponent.instance.animations[4],
            );
            action.play();
          }
        },
      );

      scene.entitiesManager.getAllWithComponents(Type.Mesh).filter((entity) =>
        entity.visible
      ).forEach(
        (entity: Entity) => {
          const meshComponent = entity.components.get(Type.Mesh) as Mesh;
          if (meshComponent.mixer) {
            meshComponent.mixer.update(this.clock.getDelta());
          }
        },
      );
      // this.query('update').filter((entity) => entity.visible).forEach(
      //   (entity: Entity) => {
      //     const meshComponent = entity.components.get(
      //       Type.Mesh,
      //     ) as Mesh;
      //     const { position: { x, y, z }, rotation } = entity.components.get(
      //       Type.Transform,
      //     ) as Transform;

      //     if (meshComponent.instance) {
      //       console.log('MESH', meshComponent.instance);
      //       meshComponent.instance?.children[0].rotation.set(
      //         rotation.x,
      //         rotation.y,
      //         rotation.z,
      //       );
      //       meshComponent.instance?.children[0].position.set(x, y, z);
      //     }
      //   },
      // );
    });
  }
}
