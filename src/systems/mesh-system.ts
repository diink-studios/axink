import { Mesh, Transform, Type, } from '../components/generic/components.ts';
import { Entity } from '../mod.ts';
import { resourcesLoader } from '../loaders/loader-resources.ts';
import { AbstractSystem } from './abstract-system.ts';
import { Euler, MathUtils, Mesh as TMesh, PlaneGeometry, MeshBasicMaterial, DoubleSide, ShaderMaterial } from 'https://esm.sh/three@0.150.0';

function getShaderMaterial(shader: string) {
  console.log('Get Shader', shader)
  console.log('Shader', resourcesLoader.resources)
  const shaderLoad = resourcesLoader.resources.shaders.get(shader);
  console.log(shaderLoad)

  return new ShaderMaterial(shaderLoad);
}

function getMeshModel(meshComponent: any) {
  switch (meshComponent.model) {
    // deno-lint-ignore no-case-declarations
    case 'PlaneMesh':
      const geometry = new PlaneGeometry(meshComponent.width, meshComponent.height, 40);
      const material = meshComponent.shader ? getShaderMaterial(meshComponent.shader) : new MeshBasicMaterial({ color: 0x000000, side: DoubleSide });
      return new TMesh(geometry, material);
    // deno-lint-ignore no-case-declarations
    default:
      const modelLoaded = resourcesLoader.resources.models.get(
        meshComponent.model,
      );

      return modelLoaded.scene ? modelLoaded.scene : modelLoaded;
  }
}

export class MeshSystem extends AbstractSystem {
  async start(deltaTime?: number | undefined): Promise<void> {
    this.queryComponents = [
      Type.Mesh,
      Type.Transform,
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
          let meshComponent = entity.components.get(Type.Mesh) as Mesh;
          const { position: { x, y, z }, rotation } = entity.components.get(
            Type.Transform,
          ) as Transform;

          if (!meshComponent.instance) {

            meshComponent.instance = getMeshModel(meshComponent);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // meshComponent = {
            //   ...meshComponent,
            //   ...getMeshModel(meshComponent.model)
            // }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            scene.instance.add(meshComponent.instance);
          }

          if (meshComponent.instance) {
            meshComponent.instance?.position.set(x, y, z);

            meshComponent.instance?.setRotationFromEuler(
              new Euler(
                MathUtils.degToRad(rotation.x),
                rotation.y * Math.PI / 180,
                MathUtils.degToRad(rotation.z),
                'XYZ',
              ),
            );
          }
        },
      );

      this.query('update').filter((entity) => entity.visible).forEach(
        (entity: Entity) => {
          const meshComponent = entity.components.get(
            Type.Mesh,
          ) as Mesh;
          const { position: { x, y, z }, rotation } = entity.components.get(
            Type.Transform,
          ) as Transform;

          if (meshComponent.instance) {
            console.log('POSITION', meshComponent.instance)

            if (meshComponent.instance?.type === 'Mesh') {
              meshComponent.instance?.position.set(x, y, z);
            } else {
              meshComponent.instance?.children[0].position.set(x, y, z);
            }

            meshComponent.instance?.setRotationFromEuler(
              new Euler(
                MathUtils.degToRad(rotation.x),
                rotation.y * Math.PI / 180,
                MathUtils.degToRad(rotation.z),
                'XYZ',
              ),
            );
          }
        },
      );
    });

    // if (
    //   meshComps.length > 0 &&
    //   Object.values(resourcesLoader.resources.models).length > 0
    // ) {
    //   meshComps.forEach((mesh: any) => {
    //     const transform = transComps.find((elem: any) =>
    //       elem.entity === mesh.entity
    //     );

    //     if (mesh.state.file) {
    //       if (!mesh.instance) {
    //         console.log(resourcesLoader.resources.models[mesh.state.file]);
    //         mesh.instance = resourcesLoader.resources.models[mesh.state.file];
    //         currentScene.instance.add(mesh.instance);
    //       }

    //       // INVESTIGATE WHAT TO DO HERE... will be hardcore
    //       let { castShadow, receiveShadow, visible } = mesh.state;
    //       let { position, scale } = transform.state;
    //       const { x, y, z } = position;
    //       const { x: sx, y: sy, z: sz } = scale;

    //       mesh.instance.children[0].position.set(x, y, z);
    //       mesh.instance.children[0].scale.set(sx, sy, sz);

    //       mesh.instance.children[0].castShadow = castShadow;
    //       mesh.instance.children[0].receiveShadow = receiveShadow;
    //       mesh.instance.children[0].visible = visible;
    //     }
    //   });
    // }
  }
}
