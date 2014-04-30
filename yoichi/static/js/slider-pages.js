/*
 *
 * Vue.js
 *
 */

// Model
data = {
	hits: [
			[-1,-1,-1,-1]
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
	filters: {
		tomark: function(int_val){
			if (int_val == -1) return '-';
			return (int_val == 0) ? 'x' : 'o';
		},
		number_of_hit: function(hits){
			return getSomethingToHits(hits, function(hit){
				return (hit==1) ? true : false;
			});

		},
		number_of_all: function(hits){
			return getSomethingToHits(hits, function(hit){
				return (hit>=0) ? true : false;
			});
		},
		percent: function(hits){
			var all = getSomethingToHits(hits, function(hit){
				return (hit>=0) ? true : false;
			});
			var hit_num = getSomethingToHits(hits, function(hit){
				return (hit==1) ? true : false;
			});
			return calcPercent(hit_num, all);
		},
		percent_first: function(hits){
			if (hits[0][0] < 0) return 0;
			return hits[0][0] == 0 ? 0 : 100;
		},
		percent_first_2: function(hits){
			var all = 0;
			var hit_num = 0;
			var len = hits.length;
			for (var i = 0; i < len; i = i + 1){
				if(hits[i][0] >= 0) all = all + 1;
				if(hits[i][0] > 0) hit_num = hit_num + 1;
				if(hits[i][2] >= 0) all = all + 1;
				if(hits[i][2] > 0) hit_num = hit_num + 1;
			}
			return calcPercent(hit_num, all);
		},
		percent_first_4: function(hits){
			var all = 0;
			var hit_num = 0;
			var len = hits.length;
			for (var i = 0; i < len; i = i + 1){
				if(hits[i][0] >= 0) all = all + 1;
				if(hits[i][0] > 0) hit_num = hit_num + 1;
			}
			return calcPercent(hit_num, all);
		}
	}
})

function getDate(){
	var date = new Date();
	return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDay();
}

function getSomethingToHits(hits, func){
	var count = 0;
	var len = hits.length;
	for (var i = 0; i < len; i = i + 1){
		for (var j = 0; j < 4; j = j + 1){
			if(func(hits[i][j])) count = count + 1;
		}
	}
	return count;
}
function calcPercent(num, all){
	if (all == 0) return 0;
	var p = num / all * 100;
	if (num % all == 0) return p;
	return p.toFixed(1);
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
