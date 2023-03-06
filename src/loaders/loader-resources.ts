import { TextureLoader } from 'https://esm.sh/three@0.150.0';
import { Sprite, Type } from '../components/generic/components.ts';
import Scene from '../core/scene.ts';
import { ResourcesDefinition } from './loaders.d.ts';

type Resources = {
  models: Map<string, any>;
  images: Map<string, any>;
  videos: Map<string, any>;
  shaders: Map<string, any>;
  fonts: Array<string>;
};

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

  get state() {
    return this._state;
  }

  get resources(): Resources {
    return this._resources;
  }

  addResources(resources: ResourcesDefinition): void {
    this._resourcesSource = resources;
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
      );

      for (const entity of validEntities) {
        const spriteComponent = entity.components.get(Type.Sprite) as Sprite;

        if (
          spriteComponent && spriteComponent.source &&
          !(spriteComponent.source in this._resources.images)
        ) {
          this._resources.images.set(
            spriteComponent.source,
            await this._textureLoader.load(
              `./resources/images/${
                this._resourcesSource.images.get(spriteComponent.source)
              }`,
            ),
          );
        }
      }
    }
    this._state = 'completed';
  }

  // async addToLoad(resources: Map<string, PIXI.Texture>) {
  //   return new Promise((resolve, reject) => {
  //     resources.forEach((val: PIXI.Texture, key: string) => {
  //       this.loader.add(key, val);
  //     });

  //     this.loader.load();

  //     this.loader.onComplete.add(() => {
  //       return resolve('done');
  //     });
  //   });
  // }
}

export const resourcesLoader = new ResourcesLoader();
