import {
  Color,
  Object3D,
  Vector2,
  Vector3,
} from 'https://esm.sh/three@0.150.0';

export interface TransformDefinition {
  position?: Vector3;
  rotation?: Vector3;
  scale?: Vector3;
}

export interface SpriteDefinition {
  source: string;
  width: number;
  height: number;
  pivot?: string;

  column?: number;
  row?: number;
}

export interface ShapeDefinition {
  shape?: 'rectangle';
  fill?: Color;
  pivot?: string;
}

export interface RectangleShapeDefinition extends ShapeDefinition {
  width: number;
  height: number;
  radius?: number | number[];
}

export interface ScriptDefinition {
  name: string;
}

export type BoxCollider2DDefinition = {
  width: number;
  height: number;
  offset?: Vector2;
  isStatic: boolean;
  isTrigger?: boolean;
  pivot: string;
  fixedRotation?: boolean;
};

export type BoxCollider2DInstance = {
  position: Vector2;
  colliding: boolean;
  prevPosition: Vector2 | null;
  willIntersect: string[];
  triggerCollision: any;
  onTriggerEnter: () => boolean;
  onTriggerStay: () => boolean;
  onTriggerExit: () => boolean;
};

export type BoxColliderDefinition = {
  height: number;
  width: number;
  mass: number;
  mesh: boolean;
  offset?: Vector2;
  isStatic: boolean;
  isTrigger?: boolean;
  pivot: string;
  fixedRotation?: boolean;
};

// Tilemap Component
export interface TilemapDefinition {
  name: string;
  infinite?: boolean;
  rows?: number | null;
  columns?: number | null;
  layers: Array<Layer>;
}

export type Layer = Array<number>;

export type TileDefinition = {
  name: string;
  row: number;
  column: number;
  walkable: boolean;
  texture?: any;
};

export interface CameraDefinition {
  active?: boolean;
  context?: '2d' | '3d';
  projection?: 'perspective' | 'orthographic';
  fov?: number;
  near?: number;
  far?: number;
  factor?: number;
  lookAt?: string;
  background?: Color;
}

export interface CameraControlDefinition {
  controlType?: 'orbit' | 'map';
}

export interface MeshDefinition {
  model: string;
  castShadow?: boolean;
  receiveShadow?: boolean;
  visible?: boolean;
  material?: any;
  fileType?: string;
  shader?: string;
  animation?: boolean;
}

export interface BoxMeshDefinition extends Omit<MeshDefinition, 'model'> {
  width?: number;
  height?: number;
  lenght?: number;
}

export interface PlaneMeshDefinition extends Omit<MeshDefinition, 'model'> {
  width: number;
  height: number;
  widthSegments?: number;
  heightSegments?: number;
}

export interface LightDefinition {
  light: 'directional' | 'ambient' | 'hemisphere' | 'point' | 'spot';
  color?: Color;
  intensity?: number;
  // visible?: boolean;
}

export interface PointLightDefinition extends Omit<LightDefinition, 'light'> {
  decay: number;
  distance: number;
  power?: number;
}
export interface DirectionalLightDefinition
  extends Omit<LightDefinition, 'light'> {
  castShadow: boolean;
  target?: Object3D | null;
}

export interface InterfaceDefinition {
  props?: Record<string, any>;
  template: string;
}

export interface AnimatorDefinition {
  initialState: string;
  animations: string[];
  rules: string[];
}

export interface NavMeshDefinition {
  cellSize: number;
  cellHeight: number;
  walkableSlopeAngle: number;
  walkableHeight: number;
  walkableClimb: number;
  walkableRadius: number;
  maxEdgeLen: number;
  maxSimplificationError: number;
  minRegionArea: number;
  mergeRegionArea: number;
  maxVertsPerPoly: number;
  detailSampleDist: number;
  detailSampleMaxError: number;
}

export type ComponentsDefinitions =
  | TransformDefinition
  | SpriteDefinition
  | ShapeDefinition
  | ScriptDefinition
  | BoxColliderDefinition
  | BoxCollider2DDefinition
  | CameraDefinition
  | CameraControlDefinition
  | TilemapDefinition
  | RectangleShapeDefinition
  | MeshDefinition
  | PlaneMeshDefinition
  | BoxMeshDefinition
  | InterfaceDefinition
  | LightDefinition
  | AnimatorDefinition
  | NavMeshDefinition;
