import { rad } from './trig'

export const regularPolygon = (n, r, angleOffset) => {
  let vertices = []
  for (let a = angleOffset; a < rad(360) + angleOffset; a += rad(360) / n) {
    vertices.push([Math.cos(a) * r, Math.sin(a) * r])
  }
  return vertices
}

export const scalePoint = (point, a) => point.map(v => v * a),
  scalePoints = (points, a) => points.map(point => scalePoint(point, a)),
  translatePoint = (points, a) => points.map(v => v + a),
  translatePoints = (points, a) => points.map(point => translatePoint(point, a)),
  polygonToSVGString = p => p.map(point => point.join(' ')).join(', ')
