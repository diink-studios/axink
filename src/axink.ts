import { AbstractSystem, System } from './systems/abstract-system.ts';
import { AxinkConfigs, AxinkGraphics, AxinkInitialization } from './types.ts';
import {
  BoxGeometry,
  Camera,
  Mesh,
  MeshBasicMaterial,
  PCFSoftShadowMap,
  Scene as TScene,
  sRGBEncoding,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'https://esm.sh/three@0.150.0';
import {
  BlendFunction,
  EffectComposer,
  HueSaturationEffect,
  RenderPass,
} from 'https://esm.sh/postprocessing@6.30.1';

import { loadSystem } from './systems/systems.ts';
import { appendToHead, packages } from './utils/lib.ts';
import SceneManager from './managers/scenes-manager.ts';
import Scene, { SceneData } from './core/scene.ts';
import { resourcesLoader } from './loaders/loader-resources.ts';
import { queryManager } from './core/query-manager.ts';
import { entitiesLoader } from './loaders/loader-entities.ts';
import { scriptsLoader } from './loaders/loader-scripts.ts';

export class Axink {
  private _systems: Map<string, System>;

  public readonly sceneManager: SceneManager;
  public readonly renderer: WebGLRenderer;
  public readonly composer: EffectComposer;
  public readonly composers: EffectComposer[] = [];

  public readonly scaleFactor: number;

  constructor({ systems = {}, graphics }: AxinkConfigs) {
    queryManager.context = this;
    this.sceneManager = new SceneManager();
    this.renderer = this.setupRenderer(graphics);
    this.composer = new EffectComposer(this.renderer);
    this._systems = loadSystem(this, systems);
    this.scaleFactor = graphics.scaleFactor || 1;
  }

  /**
   * Setup Renderer
   */
  private setupRenderer(
    { antialias = true, background = 0xffffff, element }: AxinkGraphics,
  ): WebGLRenderer {
    console.log('[Axink]::INITIALIZE VIEWPORT');
    // Options
    const renderer = new WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: false,
    });

    renderer.setClearColor(background, 1);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.outputEncoding = sRGBEncoding;

    // renderer.toneMapping = ReinhardToneMapping;
    // renderer.toneMappingExposure = 1.2;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.autoClear = false;
    renderer.autoClearDepth = false;
    renderer.setSize(window.innerWidth, window.innerHeight);

    appendToHead(packages);

    addEventListener('resize', () => {
      // if (this.sceneManager.currentScene) {
      //   if ('aspect' in this.sceneManager.currentScene.camera) {
      //     this.sceneManager.currentScene.camera.aspect = window.innerWidth / window.innerHeight;
      //   }
      //   this.sceneManager.currentScene.camera.updateProjectionMatrix();
      // }
      // this.camera.aspect = window.innerWidth / window.innerHeight;
      // this.camera.updateProjectionMatrix();
      renderer.clear();
      renderer.setSize(innerWidth, innerHeight);
    });

    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
    document.body.style.width = '100vw';
    document.body.style.height = '100vh';

    if (element) {
      const ele = document.querySelector(element);
      if (ele) {
        console.log(ele);
        renderer.setSize(ele.clientWidth, ele.clientHeight);
        ele.appendChild(renderer.domElement);
        ele.appendChild(this.loadInterface());
      }
    } else {
      document.body.appendChild(renderer.domElement);
      document.body.appendChild(this.loadInterface());
    }

    return renderer;
  }

  private loadInterface() {
    const interfaceElement = document.createElement('div');
    interfaceElement.id = 'interfaces';
    interfaceElement.style.position = 'absolute';
    interfaceElement.style.width = '100%';
    interfaceElement.style.height = '100%';
    interfaceElement.style.top = '0';
    interfaceElement.style.left = '0';

    return interfaceElement;
  }

  async init(initializationParameters: AxinkInitialization) {
    if (initializationParameters.entities) {
      entitiesLoader.addEntities(initializationParameters.entities);
    }
    if (initializationParameters.resources) {
      console.log('Resources');
      resourcesLoader.addResources(initializationParameters.resources);
    }
    // if (initializationParameters.interfaces != null) {
    //   interfacesLoader.addInterfaces(initializationParameters.interfaces);
    // }
    if (initializationParameters.scripts) {
      await scriptsLoader.load({
        scripts: initializationParameters.scripts,
        engine: this,
      });
    }
  }

  async start(): Promise<void> {
    console.log('[AXINK]::START');
    this.sceneManager.init();

    console.log(
      'AFTER INIT:',
      this.sceneManager.currentScene?.entitiesManager.getAll(),
    );

    if (this.sceneManager.currentScene) {
      await this.sceneManager.currentScene.load();

      console.log(
        'AFTER LOAD:',
        this.sceneManager.currentScene?.entitiesManager.getAll(),
      );
      await resourcesLoader.load(this.sceneManager.renderScenes);

      // const geometry = new BoxGeometry(1, 1, 1);
      // const material = new MeshBasicMaterial({ color: 0x00ff00 });
      // const cube = new Mesh(geometry, material);
      // this.sceneManager.currentScene.addChild(cube);
    }
    console.log(this.sceneManager.currentScene?.entitiesManager.getAll());
    console.log('[AXINK]::SYSTEMS(START)');

    for (const system of [...this._systems]) {
      await system[1].start();
    }
    // this._systems.forEach(async (system: System) => {
    // });

    console.log('[AXINK]::LOOP(START)');

    this.loop();
  }

  public postprocessing(scene: TScene, camera: Camera) {
    // effectComponser.renderToScreen = false;
    const effectComponser = new EffectComposer(this.renderer);
    // const renderPass = new RenderPass(scene, camera)
    const renderPass = new RenderPass(scene, camera);
    // renderPass.clear = false;
    // renderPass.clearColor = false;
    // renderPass.clearDepth = false;
    renderPass.renderToScreen = true;

    effectComponser.addPass(renderPass);

    // const hueSaturationEffect = new HueSaturationEffect({
    //   blendFunction: BlendFunction.SKIP,
    //   saturation: 1.4,
    //   hue: 0.0,
    // });

    // effectComponser.addPass(hueSaturationEffect);

    return effectComponser;
  }

  private async loop() {
    // this.renderer.clear();
    // this.composer.render(0.1);
    // this.renderer.clearDepth();
    // console.log('[AXINK]::SYSTEMS(RUN)');
    for (const [, system] of this._systems) {
      if ('run' in system) {
        await system.run();
      }
    }
    queryManager.reset();
    // this.composers.forEach((composer) => {
    //   this.renderer.autoClear = false;
    //   composer.render();
    // });
    // this.composer.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  addScene(sceneData: SceneData): void {
    console.log('[AXINK]::ADD SCENE');
    this.sceneManager.add(new Scene(sceneData));
  }
}
