import * as CANNON from 'https://esm.sh/cannon-es@0.20.0';
import { BufferGeometry, Vector3 } from 'https://esm.sh/three@0.150.0';
import { ConvexGeometry } from 'https://esm.sh/three@0.150.0/examples/jsm/geometries/ConvexGeometry.js';
import { SimplifyModifier } from 'https://esm.sh/three@0.150.0/examples/jsm/modifiers/SimplifyModifier.js';
import { mergeVertices } from 'https://esm.sh/three@0.150.0/examples/jsm/utils/BufferGeometryUtils.js';
/**
 * Converts a three.js shape to a cannon.js geometry.
 * ⚠️ Warning: it will not work if the geometry has been rotated
 * or scaled beforehand.
 * If you want a more robust conversion, use this library:
 * https://github.com/donmccurdy/three-to-cannon
 * @param {Geometry} geometry The three.js geometry
 * @return {Shape} The cannon.js shape
 */
// export function geometryToShape(geometry) {
//   switch (geometry.type) {
//     case 'BoxGeometry':
//     case 'BoxBufferGeometry': {
//       const { width = 1, height = 1, depth = 1 } = geometry.parameters;

//       const halfExtents = new CANNON.Vec3(width / 2, height / 2, depth / 2);
//       return new CANNON.Box(halfExtents);
//     }

//     case 'PlaneGeometry':
//     case 'PlaneBufferGeometry': {
//       return new CANNON.Plane();
//     }

//     case 'SphereGeometry':
//     case 'SphereBufferGeometry': {
//       const { radius } = geometry.parameters;
//       return new CANNON.Sphere(radius);
//     }

//     case 'CylinderGeometry':
//     case 'CylinderBufferGeometry': {
//       const { radiusTop, radiusBottom, height, radialSegments } =
//         geometry.parameters;

//       return new CANNON.Cylinder(
//         radiusTop,
//         radiusBottom,
//         height,
//         radialSegments,
//       );
//     }

//     // Create a ConvexPolyhedron with the convex hull if
//     // it's none of these
//     default: {
//       // Simplify the geometry if it has too many points,
//       // make it have no more than MAX_VERTEX_COUNT vertices
//       const vertexCount = geometry.isBufferGeometry
//         ? geometry.attributes.position.count
//         : geometry.vertices.length;

//       const MAX_VERTEX_COUNT = 150;
//       const simplifiedGeometry = new SimplifyModifier().modify(
//         geometry,
//         Math.max(vertexCount - MAX_VERTEX_COUNT, 0),
//       );

//       const points = simplifiedGeometry.getAttribute('position');
//       const geometry = BufferGeometryUtils.mergeVertices(simplifiedGeometry);
//       console.log(geometry);
//       // Generate convex hull
//       // const hullGeometry = new ConvexGeometry(points);

//       // const vertices = points.map((v: any) => new CANNON.Vec3().copy(v));

//       // const faces = hullGeometry.faces.map((f) => [f.a, f.b, f.c]);
//       // const normals = hullGeometry.faces.map((f) =>
//       //   new CANNON.Vec3().copy(f.normal)
//       // );

//       // Construct polyhedron
//       const polyhedron = new CANNON.ConvexPolyhedron({
//         vertices,
//         // faces,
//         // normals,
//       });

//       return polyhedron;
//     }
//   }
// }

function createVertices(bufferGeometry: BufferGeometry) {
  const positionAttribute = bufferGeometry.attributes.position;

  const vertices = [];
  for (let i = 0; i < positionAttribute.count; i++) {
    let position = new Vector3().fromBufferAttribute(
      positionAttribute,
      i,
    );

    // modify position.x, position.y and position.z

    positionAttribute.setXYZ(i, position.x, position.y, position.z);
  }

  return vertices;
}

export function geometryToShape(bufferGeometry: BufferGeometry) {
  const vertexCount = bufferGeometry.attributes.position.count;

  const MAX_VERTEX_COUNT = 150;
  const simplifiedGeometry = new SimplifyModifier().modify(
    bufferGeometry,
    Math.max(vertexCount - MAX_VERTEX_COUNT, 0),
  );

  const points = simplifiedGeometry.getAttribute('position');
  const geometry = mergeVertices(simplifiedGeometry);
  console.log('GEOMETRY', geometry);
}
