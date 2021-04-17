export const regularPolygon = (n, r) => {
  let vertices = []
  for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / n) {
    vertices.push([Math.round(Math.cos(a) * r), Math.round(Math.sin(a) * r)])
  }
  return vertices
}

export const scalePoint = (point, a) => point.map(v => v * a),
  scalePoints = (points, a) => points.map(point => scalePoint(point, a)),
  translatePoint = (points, a) => points.map(v => v + a),
  translatePoints = (points, a) => points.map(point => translatePoint(point, a)),
  polygonToSVGString = p => p.map(point => point.join(' ')).join(', ')
