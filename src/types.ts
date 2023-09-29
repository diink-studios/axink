// import { ResourcesDefinition } from "./loaders/loaders";

import { ResourcesDefinition } from './loaders/loaders.d.ts';
import { SystemsConfig } from './systems/systems.ts';

export type AxinkInitialization = {
  entities?: any;
  scripts?: any;
  resources?: ResourcesDefinition;
  interfaces?: any;
};

export type AxinkGraphics = {
  antialias?: boolean;
  background?: number; //0xffffff
  element?: string;
  scaleFactor?: number;
};

export interface AxinkConfigs {
  systems?: SystemsConfig;
  graphics: AxinkGraphics;
}

export type Resources = {
  images: Map<string, any>;
  videos: Map<string, any>;
  models: Map<string, any>;
  shaders: Map<string, any>;
  fonts: Array<string>;
};