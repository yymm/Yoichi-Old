// Animation
!function(window, document){

  var container = document.getElementById("mato-container")
  var canvas = document.getElementById('mato');
  var ctx = canvas.getContext('2d');

  queue = null,
  wait = 300;
   
  // ページロード時に初期化
  setCanvasSize();
   
  // リサイズ時にCanvasサイズを再設定 
  window.addEventListener("resize", function() {
  clearTimeout( queue );
  queue = setTimeout(function() {
  setCanvasSize();
  }, wait );
  }, false );
   
  // class: Circle
  var circle = function(ctx, color, max_rad, pos){
	this.ctx = ctx;
	this.color = color;
	this.max_rad = max_rad;
	this.pos = pos;
  };
  circle.prototype.draw = function(radius, color){
	this.ctx.beginPath();
	this.ctx.fillStyle = (color) ? color : this.color;
	this.ctx.arc(this.pos, this.pos, radius, 0, Math.PI*2, true);
	this.ctx.fill();
  };

  var mato, mato_pos, mato_rad, mato_rad_list, mato_color, mato_num, irad;

  function init_mato(){
    mato = null;
    mato_pos = (canvas.height < canvas.width) ? canvas.height / 2 : canvas.width / 2;
    mato_rad = (canvas.height < canvas.width) ? canvas.height / 2.1 : canvas.width / 2.1;
    mato_rad_list = [mato_rad, mato_rad/180*147,
      				 mato_rad/180*117, mato_rad/180*102,
      			   mato_rad/180*72 , mato_rad/180*36];
    mato_color = ['rgb(50, 50, 50)', 'rgb(225, 225, 225)'];
    mato_num = 0;
    irad = 0;
  }

  function setCanvasSize() {
    canvas.height = container.offsetHeight * 0.8;
    canvas.width = container.offsetWidth * 0.8;
	init_mato();
  }

  var animate_mato = function(){
	  if (!mato){
		  mato = new circle(ctx, mato_color[0], mato_rad, mato_pos);
	  }
	  if (irad >= mato.max_rad){
		  mato_num = mato_num + 1;
		  mato.max_rad = mato_rad_list[mato_num];
		  mato.color = mato_color[mato_num % 2];
		  irad = 0;
	  }
	  if (mato_num >= mato_rad_list.length){
		  return;
	  }
	  irad = irad + mato_rad / 50;
	  mato.draw(irad);
  }


  // Animate function use requestAnimationFrame
  function Animate(){
	  animate_mato();
	  requestAnimationFrame(Animate);
  }
  Animate();

  // requestAnimationFrame
  // @see http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  (function() {
	  var lastTime = 0;
	  var vendors = ['ms', 'moz', 'webkit', 'o'];
	  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		  window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		  window.cancelRequestAnimationFrame = window[vendors[x]+
			'CancelRequestAnimationFrame'];
	  }
  
	  if (!window.requestAnimationFrame)
		  window.requestAnimationFrame = function(callback, element) {
			  var currTime = new Date().getTime();
			  var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			  var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
				timeToCall);
			  lastTime = currTime + timeToCall;
			  return id;
		  };
  
	  if (!window.cancelAnimationFrame)
		  window.cancelAnimationFrame = function(id) {
			  clearTimeout(id);
		  };
  }())

}(window, document);
