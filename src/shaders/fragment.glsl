precision mediump float;
uniform sampler2D u_image; // texture
uniform vec2 u_textureSize;

varying vec2 v_texCoord; // passed in from the vertex shader

void main(){
  // gl_FragColor = texture2D(u_image, v_texCoord).bgra;
  gl_FragColor = vec4(.0, .0, 1.0, 1.0);
  // 1像素对应的纹理坐标
  // vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;

  // 左中右像素求平均值
  // gl_FragColor = (
  //   texture2D(u_image, v_texCoord) +
  //   texture2D(u_image, v_texCoord + vec2(onePixel.x, 0.0)) +
  //   texture2D(u_image, v_texCoord + vec2(-onePixel.x, 0.0))
  // ) / 3.0;
}