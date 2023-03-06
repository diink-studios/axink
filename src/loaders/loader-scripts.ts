import ScriptConstructable from '../core/script/script-constructable.ts';
import { ScriptsDefinitionInternal } from './loaders.d.ts';

class ScriptsLoader {
  private _scripts: Map<string, ScriptConstructable>;

  constructor() {
    this._scripts = new Map();
  }

  async load(scripts: ScriptsDefinitionInternal): Promise<void> {
    this._scripts = scripts.scripts;
  }

  getConstructable(name: string): ScriptConstructable {
    const constructable = this._scripts.get(name);
    if (constructable == null) {
      throw new Error(`[ResourceLoader] could not find script "${name}"`);
    }
    return constructable;
  }
}

export const scriptsLoader = new ScriptsLoader();
