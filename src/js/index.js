import 'style/index.scss';
// const ImgSrc = require('../img/leaves.jpg');
import ImgSrc from 'img/leaves.jpg';


import GL from './_gl';

// type ViewportObject = {
//   zoom:number;
//   center:number[];
// };
const CnavasSize = {
  width: 800,
  height: 600
};

const Canvas = document.getElementById('canvas');

const Ctx_GL = Canvas.getContext('webgl');

if(!Ctx_GL){
  alert('webgl is not supportted');
}




const image = new Image()
image.src = ImgSrc
// image.src = 'https://webglfundamentals.org/webgl/resources/leaves.jpg'
image.onload = function() {
  GL(Ctx_GL, image);
}

