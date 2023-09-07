import { Script, Type } from '../components/generic/components.ts';
import { queryManager } from '../core/query-manager.ts';
import { scriptsLoader } from '../loaders/loader-scripts.ts';
import { AbstractSystem } from './abstract-system.ts';

export class ScriptSystem extends AbstractSystem {
  async run(): Promise<void> {
    // console.log('Scripts Running!');
    queryManager.reset();
    const scenes = this.context.sceneManager.renderScenes;
    if (scenes.length === 0) {
      return;
    }

    scenes.forEach((scene) => {
      const entities = scene.entitiesManager.getAllWithComponents(Type.Script);
      entities.filter((entity) => entity.visible).forEach((entity) => {
        const scripts = entity.components.get(Type.Script) as Script[];
        scripts.forEach((script: Script) => {
          if (script.instance == null) {
            const ScriptConstructable = scriptsLoader.getConstructable(
              script.name,
            );

            script.instance = new ScriptConstructable(
              this.context.sceneManager,
              entity,
            );

            console.log(
              'Will add components to Script!',
              entity.id,
              entity.components,
            );
            for (const [key, value] of [...entity.components]) {
              if (key !== Type.Script) {
                // @ts-ignore
                script.instance[key] = value;
              }
            }

            // @ts-ignore
            script.instance.start();
          } else if (script.instance != null) {
            script.instance.update();
          }
        });
      });
    });
  }
}
