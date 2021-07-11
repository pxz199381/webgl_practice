import * as VertexShaderSource from 'shaders/vertex.glsl';
import * as FragmentShaderSource from 'shaders/fragment.glsl';

/**
 * 创建shader
 */
export function createShader(gl:WebGLRenderingContext,type:number,source:string):WebGLShader{
  const Shader:WebGLShader = gl.createShader(type);
  gl.shaderSource(Shader,source);
  gl.compileShader(Shader);
  if(gl.getShaderParameter(Shader, gl.COMPILE_STATUS)){
    return Shader;
  }
}
/**
 * 创建program
 */
export function createProgram(gl:WebGLRenderingContext,vertexShader:WebGLShader,fragmentShader:WebGLShader):WebGLProgram{
  const Program:WebGLProgram = gl.createProgram();
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
function resizeCanvas(gl:WebGLRenderingContext) {
  const RealToCSSPixels:number = window.devicePixelRatio;

  // 获取浏览器显示的画布的CSS像素值
  // 然后计算出设备像素设置drawingbuffer
  const DisplayWidth:number  = Math.floor(gl.canvas.clientWidth  * RealToCSSPixels);
  const DisplayHeight:number = Math.floor(gl.canvas.clientHeight * RealToCSSPixels);

  // 检查画布尺寸是否相同
  if (gl.canvas.width  !== DisplayWidth ||gl.canvas.height !== DisplayHeight) {

    // 设置为相同的尺寸
    gl.canvas.width  = DisplayWidth;
    gl.canvas.height = DisplayHeight;
  }
}

export default function(gl:WebGLRenderingContext, data?:number[]){
  // 创建顶点着色器
  const VertexShader:WebGLShader = createShader(gl,gl.VERTEX_SHADER,VertexShaderSource);
  // 创建片段着色器
  const FragmentShader:WebGLShader = createShader(gl,gl.FRAGMENT_SHADER,FragmentShaderSource);  
  // 创建着色程序
  const Program:WebGLProgram = createProgram(gl,VertexShader,FragmentShader);
  // 获取顶点属性的指针
  // const a_Position = gl.getAttribLocation(Program, 'a_Position');
  const a_PointSize = gl.getAttribLocation(Program, 'a_PointSize');
  // const Location_attr_position:number = gl.getAttribLocation(Program,'a_position');
  // 获取全局变量的指针
  const u_FragColor = gl.getUniformLocation(Program, 'u_FragColor');
  // const Location_uni_resolution:WebGLUniformLocation = gl.getUniformLocation(Program,'u_resolution');

  // 创建缓冲区
  // const Buffer_postion:WebGLBuffer = gl.createBuffer(); 
  // 绑定缓冲区指针
  // gl.bindBuffer(gl.ARRAY_BUFFER,Buffer_postion);
  // 将顶点数据写入缓冲区
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  resizeCanvas(gl);
  // 设置视图区域
  gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
  
  // 使用着色程序
  gl.useProgram(Program);
  // 设置全局变量值
  // gl.uniform2f(Location_uni_resolution,gl.canvas.width,gl.canvas.height);
  // 启用缓冲区
  // gl.enableVertexAttribArray(Location_attr_position);
  // 设置缓冲区读取规则
  // gl.vertexAttribPointer(Location_attr_position, 2, gl.FLOAT, false, 0, 0);
  // 将顶点位置传输给attribute变量
  // gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0)
  // const position = new Float32Array([0.0, 1.0, 0.0, 1.0])
  // gl.vertexAttrib3fv(a_Position, position)

  gl.vertexAttrib1f(a_PointSize, 20.0)

  gl.uniform4f(u_FragColor, .0, 1.0, 1.0, 1.0)

  const n = initVertexBuffers(gl)

  gl.clearColor(.0, .0, .0, .0)
  gl.clear(gl.COLOR_BUFFER_BIT)

  // 第二个参数为从第几个顶点开始绘制 第三个制定了绘制需要用到多少个顶点
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n) 

  function initVertexBuffers(gl) {      
    const vertices = new Float32Array([
      // -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5
      -0.5,0.5, -0.5,-0.5, 0.5,0.5, 0.5,-0.5 
    ])
         
    const n = vertices.length / 2
    // 创建缓冲区对象
    const vertexBuffer = gl.createBuffer()
    if (!vertexBuffer) {
      return -1
    }
    //将缓冲区对象绑定到目标对象
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    // 向缓冲区对象写入数据
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    const a_Position = gl.getAttribLocation(Program, 'a_Position')

    // 将缓冲区对象分配给a_Position对象 第二个参数为指定缓冲区中每个顶点的分量个数(1 ~4)  若小于4则前三位自动补0，最后一位补1
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)

    // 连接a_Position变量与分配给它的缓冲区对象
    gl.enableVertexAttribArray(a_Position)

    return n
  }

}

