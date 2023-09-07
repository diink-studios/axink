import { BoxCollider, Mesh, Transform, Type } from '../components/generic/components.ts';
import { Entity, Sprite } from '../index.ts';
import { resourcesLoader } from '../loaders/loader-resources.ts';
import { AbstractSystem } from './abstract-system.ts';
import { AnimationMixer, Clock, MathUtils } from 'https://esm.sh/three@0.150.0';
import * as CANNON from 'https://esm.sh/cannon-es@0.20.0';
import CannonDebugger from 'https://esm.sh/cannon-es-debugger@1.0.0';
import { geometryToShape } from '../utils/mesh.ts';
import { ShapeType, threeToCannon } from 'https://esm.sh/three-to-cannon@4.3.0';

export class PhysicsSystem extends AbstractSystem {
  private world: CANNON.World;
  private material = new CANNON.Material('solidMaterial');
  private contactMaterial: any;

  async start(deltaTime?: number | undefined): Promise<void> {
    console.log('PHYSICS SYSTEMS');
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.87, 0); // m/s²
    // this.world.quatNormalizeSkip = 0;
    // this.world.quatNormalizeFast = false;
    // this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
    // this.world.defaultContactMaterial.contactEquationRelaxation = 4;
    // const solver = new CANNON.GSSolver();
    // solver.iterations = 7;
    // solver.tolerance = 0.1;
    // this.world.solver = new CANNON.SplitSolver(solver);
    // world.gravity.set(0,-40,0); 
    // world.broadphase = new CANNON.NaiveBroadphase();
    // world.broadphase.useBoundingBoxes = true;
    // var fixedTimeStep = 1.0 / 30.0; // seconds
    // var maxSubSteps = 3;

    const planeShape = new CANNON.Plane();

    console.log('MATERIAL:', this.material);
    this.contactMaterial = new CANNON.ContactMaterial(this.material, this.material,
      {
        friction: 0,
        restitution: 0,
        contactEquationRelaxation: 0,
        contactEquationStiffness: 0,
        frictionEquationRelaxation: 0,
        frictionEquationStiffness: 0,

      }
    );

    this.world.addContactMaterial(this.contactMaterial);

    const planeBody = new CANNON.Body({
      mass: 0,
      shape: planeShape,
      material: this.contactMaterial,
    });

    planeBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // make it face up

    this.world.addBody(planeBody);

    // const slippe = new CANNON.Material('slipperyMaterial');
    // const material = new CANNON.ContactMaterial(
    //   slippe,
    //   slippe,
    //   0.0, // friction coefficient
    //   0.3, // restitution
    // );
    // this.world.addContactMaterial(material);

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
      // @ts-ignore
      if (!scene.cannoDebug) {
        // @ts-ignore
        scene.cannoDebug = new CannonDebugger(scene.instance, this.world, {
          // options...
        });
      }

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
            const result = threeToCannon(
              meshComponent?.instance,
              {
                type: ShapeType.HULL,
              },
            );

            console.log('Result:', entity.id, result);
            if (result) {
              const { shape, offset, orientation } = result;

              console.log('Shape:', entity.id, result);
              colliderComponent.instance = new CANNON.Body({
                mass: 0, // kg
                position: new CANNON.Vec3(0, 0, 0), // m
                shape,
              });

              // colliderComponent.instance.quaternion.setFromAxisAngle(
              //   new CANNON.Vec3(0, 1, 0),
              //   MathUtils.degToRad(rotation.y),
              // );
              // colliderComponent.instance.quaternion.setFromAxisAngle(
              //   new CANNON.Vec3(0, 0, 1),
              //   MathUtils.degToRad(rotation.z),
              // );
              //
              colliderComponent.instance.quaternion.setFromEuler(
                MathUtils.degToRad(rotation.x),
                MathUtils.degToRad(rotation.y),
                MathUtils.degToRad(rotation.z),
                'XYZ',
              );

              colliderComponent.instance.addEventListener('collide', function (e: any) {
                console.log(entity.id, e);
              });

              colliderComponent.instance.fixedRotation = true;
              this.world.addBody(colliderComponent.instance);

              console.log('Cannon World:', this.world);
            }

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

            console.log(
              'SCALED:',
              this.getScaled(width),
              this.getScaled(height),
              spriteComponent?.instance,
            );
            const box = new CANNON.Box(
              new CANNON.Vec3(this.getScaled(width), this.getScaled(height), 0.1),
            );

            colliderComponent.instance = new CANNON.Body({
              mass: 1, // kg
              position: new CANNON.Vec3(0, this.getScaled(height), 0), // m
              shape: box,
              material: this.material,
            });

            // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   new CANNON.Vec3(0, 1, 0),
            //   MathUtils.degToRad(rotation.y),
            // );
            // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   new CANNON.Vec3(0, 0, 1),
            //   MathUtils.degToRad(rotation.z),
            // );
            //
            colliderComponent.instance.quaternion.setFromEuler(
              MathUtils.degToRad(rotation.x),
              MathUtils.degToRad(rotation.y),
              MathUtils.degToRad(rotation.z),
              'XYZ',
            );

            colliderComponent.instance.fixedRotation = true;
            colliderComponent.instance.updateMassProperties();

            colliderComponent.instance.addEventListener('collide', function (e: any) {
              console.log(entity.id, e);
            });

            this.world.addBody(colliderComponent.instance);
          }
        },
      );

      this.query('update').filter((entity) => entity.visible).forEach(
        (entity: Entity) => {
          const meshComponent = entity.components.get(Type.Mesh) as Mesh;
          const spriteComponent = entity.components.get(Type.Sprite) as Sprite;
          const colliderComponent = entity.components.get(Type.BoxCollider) as BoxCollider;

          const { position: { x, y, z }, rotation } = entity.components.get(
            Type.Transform,
          ) as Transform;

          // const instance = meshComponent?.instance || spriteComponent?.instance;

          if (colliderComponent.instance) {
            colliderComponent.instance.position.set(x, y, z);
            colliderComponent.instance.quaternion.setFromEuler(
              MathUtils.degToRad(rotation.x),
              MathUtils.degToRad(rotation.y),
              MathUtils.degToRad(rotation.z),
              'XYZ',
            );
          }

          if (!colliderComponent.instance && spriteComponent?.instance) {
            const { width, height } = spriteComponent;

            console.log(
              'SCALED:',
              this.getScaled(width),
              this.getScaled(height),
              spriteComponent?.instance,
            );
            const box = new CANNON.Box(
              new CANNON.Vec3(this.getScaled(width), this.getScaled(height), 0.1),
            );

            // box.scale(this.getScaled(width), this.getScaled(height), 1);
            console.log('Box:', box);
            colliderComponent.instance = new CANNON.Body({
              mass: 200, // kg
              position: new CANNON.Vec3(0, this.getScaled(height), 0), // m
              shape: box,
              material: this.material
            });
            // colliderComponent.instance.angularDamping = 0;
            colliderComponent.instance.fixedRotation = true;
            colliderComponent.instance.updateMassProperties();
            // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   new CANNON.Vec3(0, 1, 0),
            //   MathUtils.degToRad(rotation.y),
            // );
            // colliderComponent.instance.quaternion.setFromAxisAngle(
            //   new CANNON.Vec3(0, 0, 1),
            //   MathUtils.degToRad(rotation.z),
            // );
            //
            colliderComponent.instance.quaternion.setFromEuler(
              MathUtils.degToRad(rotation.x),
              MathUtils.degToRad(rotation.y),
              MathUtils.degToRad(rotation.z),
              'XYZ',
            );

            this.world.addBody(colliderComponent.instance);
          }
        },
      );

      const validEntities = scene.entitiesManager
        .getAllWithComponents(...this.queryComponents);

      validEntities.forEach((entity: Entity) => {
        const boxColliderComponent = entity.components.get(Type.BoxCollider) as BoxCollider;
        const transform = entity.components.get(
          Type.Transform,
        ) as Transform;

        transform.position = boxColliderComponent.instance.position;
      });
    });

    this.world.fixedStep();
    scenes.forEach((scene) => {
      // @ts-ignore
      scene.cannoDebug.update();
    });
  }

  getScaled(value: number) {
    return ((value * 1) / this.context.scaleFactor) / 2;
  }
}
