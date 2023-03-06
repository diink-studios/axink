import { Axink } from '../index.ts';
import { AbstractSystem, System } from './abstract-system.ts';
import { ScriptSystem } from './script-system.ts';
import { CameraSystem } from './camera-system.ts';
// import { Collision2DSystem } from './collision2d-system.ts';
// import { InterfaceSystem } from './inteface-system.ts';
// import { SceneSystem } from './scene-system.ts';
// import { ScriptSystem } from './script-system.ts';
import { ShapeSystem } from './shape-system.ts';
// import { SpriteSystem } from './sprite-system.ts';
interface Constructable<T> {
  new (context: Axink): T;
}

const SYSTEMS: Record<string, Constructable<System>> = {
  ScriptSystem: ScriptSystem,
  ShapeSystem: ShapeSystem,
  CameraSystem: CameraSystem,
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
