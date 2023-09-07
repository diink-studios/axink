import Scene from '../core/scene.ts';

/**
 * Scene Manager its used to Manage Scenes. DUH!🤪
 * What else it should be?
 *
 * This will store every scene create for the game.
 * And its responsible to CHANGE and RESET a Scene.
 */
export default class SceneManager {
  // private _context: Enjin;

  public readonly scenes: Scene[] = [];

  private _previousScene: Scene | null = null;

  private _currentScene: Scene | null = null;

  public renderScenes: Scene[] = [];

  /** Return the current Scene? */
  get currentScene(): Scene | null {
    return this._currentScene;
  }

  /**
   * Get specific scene by ID
   * @param {string} id - Scene ID
   */
  getScene(id: string): Scene | null {
    return this.scenes.find((scene) => scene.id === id) || null;
  }

  /**
   * Add a new Scene to the Manager
   * @param {object} scene - Scene
   */
  add(scene: Scene): void {
    this.scenes.push(scene);
    this.scenes.sort((one, two) => (one.order > two.order ? 1 : -1));
  }

  getSceneByName(name: string): Scene {
    return this.scenes.find((scene) => scene.name === name) as Scene;
  }

  init() {
    console.log('[Scene Manager]::INITIALIZATION');
    this._currentScene = this.scenes[0];
    this.renderScenes = [
      this._currentScene,
      // ...this.scenes[0].childScenes.map((name) => this.getSceneByName(name)),
    ];
  }

  /**
   * ⚠️ CODE UNDER CONSTRUCTION 🚧
   * @param {object} toScene - Scene a expected to load
   */
  changeScene(toScene: string, props?: any): void {
    this._previousScene = this._currentScene;
    this._previousScene?.unload();
    this._currentScene = this.scenes.find((scene) => scene.name === toScene) ||
      null;
    this.renderScenes = [
      this._currentScene as Scene,
    ];
    this._currentScene?.load(props);
  }

  /**
   * ⚠️ CODE UNDER CONSTRUCTION 🚧
   */
  reset(): void {
    this._currentScene?.reset();
  }
}
