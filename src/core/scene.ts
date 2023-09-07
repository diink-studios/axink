import {
  AxesHelper,
  GridHelper,
  Scene as TScene,
  Vector3,
  Color,
} from 'https://esm.sh/three@0.150.0';
import { Camera, Type } from '../components/generic/components.ts';
import { Transform } from '../components/transform.ts';
import { resourcesLoader } from '../loaders/loader-resources.ts';
// import * as Components from '../components/ComponentDefinition';
/** Managers */
import EntitiesManager from '../managers/entities-manager.ts';
/** Utils */
import { generateId } from '../utils/utils.ts';
import { Entity } from './entity.ts';

// import { SceneData } from '../interfaces';
// import { Entity, EntityDefinition, create as createEntity } from './Entity';
// import { entitiesLoader } from '../loaders/EntitiesLoader';

export type SceneData = {
  name: string;
  order: number;
  background?: Color;
  entities: string[];
  scripts: string[];
  childScenes: string[];
};

export default class Scene {
  public readonly id: string;

  public readonly instance: TScene;

  public readonly entitiesManager: EntitiesManager;

  public readonly initialData: SceneData;

  public readonly order: number;

  public readonly name: string;

  public readonly background?: string;
  // public readonly entities: Entity[];

  public readonly scripts: string[];

  private _cameras: Camera[] = [];

  public readonly childScenes: string[] = [];

  public interface!: HTMLDivElement;
  // private debugInstance: any;

  public props: any;

  constructor(sceneData: SceneData) {
    this.id = generateId();

    this.instance = new TScene();

    // var axes = new AxesHelper(50);
    // this.instance.add(axes);

    // this.instance.background = new Color( 0xff000000 );

    this.initialData = sceneData;
    console.log(sceneData);
    this.entitiesManager = new EntitiesManager(sceneData.entities);

    this.order = sceneData.order;
    this.name = sceneData.name;
    // this.background = sceneData.background;

    // this.entities = sceneData.entities;
    this.scripts = sceneData.scripts;

    this.childScenes = sceneData.childScenes;
    // this.init();
  }

  private loadInterface() {
    const interfaceElement = document.querySelector('#interfaces');

    if (!interfaceElement) {
      throw new Error('[SCENE]::Missing interfaces container.');
    }

    interfaceElement.innerHTML = '';
    return interfaceElement as HTMLDivElement;
  }

  init(): void {
    console.log('[SCENE] - INITIALIZATION', this.instance);
  }

  async load(props?: any): Promise<void> {
    console.log('[SCENE] - INITIALIZATION INTERFACE');
    this.props = props;
    this.interface = this.loadInterface();
    await resourcesLoader.load([this]);
    this.clean();
    this.entitiesManager.reset();

    const gridHelper = new GridHelper(100, 10);
    this.instance.add(gridHelper);
  }

  unload(): void {
    this.clean();
    if (this.interface) {
      this.interface.innerHTML = '';
    }
  }

  clean() {
    console.log('RESET', this.instance.children);
    while (this.instance.children[0]) {
      this.instance.remove(this.instance.children[0]);
    }
    this._cameras = [];
  }

  addChild(element: any): void {
    this.instance.add(element);
  }

  // removeChild(element: any): void {
  //   this.instance.removeChild(element);
  // }
  // private addEntity (entityDefinition: EntityDefinition): Entity {
  //   const entity = createEntity(entityDefinition);
  //   this.entitiesManager.add(entity);

  //   entity.componentTypes.forEach((componentType: Components.Type) => {
  //     const initialState
  //       = entityDefinition.components[componentType] as Components.ComponentDefinition;
  //     this._componentsManager.add(componentType, initialState, entity.id);
  //   });
  //   return entity;
  // }

  instantiate(entity: Entity, position?: Vector3): Entity {
    const clone = entity._clone();
    const transform = clone.components.get(Type.Transform) as Transform;
    transform.position = position || transform.position || new Vector3(0, 0, 0);
    this.entitiesManager.add(clone);
    return clone;
  }

  reset(): void {
    console.log('SCENE RESET');
    this.unload();
    this.load();
    this.init();
  }
}
