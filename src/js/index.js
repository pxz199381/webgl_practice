import 'style/index.scss';
// const ImgSrc = require('../img/leaves.jpg');
import ImgSrc from 'img/leaves.jpg';


import GL from './_gl';


const Canvas = document.getElementById('canvas');

const Ctx_GL = Canvas.getContext('webgl');

if(!Ctx_GL){
  alert('webgl is not supportted');
}




const image = new Image()
image.src = ImgSrc
image.onload = function() {
  GL(Ctx_GL, image);
}

