import { Axink } from '../mod.ts';
import { AbstractSystem, System } from './abstract-system.ts';
import { ScriptSystem } from './script-system.ts';
import { CameraSystem } from './camera-system.ts';
// import { Collision2DSystem } from './collision2d-system.ts';
// import { InterfaceSystem } from './inteface-system.ts';
// import { SceneSystem } from './scene-system.ts';
// import { ScriptSystem } from './script-system.ts';
import { ShapeSystem } from './shape-system.ts';
import { SpriteSystem } from './sprite-system.ts';
import { MeshSystem } from './mesh-system.ts';
import { LightSystem } from './light-system.ts';
import { FbxAnimationSystem } from './fbx-animation-system.ts';
import { PhysicsSystem } from './physics-system.ts';
interface Constructable<T> {
  new(context: Axink): T;
}

const SYSTEMS: Record<string, Constructable<System>> = {
  ShapeSystem: ShapeSystem,
  SpriteSystem: SpriteSystem,
  MeshSystem: MeshSystem,
  PhysicsSystem: PhysicsSystem,
  FbxAnimationSystem: FbxAnimationSystem,
  CameraSystem: CameraSystem,
  LightSystem: LightSystem,
  ScriptSystem: ScriptSystem,
};

export type SystemsConfig = {
  include?: Array<string>;
  exclude?: Array<string>;
};

export const loadSystem = (
  engine: Axink,
  config: SystemsConfig = {},
): Map<string, System> => {
  let tempSystems = { ...SYSTEMS };

  if ('include' in config) {
    tempSystems = {};
    config.include?.forEach((item) => {
      tempSystems[item] = SYSTEMS[item];
    });
  } else if ('exclude' in config) {
    config.exclude?.forEach((item) => {
      delete tempSystems[item];
    });
  }

  return new Map(
    Object.entries(tempSystems).map((
      [key, system],
    ) => [key, new system(engine)]),
  );
};
