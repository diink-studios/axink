import * as EssentialsPlugin from 'https://esm.sh/@tweakpane/plugin-essentials@0.1.8';
import type { Event, Object3D, Scene } from 'https://esm.sh/three@0.150.0';
import { Pane } from 'https://esm.sh/tweakpane@3.1.6';
import * as TweakTreeviewPlugin from 'https://esm.sh/tweakpane-treeview-plugin@1.0.14';
// import { sceneEvent } from '../managers/scene-manager';

import { TransformControls } from 'https://esm.sh/three@0.150.0/examples/jsm/controls/TransformControls.js';

export const createInspectorElement = (element: any, pane: any) => {
  for (const [key, value] of Object.entries(element)) {
    if (typeof value === 'boolean') {
      pane.addInput(element, key);
    }
    if (typeof value === 'number') {
      pane.addInput(element, key);
    }
  }
};

export const booleanOpt = {
  true: true,
  false: false,
};

export class Inspector {
  public readonly pane!: Pane;
  public readonly fpsGraph!: any;
  public readonly tabs: any;

  private treeview: Folder[] = [];

  constructor() {
    const element = document.getElementById('inspector');

    this.pane = new Pane({
      // @ts-ignore
      container: element,
    });

    this.pane.registerPlugin(EssentialsPlugin);
    this.pane.registerPlugin(TweakTreeviewPlugin);
    this.fpsGraph = this.addFPSGraph();

    this.tabs = this.pane.addTab({
      pages: [{ title: 'Overview' }, { title: 'Post Processing' }, {
        title: 'Inspector',
      }],
    });
  }

  addFolder(title: string, target: any, options: Record<string, InputParams>) {
    const folder = this.tabs.pages[1].addFolder({
      title,
    });

    Object.entries(options).forEach(([key, value]) => {
      folder.addInput(target, key, value);
    });

    return folder;
  }

  addFPSGraph() {
    return this.pane.addBlade({
      view: 'fpsgraph',
      label: 'fpsgraph',
    });
  }

  addScene(scene: Scene) {
    this.treeview = this.createFolder(scene);
    let blade = this.tabs.pages[0].addBlade({
      options: this.treeview[0].children,
      view: 'treeview-3js',
    });
    // sceneEvent.on('addedchild', () => {
    //   blade.dispose();
    //   this.treeview = this.createFolder(scene);
    //   blade = this.tabs.pages[0].addBlade({
    //     options: this.treeview[0].children,
    //     view: 'treeview-3js',
    //   });
    // });
  }

  updateInspector(element: any) {
    if (this.tabs.pages[2].children.length > 0) {
      this.tabs.pages[2].children.forEach((item: any) => item.dispose());
    }

    // console.log('Update:', element)
    this.tabs.pages[2].addInput(element, 'name', {
      disabled: true,
    });

    this.tabs.pages[2].addInput(element, 'visible');

    // createInspectorElement(element, this.tabs.pages[2]);
    // if ('enabled' in element) {
    //   this.tabs.pages[2].addInput(element, 'enabled');
    // }
    // if ('position' in element) {
    //   this.tabs.pages[2].addInput(element, 'position');
    // }
    // if ('rotation' in element) {
    //   this.tabs.pages[2].addInput(element, 'rotation');
    // }
    // if('castShadow' in element) {
    //   this.tabs.pages[2].addInput(element, 'castShadow');
    // }

    // if ('intensity' in element){
    //   this.tabs.pages[2].addInput(element, 'intensity');
    // }
  }

  createFolder(model: Object3D<Event>): Folder[] {
    const folders: Folder[] = [];
    const folder: Folder = {
      title: model.name,
      action: () => {
        this.updateInspector(model);
      },
      model,
      children: [],
    };

    folders.push(folder);

    for (const child of model.children) {
      folder.children.push(this.createChildFolder(child));
    }

    return folders;
  }

  createChildFolder(model: Object3D<Event>): Folder {
    const folder: Folder = {
      title: model.name,
      model,
      action: () => {
        this.updateInspector(model);
      },
      children: [],
    };

    for (const child of model.children) {
      folder.children.push(this.createChildFolder(child));
    }

    return folder;
  }
}

type Folder = {
  title: string;
  action: () => void;
  children: Array<Folder>;
  model: any;
};

export const inspector = new Inspector();
