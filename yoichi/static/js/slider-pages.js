/*
 *
 * Vue.js
 *
 */
Vue.config({
	delimiters: ['[', ']']
})
Vue.component('slider-pages', {
	template: '#slider-pages-template',
	replace: true
})
new Vue({
	el: '#slide-pages',
	data: {
		date: getDate()}
})

function getDate(){
	var date = new Date();
	return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay();
}

/*
 *
 * Event handler
 *
 */

document.getElementById('change-page').onclick = function(){
	var page1 = document.getElementById('page1');
	var page2 = document.getElementById('page2');
	var page3 = document.getElementById('page3');
	if (page1.checked){
		page1.checked = false;
		page2.checked = true;
	}
	else if (page2.checked){
		page2.checked = false;
		page3.checked = true;
	}
	else{
		page3.checked = false;
		page1.checked = true;
	}
};

/*
 *
 * Canvas element
 *
 */

!function(window, document){
	var container = document.getElementById("container")
	var canvas = document.getElementById('mato');
	var ctx = canvas.getContext('2d');
	setCanvasSize();	// fit canvas element to container
	function setCanvasSize() {
		canvas.height = container.offsetHeight;
		canvas.width = container.offsetWidth;
	}
	
	/*
	 *
	 * Canvas event handler
	 *
	 */

	window.addEventListener("resize", function() {
		clearTimeout(null);
		queue = setTimeout(function() {
			// 画面縦横回転時のみリサイズ
			if (canvas.height > canvas.width){
				if (container.offsetWidth < container.offsetHeight) return;
			}
			else{
				if (container.offsetWidth > container.offsetHeight) return;
			}
			setCanvasSize();
			draw();
		}, 300 );
	}, false );

	/*
	 *
	 * Defined class
	 *
	 */

	/**
	 * class: Circle
	 */
	var Circle = function(ctx, color, max_rad, x, y){
		this.ctx = ctx;
		this.color = color;
		this.max_rad = max_rad;
		this.pos_x = x;
		this.pos_y = y;
	};
	Circle.prototype.draw = function(radius, color){
		this.ctx.beginPath();
		this.ctx.fillStyle = (color) ? color : this.color;
		this.ctx.arc(this.pos_x, this.pos_y, radius, 0, Math.PI*2, true);
		this.ctx.fill();
	};
	/**
	 * class Mato
	 */
	var Mato = function(box_width, box_height, mato_type){
		this.setSize(box_width, box_height);
		this.setMatoType(mato_type);
		this.color = ['rgb(50, 50, 50)', 'rgb(225, 225, 225)'];
	};
	Mato.prototype.draw = function(box_width, box_height){
		if (box_width && box_height){
			this.setSize(box_width, box_height);
		}
		var circle = new Circle(ctx, this.color[0], this.rad, this.pos_x, this.pos_y);
		var len = this.rad_list.length;
		for (i = 0; i < len; i = i + 1) {
			circle.draw(this.rad_list[i], this.color[i%2]);
		}
		delete circle;
	};
	Mato.prototype.setMatoType = function(mato_type){
		if (mato_type == 'hoshi') {
			this.rad_list = [this.rad, this.rad-0.5, this.rad/3];
		}
		else {
			this.rad_list = [this.rad, this.rad/180*147, this.rad/180*117, this.rad/180*102, this.rad/180*72, this.rad/180*36];
		}
	};
	Mato.prototype.setSize = function(box_width, box_height){
		this.pos_x = box_width / 2;
		this.pos_y = box_height / 2;
		this.rad = (box_height < box_width) ? box_height / 3 : box_width / 3;
		this.setMatoType();
	};
	

	/*
	 *
	 * Draw canvas
	 *
	 */

	var mato = new Mato(canvas.width, canvas.height);

	function draw(){
		mato.draw(canvas.width, canvas.height);
	};
	draw()

}(window, document);
