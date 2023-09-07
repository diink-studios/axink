import { Components, Type } from '../components/generic/components.ts';
import { ComponentsDefinitions } from '../components/generic/components-definitions.ts';
import { Script } from '../components/script.ts';
import { deepProxy, deepUpdate, generateId } from '../utils/utils.ts';
import ScriptInstance from './script/script-instance.ts';
import { queryManager } from './query-manager.ts';
import { Component } from '../components/generic/abstract-component.ts';

import DeepProxy from 'https://esm.sh/proxy-deep@3.1.1';

export class Entity {
  public readonly id: string;

  public readonly name: string;

  public readonly components: Map<Type, Components | Script[]> = new Map();

  private _visible: boolean;

  public tag: string;

  constructor(name: string, tag = '') {
    this.id = generateId();
    this.name = name;
    this.tag = tag;
    this._visible = true;
  }

  addComponent(component: Components): Entity {
    if (component.type === Type.Script) {
      const currentComp = this.components.has(component.type)
        ? (this.components.get(component.type) as Script[])
        : [];
      this.components.set(
        component.type,
        [...currentComp, component] as Script[],
      );
    } else {
      // console.log('ADD COMPONENT', this.id);
      queryManager.add('add', this.id);
      const comp = deepProxy(component, {
        set: (obj: any, prop: any, value: any) => {
          // if (!('sequence' in obj)) {
          //   console.log('COMPONENT ADD TO UPDATE:', obj, prop, value);
          // }
          queryManager.add('update', this.id);
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          obj[prop] = value;
          return true;
        },
      });

      this.components.set(
        component.type,
        comp,
      );
    }
    // console.log(this.id, this.components);
    return this;
  }

  removeComponent(componentType: Type): Entity {
    this.components.delete(componentType);
    return this;
  }

  getScript(name: string): ScriptInstance | undefined {
    const scripts = this.components.get(Type.Script) as Script[];
    return scripts.find((script) => script.name === name)?.instance;
  }

  getComponent(componentType: Type): Components | ComponentsDefinitions[] {
    const component = this.components.get(componentType);
    if (component == null) {
      throw Error(
        `[Entity] This entity doesn´t contain a ${componentType} component`,
      );
    }
    return component;
  }

  get visible() {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  _clone(): Entity {
    const clone = new Entity(this.name);
    // console.log('CLONING', clone.id);

    for (const [, component] of this.components) {
      if (Array.isArray(component)) {
        component.forEach((item) => {
          if (item.type === Type.Script) {
            clone.addComponent(item._clone());
          } else {
            const proxyComp = deepProxy(item._clone(), {
              set: (obj: any, prop: any, value: any) => {
                // if (!('sequence' in obj)) {
                //   console.log('COMPONENT ADD TO UPDATE:', obj, prop, value);
                // }
                queryManager.add('update', clone.id);
                // deno-lint-ignore ban-ts-comment
                // @ts-ignore
                obj[prop] = value;
                return true;
              },
            });
            clone.addComponent(proxyComp);
          }
        });
      } else {
        if (component.type !== Type.Script) {
          const proxyComp = deepProxy(component._clone(), {
            set: (obj: any, prop: any, value: any) => {
              // if (!('sequence' in obj)) {
              //   console.log('COMPONENT ADD TO UPDATE:', obj, prop, value);
              // }
              queryManager.add('update', clone.id);
              // deno-lint-ignore ban-ts-comment
              // @ts-ignore
              obj[prop] = value;
              return true;
            },
          });
          clone.addComponent(proxyComp);
        }
        clone.addComponent(component._clone());
      }
    }
    return clone;
  }
}
