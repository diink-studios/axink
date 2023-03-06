import Enjin from '..';
import ScriptConstructable from '../core/script/script-constructable.ts';

/**
 * Resources Loader Defenitions
 */
export type ResourcesDefinition = {
  models: Map<string, string>;
  images: Map<string, string>;
  videos: Map<string, string>;
  shaders: Map<string, string>;
  fonts: Array<string>;
};

/**
 * Scripts Loader Defenitions
 */

export type ScriptsDefinition = Map<string, ScriptConstructable>;
// export type ScriptsDefinition = { [key: string]: ScriptConstructable };

export type ScriptsDefinitionInternal = {
  scripts: ScriptsDefinition;
  engine: Enjin;
};

//
