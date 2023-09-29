import { BoxCollider } from '../box-collider.ts';
import { BoxCollider2D } from '../box-collider-2d.ts';
import { Camera } from '../camera.ts';
import { Interface } from '../interface.ts';
import { Light } from '../light.ts';
import { Mesh } from '../mesh.ts';
import { PlaneMesh } from '../geometries/plane-mesh.ts';
import { Script } from '../script.ts';
import { Shape } from '../shape.ts';
import { Rectangle } from '../shapes/rectangle-shape.ts';
import { Sprite } from '../sprite.ts';
import { Tilemap } from '../tilemap.ts';
import { Transform } from '../transform.ts';

export enum Type {
  Transform = 'transform',
  Script = 'script',
  Sprite = 'sprite',
  Shape = 'shape',
  BoxCollider = 'boxCollider',
  BoxCollider2D = 'boxCollider2D',
  Camera = 'camera',
  CameraControl = 'cameraControl',
  Mesh = 'mesh',
  Light = 'light',
  Interface = 'interface',
  Animator = 'animator',
  NavMesh = 'navMesh',
  TileMap = 'tilemap',
}

export type ComponentType =
  | Type.Transform
  | Type.Script
  | Type.Sprite
  | Type.Shape
  | Type.BoxCollider
  | Type.BoxCollider2D
  | Type.Camera
  | Type.Mesh
  | Type.Light
  | Type.Interface
  | Type.Animator
  | Type.NavMesh
  | Type.TileMap;

export type Components =
  | Transform
  | Script
  | Shape
  | Rectangle
  | Interface
  | Sprite
  | BoxCollider
  | BoxCollider2D
  | Camera
  | Mesh
  | Light
  | Tilemap;

export {
  BoxCollider,
  BoxCollider2D,
  Camera,
  Interface,
  Light,
  Mesh,
  Rectangle,
  Script,
  Shape,
  Sprite,
  Tilemap,
  Transform,
  PlaneMesh,
  // Animator,
  // PlaneMesh,
  // DirectionalLight,
  // NavMesh,
};
