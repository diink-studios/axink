import SceneManager from '../../managers/scenes-manager';
import { Entity } from '../entity';
import ScriptInstance from './script-instance';

interface Constructable<ScriptInstance> {
  new (sceneManager: SceneManager, entity: Entity): ScriptInstance;
}

type ScriptConstructable = Constructable<ScriptInstance>;

export default ScriptConstructable;
