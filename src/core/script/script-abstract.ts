import { Component } from '../../components/generic/abstract-component.ts';
import SceneManager from '../../managers/scenes-manager.ts';
// import { InputSystem } from '../systems/InputSystem';
import { Entity } from '../entity.ts';
import { Input, input } from '../input.ts';
import Scene from '../scene';
import ScriptInstance from './script-instance';
export class AbstractScript implements ScriptInstance {
  private _name?: string;

  private _sceneManager: SceneManager;

  // private _scene: Scene;

  private _entity: Entity;

  private _input: Input;

  private _components: { [key: string]: any };

  constructor(
    sceneManager: SceneManager,
    entity: Entity,
    components: {
      [key: string]: Component;
    },
  ) {
    this._sceneManager = sceneManager;
    this._entity = entity;
    this._components = components;
    this._input = input;
  }

  get name(): string {
    return this._name || 'Unnamed Script';
  }

  get scene(): Scene {
    for (const scene of this._sceneManager.renderScenes) {
      if (scene.entitiesManager.getById(this._entity.id)) {
        return scene as Scene;
      }
    }

    return this._sceneManager.currentScene as Scene;
  }

  get entity(): Entity {
    return this._entity;
  }

  get sceneManager(): SceneManager {
    return this._sceneManager;
  }

  get components(): { [key: string]: Component } {
    return this._components;
  }

  get input(): Input {
    return this._input;
  }

  changeScene(name: string, props?: any): void {
    this._sceneManager.changeScene(name, props);
  }

  resetScene(): void {
    this._sceneManager.reset();
  }

  find(name: string): Entity {
    const entity = this._sceneManager.currentScene?.entitiesManager.getByName(
      name,
    );

    if (!entity) throw new Error(`[SCRIPT] - Entity ${name} doesn't exist.`);

    return entity;
  }

  start(): void {
    // DEFAULT
  }

  update(): void {
    // DEFAULT
  }
}
