attribute vec4 a_Position;
attribute float a_PointSize;
// attribte vec2 a_texCoord;

// uniform vec2 u_resolution;

// varying vec2 v_texCoord;

void main() {
  gl_Position = a_Position;
  gl_PointSize = a_PointSize;
}