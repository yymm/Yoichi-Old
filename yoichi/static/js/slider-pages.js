/*
 *
 * Vue.js
 *
 */

// Model
data = {
	hits: [
			[-1,9999,9999]
		],
	date: getDate(),
	user: 'hoge',
	team: 'hoge_team',
	matp_type: 'kasumi'
}
	
Vue.config({
	delimiters: ['[', ']']
})
Vue.component('slider-pages', {
	template: '#slider-pages-template',
	replace: true
})

// ViewModel
var vm = new Vue({
	el: '#slide-pages',
	data: data,
	methods: {
		tomark: function(){
			var len = this.hits.length-1;
			this.hits[len][0] = 1;
			var dom = document.getElementById('hit-' + len);
			dom.className = 'mark';
			vm.hits.push([-1,9999,9999]);
			return 1;
		},
		tocross: function(){
			this.hits[this.hits.length-1][0] = 0;
			return 0;
		},
		tobar: function(){
			this.hits[this.hits.length-1][0] = -1;
			return -1;
		}
	},
	filters: {
		tohit: function(int_val){
			if (int_val == -1) return 'bar';
			return (int_val == 0) ? 'cross' : 'mark';
		},
		number_of_hit: function(hits){
			return computeHits(hits, function(i, hit){
				return (hit == 1) ? true : false; 
			});
		},
		number_of_all: function(hits){
			return getLenHits(hits);
		},
		percent: function(hits){
			var hits_num = computeHits(hits, function(i, hit){
				return (hit == 1) ? true : false;
			});
			return calcPercent(hits_num, getLenHits(hits));
		},
		percent_first: function(hits){
			return (hits[0][0] == 1) ? 100 : 0;
		},
		percent_first_2: function(hits){
			var hits_num = computeHits(hits, function(i, hit){
				if (i % 2 != 0) return false; 
				return (hit == 1) ? true : false;
			});
			var deno = Math.ceil(getLenHits(hits)/2);
			return calcPercent(hits_num, deno);
		},
		percent_first_4: function(hits){
			var hits_num = computeHits(hits, function(i, hit){
				if (i % 4 != 0) return false; 
				return (hit == 1) ? true : false;
			});
			var deno = Math.ceil(getLenHits(hits)/4);
			return calcPercent(hits_num, deno);
		}
	}
})

/*

	helper function

*/

function getDate(){
	var date = new Date();
	return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay();
}
function calcPercent(num, all){
	if (all == 0) return 0;
	var p = num / all * 100;
	if (num % all == 0) return p;
	return p.toFixed(1);
}
function computeHits(hits, func){
	var count = 0;
	var len = getLenHits(hits);
	for (var i = 0; i < len; i = i + 1){
		if (func(i, hits[i][0])) count = count + 1;
	}
	return count;
}
function getLenHits(hits){
	var len = hits.length;
	return (hits[len-1][0] == -1) ? len-1 : len;
}
function computePointFromCenter(screen_x, screen_y){
	var point = {x: 9999, y: 9999};
	//var ;
	return point;
}
function getHitByInt(){
}

/*
 *
 * Event handler
 *
 */

// Page change icon event
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
}
function onHitBtnClk(dom){
	alert(dom.firstChild.id);
}
// swipe page change event
var mouse_x;
window.ontouchstart = function(e){
	mouse_x = e.changedTouches[0].clientX;
}
window.ontouchend = function(e){
	var move = mouse_x - e.changedTouches[0].clientX;
	if (Math.abs(move) > 50){
		var page1 = document.getElementById('page1');
		var page2 = document.getElementById('page2');
		var page3 = document.getElementById('page3');
		if (page1.checked){
			if (move > 0) {
				page1.checked = false;
				page2.checked = true;
			}
		}
		else if (page2.checked){
			if (move > 0) {
				page2.checked = false;
				page3.checked = true;
			}
			else{
				page2.checked = false;
				page1.checked = true;
			}
		}
		else{
			if (move < 0) {
				page3.checked = false;
				page2.checked = true;
			}
		}
	}
}

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
			setCanvasSize();
			draw();
		}, 300 );
	}, false );
	canvas.addEventListener('click', function(e){
		// 内外判定
		// 的中心からの座標に変換
		// Vueのdata更新
		// hitのDOM追加
		vm.tomark();
	});

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
	draw();

}(window, document);
