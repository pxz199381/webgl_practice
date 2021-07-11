attribute vec2 a_position; // 顶点坐标（canvas坐标系）
// attribute float a_PointSize;
attribute vec2 a_texCoord; // 纹理坐标

uniform vec2 u_translation; // 位移坐标
uniform vec2 u_resolution;
uniform vec2 u_rotation;
uniform vec2 u_scale;

varying vec2 v_texCoord;

void main() {
  // vec2 translatedPos = vec2(
  //   a_position.x * u_rotation.y - a_position.y * u_rotation.x, 
  //   a_position.x * u_rotation.x + a_position.y * u_rotation.y);
  vec2 scalePos = a_position * u_scale;
  vec2 translatedPos = vec2(
  scalePos.x * u_rotation.y + scalePos.y * u_rotation.x,
  scalePos.y * u_rotation.y - scalePos.x * u_rotation.x);

  vec2 position = translatedPos + u_translation;
  vec2 zeroToOne = position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  // gl_PointSize = a_PointSize;
  // v_texCoord = a_texCoord;
}