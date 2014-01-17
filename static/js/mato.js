window.onload = function()
{
  var canvas = document.getElementById("mato");
  var browser_width = GetBrowserWidth();
  var browser_height = GetBrowserHeight();
  canvas.width = browser_width;
  canvas.height = browser_height;
  DrawKasumiMato();
  //season_changer();
}

var DrawKasumiMato = function()
{
  var centerx = GetBrowserWidth() / 2;
  var centery = GetBrowserHeight() / 2;
  var radius = (centery > centery) ? centery*0.4 : centery*0.4;
  var rad0 = radius / 180 * 180;
  var rad1 = radius / 180 * 147;
  var rad2 = radius / 180 * 117;
  var rad3 = radius / 180 * 102;
  var rad4 = radius / 180 * 72;
  var rad5 = radius / 180 * 36;
  // 外側から180 : 147 : 117 : 102 : 72 : 36
  /* 外黒 */
  function draw0(ctx) {
	  ctx.beginPath();
	  ctx.fillStyle = 'rgb(50, 50, 50)';
	  ctx.arc(centerx, centery, rad0, 0, Math.PI*2, true);
	  ctx.fill();
  }
  /* 3の白 */
  function draw1(ctx) {
	  ctx.beginPath();
	  ctx.fillStyle = 'rgb(235, 235, 235)';
	  ctx.arc(centerx, centery, rad1, 0, Math.PI*2, true);
	  ctx.fill();
  }
  /* 2の黒 */
  function draw2(ctx) {
	  ctx.beginPath();
	  ctx.fillStyle = 'rgb(50, 50, 50)';
	  ctx.arc(centerx, centery, rad2, 0, Math.PI*2, true);
	  ctx.fill();
  }
  /* 2の白 */
  function draw3(ctx) {
	  ctx.beginPath();
	  ctx.fillStyle = 'rgb(235, 235, 235)';
	  ctx.arc(centerx, centery, rad3, 0, Math.PI*2, true);
	  ctx.fill();
  }
  /* 1の黒 */
  function draw4(ctx) {
	  ctx.beginPath();
	  ctx.fillStyle = 'rgb(50, 50, 50)';
	  ctx.arc(centerx, centery, rad4, 0, Math.PI*2, true);
	  ctx.fill();
}
  /* 中白 */
  function draw5(ctx) {
	  ctx.beginPath();
	  ctx.fillStyle = 'rgb(235, 235, 235)';
	  ctx.arc(centerx, centery, rad5, 0, Math.PI*2, true);
	  ctx.fill();
  }

  function draw()
  {
	  var canvas = document.getElementById('mato');
	  var ctx = canvas.getContext('2d');
	    draw0(ctx);
	    draw1(ctx);
	    draw2(ctx);
	    draw3(ctx);
	    draw4(ctx);
	    draw5(ctx);
  }
  return draw;
}();

function GetBrowserWidth() {
  if ( window.innerWidth ) {
    return window.innerWidth;
  }
  else if ( document.documentElement && document.documentElement.clientWidth != 0 ) {
    return document.documentElement.clientWidth;
  }
  else if ( document.body ) {
    return document.body.clientWidth;
  }
  return 0;
};

function GetBrowserHeight() {
  if ( window.innerHeight ) {
    return window.innerHeight;
  }
  else if ( document.documentElement && document.documentElement.clientHeight != 0 ) {
    return document.documentElement.clientHeight;
  }
  else if ( document.body ) {
    return document.body.clientHeight;
  }
  return 0;
};
