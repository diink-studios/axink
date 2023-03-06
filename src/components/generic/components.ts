import { BoxCollider2D } from '../box-collider-2d.ts';
import { Camera } from '../camera.ts';
import { Interface } from '../interface.ts';
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
  | BoxCollider2D
  | Camera
  | Tilemap;

export {
  BoxCollider2D,
  Camera,
  Interface,
  Rectangle,
  Script,
  Shape,
  Sprite,
  Tilemap,
  Transform,
  // Mesh,
  // Light,
  // Animator,
  // PlaneMesh,
  // DirectionalLight,
  // NavMesh,
};
