import SceneManager from '../../managers/scenes-manager.ts';
import { Entity } from '../entity.ts';
import ScriptInstance from './script-instance.ts';

interface Constructable<ScriptInstance> {
  new(sceneManager: SceneManager, entity: Entity): ScriptInstance;
}

type ScriptConstructable = Constructable<ScriptInstance>;

export default ScriptConstructable;
