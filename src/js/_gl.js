import VertexShaderSource from 'shaders/vertex.glsl';
import FragmentShaderSource from 'shaders/fragment.glsl';

/**
 * 创建shader
 */
export function createShader(gl,type,source){
  const Shader = gl.createShader(type);
  gl.shaderSource(Shader,source);
  gl.compileShader(Shader);
  if(gl.getShaderParameter(Shader, gl.COMPILE_STATUS)){
    return Shader;
  }
}
/**
 * 创建program
 */
export function createProgram(gl,vertexShader,fragmentShader){
  const Program = gl.createProgram();
  
  gl.attachShader(Program,vertexShader);
  gl.attachShader(Program,fragmentShader);
  gl.linkProgram(Program);
  if(gl.getProgramParameter(Program,gl.LINK_STATUS)){
    return Program;
  }
}
/**
 * 设置canvas像素和尺寸
 */
function resizeCanvas(gl) {
  const RealToCSSPixels = window.devicePixelRatio;

  // 获取浏览器显示的画布的CSS像素值
  // 然后计算出设备像素设置drawingbuffer
  const DisplayWidth  = Math.floor(gl.canvas.clientWidth  * RealToCSSPixels);
  const DisplayHeight = Math.floor(gl.canvas.clientHeight * RealToCSSPixels);

  // 检查画布尺寸是否相同
  if (gl.canvas.width  !== DisplayWidth ||gl.canvas.height !== DisplayHeight) {

    // 设置为相同的尺寸
    gl.canvas.width  = DisplayWidth;
    gl.canvas.height = DisplayHeight;
  }
}

export default function (gl, image){
  let translation = [0, 0]
  let rotation = [0, 1]
  let scale = [1, 1]
  let width = 100;
  let height = 30;
  // 创建顶点着色器
  const VertexShader = createShader(gl,gl.VERTEX_SHADER,VertexShaderSource);
  // 创建片段着色器
  const FragmentShader = createShader(gl,gl.FRAGMENT_SHADER,FragmentShaderSource);  
  // 创建着色程序
  const Program = createProgram(gl,VertexShader,FragmentShader);
  // 获取顶点属性的指针
  const a_position = gl.getAttribLocation(Program, 'a_position');
  const a_texCoord = gl.getAttribLocation(Program, 'a_texCoord');
  
  const u_translation = gl.getUniformLocation(Program, 'u_translation')
  const u_resolution = gl.getUniformLocation(Program, "u_resolution");
  const u_textureSize = gl.getUniformLocation(Program, "u_textureSize");
  const u_rotation = gl.getUniformLocation(Program, "u_rotation");
  const u_scale = gl.getUniformLocation(Program, "u_scale");

  // 纹理坐标 (webgl坐标系)
  // const a_texCoordPoints = new Float32Array([
  //   0.0, 0.0,
  //   1.0, 0.0,
  //   0.0, 1.0,
  //   0.0, 1.0,
  //   1.0, 0.0,
  //   1.0, 1.0,
  // ])
  // const texBuffer = createBuffer(gl, a_texCoordPoints)

  // createTexture(gl)
  // setVertexPointer(gl, texBuffer, a_texCoord)

  // 顶点坐标（canvas坐标系）
  let a_PositionPoints = new Float32Array([
    0, 0,
    30, 0,
    0, 150,
    0, 150,
    30, 0,
    30, 150,

    // 上横
    30, 0,
    100, 0,
    30, 30,
    30, 30,
    100, 0,
    100, 30,

    // 中横
    30, 60,
    67, 60,
    30, 90,
    30, 90,
    67, 60,
    67, 90,
  ])
  // a_PositionPoints = a_PositionPoints.map(p => p + 200)
  const positionBuffer = createBuffer(gl, a_PositionPoints)

  renderVertex()

  webglLessonsUI.setupSlider("#x", { slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", { slide: updatePosition(1), max: gl.canvas.height });
  webglLessonsUI.setupSlider("#angle", { slide: updateAngle, max: 360 });
  webglLessonsUI.setupSlider("#scaleX", { value: scale[0], slide: updateScale(0), min: -5, max: 5, step: 0.01, precision: 2 });
  webglLessonsUI.setupSlider("#scaleY", { value: scale[1], slide: updateScale(1), min: -5, max: 5, step: 0.01, precision: 2 });

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value
      renderVertex()
    }
  }

  function updateAngle(event, ui) {
      const degrees = ui.value
      const radians = degrees * Math.PI / 180
      rotation = [Math.sin(radians), Math.cos(radians)]
      renderVertex()
  }

  function updateScale(index) {
    return function (event, ui) {
      scale[index] = ui.value
      renderVertex()
    }
  }

  function renderVertex() {

    resizeCanvas(gl);
    // 设置视图区域
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // 使用着色程序
    gl.clearColor(.0, .0, .0, .0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(Program);

    // const a_PositionPoints = new Float32Array(createCanvasRectPoints(image, translation[0], translation[1], width, height))

    // gl.bufferData(gl.ARRAY_BUFFER, a_PositionPoints, gl.STATIC_DRAW)
    
    // gl.uniform2f(u_textureSize, image.width, image.height)
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    setVertexPointer(gl, positionBuffer, a_position)
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height)
    gl.uniform2fv(u_translation, translation)
    gl.uniform2fv(u_rotation, rotation)
    gl.uniform2fv(u_scale, scale)

    gl.drawArrays(gl.TRIANGLES, 0, 18)
  }
}

function createTexture(gl) {
  // Create a texture.
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the parameters so we can render any size image.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

  return texture
  // Upload the image into the texture.
}

// 第二个参数为从第几个顶点开始绘制 第三个制定了绘制需要用到多少个顶点
// gl.drawArrays(gl.TRIANGLE_STRIP, 0, n) 
function createBuffer(gl, points) {
  const bufferName = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferName)
  points && gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)
  return bufferName
}

function setVertexPointer(gl,
  bufferName,
  attribPointer,
  {
    size = 2,
    type = gl.FLOAT,
    normalize = false,
    stride = 0,
    offset = 0,
  } = {}) {
  gl.enableVertexAttribArray(attribPointer)
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferName)

  gl.vertexAttribPointer(attribPointer, size, type, normalize, stride, offset)
}

function createCanvasRectPoints(image, x = 0, y = 0) {
  const x1 = x;
  const x2 = x + image.width;
  const y1 = y;
  const y2 = y + image.height;
  return [
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]
}

