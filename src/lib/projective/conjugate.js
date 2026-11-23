import { cross3, dot3, normalize, unitPolar } from './homogeneous.js';

const adjacent = (hexagon, construct) =>
  hexagon.map((entry, i) => construct(entry, hexagon[(i + 1) % 6]));
const opposite = (hexagon, construct) =>
  hexagon.slice(0, 3).map((entry, i) => construct(entry, hexagon[i + 3]));

function bestIntersection(objects) {
  let best = null;
  let maxSeparation = 0;
  objects.forEach((first, i) => {
    if (!first) return;
    for (const second of objects.slice(i + 1)) {
      const candidate = cross3(first, second);
      if (!candidate) continue;
      // 优先选夹角最开的两个齐次向量，减小接近重合时的舍入误差。
      const separation = 1 - dot3(first, second) ** 2;
      if (!best || separation > maxSeparation) {
        best = candidate;
        maxSeparation = separation;
      }
    }
  });
  return best;
}

export function polarHexagons(points) {
  const edges = adjacent(points, cross3);
  const polars = points.map(point => normalize(unitPolar(point)));
  const vertices = adjacent(polars, cross3);
  const intersections = opposite(edges, cross3);
  const diagonals = opposite(vertices, cross3);
  const axis = bestIntersection(intersections);
  const center = bestIntersection(diagonals);
  const collinear = axis && intersections.every(point => point && Math.abs(dot3(point, axis)) < 1e-8);
  const concurrent = center && diagonals.every(line => line && Math.abs(dot3(line, center)) < 1e-8);
  return { edges, polars, vertices, intersections, diagonals, axis, center, collinear, concurrent };
}

export const ellipsePoint = (a, b, t) => [a * Math.cos(t), b * Math.sin(t), 1];
