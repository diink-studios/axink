import {
  OrthographicCamera,
  PerspectiveCamera,
} from 'https://esm.sh/three@0.150.0';
import * as THREE from 'https://esm.sh/three@0.150.0';
import { Camera } from '../components/camera.ts';
import { Mesh, Sprite, Type } from '../components/generic/components.ts';
import { Transform } from '../components/transform.ts';
import { Entity } from '../core/entity.ts';
import Scene from '../core/scene.ts';
import { AbstractSystem } from './abstract-system.ts';
import CameraControls from 'https://esm.sh/camera-controls@2.3.3';

type CameraData = {
  scene: Scene;
  camera: Camera;
  transform: Transform;
};
export class CameraSystem extends AbstractSystem {
  async start(deltaTime?: number | undefined): Promise<void> {
    CameraControls.install({ THREE: THREE });
  }
  async run(): Promise<void> {
    const scenes = this.context.sceneManager.renderScenes;

    if (scenes.length === 0) {
      return;
    }

    const camerasToRender = this.getCameras(scenes);
    const views = this.generateCameraPosition(camerasToRender);

    camerasToRender.forEach(
      ({ camera, transform, scene }: CameraData, index: number) => {
        const { position } = transform;

        if (!camera.instance) {
          camera.instance = this.generateCamera(camera);
          scene.instance.add(camera.instance);
          camera.instance.position.x = position.x; // HAmmer
          camera.instance.position.y = position.y; // HAmmer
          camera.instance.position.z = position.z; // HAmmer

          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          camera.effectComposer = this.context.postprocessing(
            scene.instance,
            camera.instance,
          );
        }

        const left = Math.floor(window.innerWidth * views[index].left);
        const bottom = Math.floor(window.innerHeight * views[index].bottom);
        const width = Math.floor(window.innerWidth * views[index].width);
        const height = Math.floor(window.innerHeight * views[index].height);

        this.context.renderer.setViewport(left, bottom, width, height);
        this.context.renderer.setScissor(left, bottom, width, height);
        this.context.renderer.setScissorTest(true);

        if (camera.background) {
          scene.instance.background = camera.background;
        }

        if (camera.instance instanceof OrthographicCamera) {
          // this.context.renderer
          camera.instance.left = width / -camera.factor;
          camera.instance.right = width / camera.factor;
          camera.instance.top = height / camera.factor;
          camera.instance.bottom = height / -camera.factor;
        }

        if (camera.instance instanceof PerspectiveCamera) {
          camera.instance.aspect = width / height;
        }

        camera.instance.updateProjectionMatrix();

        if (camera.lookAt && !camera.lookAtSet) {
          const lookAtEntity = scene.entitiesManager.getByName(camera.lookAt);
          const lookAtSprite = lookAtEntity?.getComponent(
            Type.Sprite,
          ) as Sprite;
          if (lookAtSprite && lookAtSprite.instance) {
            console.log('ADDING TO PARENT');
            lookAtSprite.instance.add(camera.instance);
            camera.instance.lookAt(lookAtSprite.instance.position);
            camera.instance.position.x = position.x; // HAmmer
            camera.instance.position.y = position.y; // HAmmer
            camera.instance.position.z = position.z; // HAmmer

            camera.lookAtSet = true;
          }
        }

        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        // camera.effectComposer.render();
        this.context.renderer.render(scene.instance, camera.instance);
      },
    );
  }

  getCameras(scenes: Scene[]): CameraData[] {
    let camerasData: CameraData[] = [];

    scenes.forEach((scene) => {
      const validEntities = scene.entitiesManager.getAllWithComponents(
        Type.Camera,
      );

      camerasData = [
        ...camerasData,
        ...validEntities.map((entity: Entity) => ({
          camera: entity.components.get(Type.Camera) as Camera,
          transform: entity.components.get(Type.Transform) as Transform,
          scene,
        })),
      ];
    });

    return camerasData;
  }

  generateCamera({ projection, fov, near, far }: Camera) {
    const { clientWidth, clientHeight } = document.body;

    switch (projection) {
      case 'perspective':
        return new PerspectiveCamera(
          fov,
          clientWidth / clientHeight,
          near,
          far,
        );
      case 'orthographic':
        return new OrthographicCamera(
          clientWidth / -2,
          clientWidth / 2,
          clientHeight / 2,
          clientHeight / -2,
          near,
          far,
        );
    }
  }

  generateCameraPosition(cameras: Array<any>) {
    const size = 2;
    const rows = [];
    for (let i = 0; i < cameras.length; i += size) {
      rows.push([...cameras.slice(i, i + size)]);
    }

    const data = [];
    for (let n = 0; n < rows.length; n++) {
      for (let y = 0; y < rows[n].length; y++) {
        data.push({
          width: 0 + (1 / rows[n].length),
          height: 0 + (1 / rows.length),
          left: y === 0 ? 0 : 0 + (1 / (y + 1)),
          bottom: n === 0 ? 0 : 0 + (1 / (n + 1)),
        });
      }
    }

    return data;
  }
}
