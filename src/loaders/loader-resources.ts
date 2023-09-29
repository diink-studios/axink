import { TextureLoader } from 'https://esm.sh/three@0.150.0';
import { OBJLoader } from 'https://esm.sh/three@0.150.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://esm.sh/three@0.150.0/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'https://esm.sh/three@0.150.0/examples/jsm/loaders/GLTFLoader.js';

import { FBXLoader } from 'https://esm.sh/three@0.150.0/examples/jsm/loaders/FBXLoader.js';

import { Mesh, Sprite, Type } from '../components/generic/components.ts';
import Scene from '../core/scene.ts';
import { ResourcesDefinition } from './loaders.d.ts';

type Resources = {
  models: Map<string, any>;
  images: Map<string, any>;
  videos: Map<string, any>;
  shaders: Map<string, any>;
  fonts: Array<string>;
};

const INTERNAL_MODELS = ['PlaneMesh', 'BoxMesh'];

class ResourcesLoader {
  private _state = 'completed';

  private _resourcesSource: ResourcesDefinition = {
    models: new Map(),
    images: new Map(),
    videos: new Map(),
    shaders: new Map(),
    fonts: [],
  };

  private _resources: Resources = {
    models: new Map(),
    images: new Map(),
    videos: new Map(),
    shaders: new Map(),
    fonts: [],
  };

  private _textureLoader = new TextureLoader();
  private _objLoader = new OBJLoader();
  private _mtlLoader = new MTLLoader();
  private _fbxLoader = new FBXLoader();
  private _gltfLoader = new GLTFLoader();

  get state() {
    return this._state;
  }

  get resources(): Resources {
    return this._resources;
  }

  addResources(resources: ResourcesDefinition): void {
    console.log('[Resources Loader]', resources);
    this._resourcesSource = resources;
    console.log('[Resources Loaded]', resources);
  }

  // getResource(name: string) {
  //   if (name in this.loader.resources) {
  //     return this.loader.resources[name].texture;
  //   } else {
  //     // @ts-ignore
  //     this.loader.add(name, this._textures.get(name));
  //     this.loader.load(() => {
  //       return this.loader.resources[name].texture;
  //     });
  //   }
  // }

  async getImage(name: string) {
    return await this._textureLoader.loadAsync(
      `./resources/images/${this._resourcesSource.images.get(name)
      }`,
    );
  }

  // addFonts() {
  //   this._resourcesSource.fonts.forEach((source: string) => {
  //     const link = document.createElement('link');
  //     link.href = source;
  //     link.rel = 'stylesheet';

  //     document.head.appendChild(link);
  //   });
  // }

  async load(scenes: Scene[]) {
    this._state = 'loading';

    for (const scene of scenes) {
      const validEntities = scene.entitiesManager.getAllWithOneOfComponents(
        Type.Sprite,
        Type.Mesh,
      );

      for (const entity of validEntities) {
        const spriteComponent = entity.components.get(Type.Sprite) as Sprite;
        const meshComponent = entity.components.get(Type.Mesh) as Mesh;

        if (
          spriteComponent && spriteComponent.source &&
          !(spriteComponent.source in this._resources.images)
        ) {
          this._resources.images.set(
            spriteComponent.source,
            await this._textureLoader.loadAsync(
              `./resources/images/${this._resourcesSource.images.get(spriteComponent.source)
              }`,
            ),
          );
        }


        if (
          meshComponent && meshComponent.model &&
          !(meshComponent.model in this._resources.models)
        ) {

          console.log('HMM', INTERNAL_MODELS)
          if (!INTERNAL_MODELS.includes(meshComponent.model)) {
            console.log('Will try load:', meshComponent.model);
            switch (meshComponent.fileType) {
              case 'obj':
                await this.loadObj(meshComponent);
                break;
              case 'fbx':
                await this.loadFbx(meshComponent);
                break;
              case 'gltf':
              case 'glb':
                await this.loadGlb(meshComponent);
                break;
            }
          }

        }

        if (meshComponent && meshComponent.shader) {
          this._resources.shaders.set(
            meshComponent.shader,
            this._resourcesSource.shaders.get(meshComponent.shader),
          );
        }
      }
    }
    this._state = 'completed';
  }

  loadResourceModels(key: any, value: any) {
    return new Promise((resolve, reject) => {
    });
  }

  async loadObj(mesh: Mesh) {
    const mtlMateial = await this._mtlLoader.loadAsync(
      `./resources/models/${this._resourcesSource.models.get(mesh.model)}.mtl`,
    );

    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    this._objLoader.setMaterials(mtlMateial);

    this._resources.models.set(
      mesh.model,
      await this._objLoader.loadAsync(
        `./resources/models/${this._resourcesSource.models.get(mesh.model)
        }.obj`,
      ),
    );
  }

  async loadFbx(mesh: Mesh) {
    const object = await this._fbxLoader.loadAsync(
      `./resources/models/${this._resourcesSource.models.get(mesh.model)}.fbx`,
    );
    object.scale.multiplyScalar(0.05);

    this._resources.models.set(
      mesh.model,
      object,
    );
  }

  async loadGlb(mesh: Mesh) {
    console.log(mesh.model);
    console.log(this._resourcesSource.models)
    const object = await this._gltfLoader.loadAsync(
      `./resources/models/${this._resourcesSource.models.get(mesh.model)}.${mesh.fileType}`,
    );
    // object.scale.multiplyScalar(0.05);

    this._resources.models.set(
      mesh.model,
      object,
    );
  }
}

export const resourcesLoader = new ResourcesLoader();
