import { BoxCollider, Mesh, Transform, Type } from '../components/generic/components.ts';
import { Entity, Sprite } from '../index.ts';
import { resourcesLoader } from '../loaders/loader-resources.ts';
import { AbstractSystem } from './abstract-system.ts';
import { AnimationMixer, Clock, MathUtils, BufferAttribute, LineBasicMaterial, BufferGeometry, LineSegments } from 'https://esm.sh/three@0.150.0';
// import * as CANNON from 'https://esm.sh/cannon-es@0.20.0';
// import CannonDebugger from 'https://esm.sh/cannon-es-debugger@1.0.0';
import { geometryToShape } from '../utils/mesh.ts';


// import RAPIER from 'https://esm.sh/@dimforge/rapier3d@0.11.2';
import RAPIER from 'https://cdn.skypack.dev/@dimforge/rapier3d-compat';

export class PhysicsSystem extends AbstractSystem {
  private world!: any;
  // private material = new CANNON.Material('solidMaterial');
  // private contactMaterial: any;
  private lines: any;

  async start(deltaTime?: number | undefined): Promise<void> {
    // const RAPIER = await import('https://esm.sh/@dimforge/rapier3d@0.11.2');
    await RAPIER.init();
    const scenes = this.context.sceneManager.renderScenes;
    console.log('PHYSICS SYSTEMS');
    this.world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

    // // Ground
    let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 0.1, 10.0);
    this.world.createCollider(groundColliderDesc);


    scenes.forEach((scene) => {
      let material = new LineBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
      });
      let geometry = new BufferGeometry();
      this.lines = new LineSegments(geometry, material);
      scene.addChild(this.lines);
    });

    this.queryComponents = [
      Type.BoxCollider,
    ];

  }

  async run() {
    const scenes = this.context.sceneManager.renderScenes;

    if (scenes.length === 0) {
      return;
    }

    scenes.forEach((scene) => {

      this.query('add').filter((entity) => entity.visible).forEach(
        (entity: Entity) => {
          const meshComponent = entity.components.get(Type.Mesh) as Mesh;
          const spriteComponent = entity.components.get(Type.Sprite) as Sprite;
          const colliderComponent = entity.components.get(Type.BoxCollider) as BoxCollider;

          // console.log('Shape 1:', entity.id, meshComponent);
          // console.log('Sprite 2:', entity.id, spriteComponent);

          const { position: { x, y, z }, rotation } = entity.components.get(
            Type.Transform,
          ) as Transform;

          // const instance = meshComponent?.instance || spriteComponent?.instance;

          if (!colliderComponent.instance && meshComponent?.instance) {
            // console.log('Shape 1:', entity.id, instance);
            // const result = threeToCannon(
            //   meshComponent?.instance,
            //   {
            //     type: ShapeType.HULL,
            //   },
            // );

            const box = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
            colliderComponent.instance = this.world.createCollider(box);

            // console.log('Result:', entity.id, result);
            // if (result) {

            //   const { shape, offset, orientation } = result;

            //   console.log('Shape:', entity.id, result);
            //   colliderComponent.instance = new CANNON.Body({
            //     mass: 0, // kg
            //     position: new CANNON.Vec3(0, 0, 0), // m
            //     shape,
            //   });

            //   // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   //   new CANNON.Vec3(0, 1, 0),
            //   //   MathUtils.degToRad(rotation.y),
            //   // );
            //   // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   //   new CANNON.Vec3(0, 0, 1),
            //   //   MathUtils.degToRad(rotation.z),
            //   // );
            //   //
            //   colliderComponent.instance.quaternion.setFromEuler(
            //     MathUtils.degToRad(rotation.x),
            //     MathUtils.degToRad(rotation.y),
            //     MathUtils.degToRad(rotation.z),
            //     'XYZ',
            //   );

            //   colliderComponent.instance.addEventListener('collide', function (e: any) {
            //     console.log(entity.id, e);
            //   });

            //   colliderComponent.instance.fixedRotation = true;
            //   this.world.addBody(colliderComponent.instance);

            //   console.log('Cannon World:', this.world);
            // }

            // @ts-ignore
            // geometryToShape(meshComponent.instance?.children[0].geometry);
            // if (colliderComponent.mesh) {
            // }
            // Create a plane
            // var groundBody = new CANNON.Body({
            //   mass: 0, // mass == 0 makes the body static
            //   shape: new CANNON.Plane(),
            // });
            // groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
            // this.world.addBody(groundBody);

            // console.log('Cannon Debug:', this.cannonDebugger);
          }

          if (!colliderComponent.instance && spriteComponent?.instance) {
            const { width, height } = spriteComponent;

            const box = RAPIER.ColliderDesc.cuboid(0.5, 0.5, 0.5);
            colliderComponent.instance = this.world.createCollider(box);
            // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   new CANNON.Vec3(0, 1, 0),
            //   MathUtils.degToRad(rotation.y),
            // );
            // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   new CANNON.Vec3(0, 0, 1),
            //   MathUtils.degToRad(rotation.z),
            // );
            //
            // colliderComponent.instance.quaternion.setFromEuler(
            //   MathUtils.degToRad(rotation.x),
            //   MathUtils.degToRad(rotation.y),
            //   MathUtils.degToRad(rotation.z),
            //   'XYZ',
            // );

            // colliderComponent.instance.fixedRotation = true;
            // colliderComponent.instance.updateMassProperties();

            // colliderComponent.instance.addEventListener('collide', function (e: any) {
            //   console.log(entity.id, e);
            // });

            // this.world.addBody(colliderComponent.instance);
          }
        },
      );

      // this.query('update').filter((entity) => entity.visible).forEach(
      //   (entity: Entity) => {
      //     const meshComponent = entity.components.get(Type.Mesh) as Mesh;
      //     const spriteComponent = entity.components.get(Type.Sprite) as Sprite;
      //     const colliderComponent = entity.components.get(Type.BoxCollider) as BoxCollider;

      //     const { position: { x, y, z }, rotation } = entity.components.get(
      //       Type.Transform,
      //     ) as Transform;

      //     // const instance = meshComponent?.instance || spriteComponent?.instance;

      //     if (colliderComponent.instance) {
      //       colliderComponent.instance.position.set(x, y, z);
      //       colliderComponent.instance.quaternion.setFromEuler(
      //         MathUtils.degToRad(rotation.x),
      //         MathUtils.degToRad(rotation.y),
      //         MathUtils.degToRad(rotation.z),
      //         'XYZ',
      //       );
      //     }

      //     if (!colliderComponent.instance && spriteComponent?.instance) {
      //       const { width, height } = spriteComponent;

      //       console.log(
      //         'SCALED:',
      //         this.getScaled(width),
      //         this.getScaled(height),
      //         spriteComponent?.instance,
      //       );
      //       const box = new CANNON.Box(
      //         new CANNON.Vec3(this.getScaled(width), this.getScaled(height), 0.1),
      //       );

      //       // box.scale(this.getScaled(width), this.getScaled(height), 1);
      //       console.log('Box:', box);
      //       colliderComponent.instance = new CANNON.Body({
      //         mass: 200, // kg
      //         position: new CANNON.Vec3(0, this.getScaled(height), 0), // m
      //         shape: box,
      //         material: this.material
      //       });
      //       // colliderComponent.instance.angularDamping = 0;
      //       colliderComponent.instance.fixedRotation = true;
      //       colliderComponent.instance.updateMassProperties();
      //       // colliderComponent.instance.quaternion.setFromAxisAngle(
      //       //   new CANNON.Vec3(0, 1, 0),
      //       //   MathUtils.degToRad(rotation.y),
      //       // );
      //       // colliderComponent.instance.quaternion.setFromAxisAngle(
      //       //   new CANNON.Vec3(0, 0, 1),
      //       //   MathUtils.degToRad(rotation.z),
      //       // );
      //       //
      //       colliderComponent.instance.quaternion.setFromEuler(
      //         MathUtils.degToRad(rotation.x),
      //         MathUtils.degToRad(rotation.y),
      //         MathUtils.degToRad(rotation.z),
      //         'XYZ',
      //       );

      //       this.world.addBody(colliderComponent.instance);
      //     }
      //   },
      // );

      // const validEntities = scene.entitiesManager
      //   .getAllWithComponents(...this.queryComponents);

      // validEntities.forEach((entity: Entity) => {
      //   const boxColliderComponent = entity.components.get(Type.BoxCollider) as BoxCollider;
      //   const transform = entity.components.get(
      //     Type.Transform,
      //   ) as Transform;

      //   transform.position = boxColliderComponent.instance.position;
      // });
    });
    console.log('LOG', this.world)
    this.world.step();
    scenes.forEach((scene) => {
      let buffers = this.world.debugRender();
      // this.lines.visible = true;
      this.lines.geometry.setAttribute(
        "position",
        new BufferAttribute(buffers.vertices, 3),
      );
      this.lines.geometry.setAttribute(
        "color",
        new BufferAttribute(buffers.colors, 4),
      );
    });
  }

  getScaled(value: number) {
    return ((value * 1) / this.context.scaleFactor) / 2;
  }
}
