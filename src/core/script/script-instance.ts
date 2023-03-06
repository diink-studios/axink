// import { InputSystem } from '../systems/InputSystem';
import { Entity } from '../entity.ts';
import { Input } from '../input.ts';
import Scene from '../scene.ts';

interface ScriptInstance {
  name: string;
  scene: Scene;
  entity: Entity;
  components: { [key: string]: any };
  input: Input;

  start(): void;
  update(): void;
  // [key: string]: () => void;
}

export default ScriptInstance;
