// Animation
!function(window, document){
	var container = document.getElementById("mato-container")
	var canvas = document.getElementById('mato');
	var ctx = canvas.getContext('2d');
	
	// ページロード時に初期化
	setCanvasSize();
	 
	queue = null,
	wait = 300;
	 
	// リサイズ時にCanvasサイズを再設定 
	window.addEventListener("resize", function() {
		clearTimeout( queue );
		queue = setTimeout(function() {
			setCanvasSize();
			drawMato();
		}, wait );
	}, false );
	 
	// class: Circle
	var circle = function(ctx, color, max_rad, x, y){
		this.ctx = ctx;
		this.color = color;
		this.max_rad = max_rad;
		this.pos_x = x;
		this.pos_y = y;
	};
	circle.prototype.draw = function(radius, color){
		this.ctx.beginPath();
		this.ctx.fillStyle = (color) ? color : this.color;
		this.ctx.arc(this.pos_x, this.pos_y, radius, 0, Math.PI*2, true);
		this.ctx.fill();
	};
	
	var mato, mato_pos_x, mato_pos_y, mato_rad, mato_rad_list, mato_color;
	
	function init_mato(){
		mato = null;
		mato_pos_x = canvas.width / 2;
		mato_pos_y = canvas.height / 2;
		mato_rad = (canvas.height < canvas.width) ? canvas.height / 4 : canvas.width / 4;
		mato_rad_list = [mato_rad, mato_rad/180*147, mato_rad/180*117, mato_rad/180*102, mato_rad/180*72, mato_rad/180*36];
		mato_color = ['rgb(50, 50, 50)', 'rgb(225, 225, 225)'];
	}
	
	function setCanvasSize() {
	  canvas.height = container.offsetHeight;
	  canvas.width = container.offsetWidth;
	  init_mato();
	}
	function drawMato()
	{
		mato = new circle(ctx, mato_color[0], mato_rad, mato_pos_x, mato_pos_y);
		for (i = 0; i < 6; i = i + 1)
		{
			mato.color = mato_color[i % 2];
			mato.draw(mato_rad_list[i]);
		}
	}
	drawMato();
}(window, document);
