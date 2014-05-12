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
	user: 'twitter id',
	name: 'hogehoge',
	team: 'hoge_team',
	mato_type: 'kasumi'
}
// Undo/Redo stack
var current = -1;
var stack = [];

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
		tomark: function(id, rx, ry){
			this.hits[id][0] = 1;
			var dom = document.getElementById('hit-' + id);
			dom.className = 'mark';
			this.pushHits(id, 1, rx, ry);
			return 1;
		},
		tocross: function(id, rx, ry){
			this.hits[id][0] = 0;
			var dom = document.getElementById('hit-' + id);
			dom.className = 'cross';
			this.pushHits(id, 0, rx, ry);
			return 0;
		},
		tobar: function(id){
			this.hits[id][0] = -1;
			var dom = document.getElementById('hit-' + id);
			dom.className = 'bar';
			this.pushHits(id, -1);
			return -1;
		},
		pushHits: function(id, hit, rx, ry, redo){
			var x = rx === undefined ? 9999 : rx;
			var y = ry === undefined ? 9999 : ry;
			if (this.hits[this.hits.length - 1][0] == -1){
				if (this.hits.length != 1){
					this.hits.pop();
				}
				this.hits.pop();
				this.hits.push([hit,x,y]);
				if (hit != -1){
					this.hits.push([-1,9999,9999]);
				}
			}
			else{
				this.hits.pop();
				this.hits.push([hit,x,y]);
				if (hit == 1 || hit == 0){
					if (this.hits.length - 1 == id){
						this.hits.push([-1,9999,9999]);
					}
				}
				else{
					if (this.hits.length - 2 == id){
						this.hits.pop();
					}
				}
			}
			drawMark();
			// Undo/Redo
			if (redo === undefined){
				stack = this.hits.slice(0);
				var dom = document.getElementById('redo');
				dom.style.opacity = '0.2';
				dom.style.color = '#222';
			}
			else{
				if (this.hits.length == stack.length){
					var dom = document.getElementById('redo');
					dom.style.opacity = '0.2';
					dom.style.color = '#222';
				}
			}
			if (this.hits.length != 1){
				var dom = document.getElementById('undo');
				dom.style.opacity = '0.8';
				dom.style.color = '#d16d16';
			}
			else{
				var dom = document.getElementById('undo');
				dom.style.opacity = '0.2';
				dom.style.color = '#222';
			}
		},
		// Undo/Redo
		pop: function(){
			this.hits.pop();
			this.hits.pop();
			this.hits.push([-1,9999,9999]);
			drawMark();
			current = this.hits.length - 2;
			if (this.hits.length <= 1){
				var dom = document.getElementById('undo');
				dom.style.opacity = '0.2';
				dom.style.color = '#222';
			}
			var dom = document.getElementById('redo');
			dom.style.opacity = '0.8';
			dom.style.color = '#d16d16';
		},
	},
	filters: {
		tohit: function(int_val){
			return getHitByInt(int_val);
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
		},
		toyear: function(date){
			return date.split('/')[0];
		},
		tomonth: function(date){
			return date.split('/')[1];
		},
		today: function(date){
			return date.split('/')[2];
		}
	}
})

/*

	helper function

*/

function getDate(){
	var date = new Date();
	return date.getFullYear() + '/' + (date.getMonth()+1).toString() + '/' + date.getDate();
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
function getHitByInt(int_val){
	if (int_val == -1) return 'bar';
	return (int_val == 0) ? 'cross' : 'mark';
}
function getIntByHit(hit_val){
	if (hit_val == 'bar') return -1;
	return (hit_val == 'cross') ? 0 : 1;
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
		page2.checked = true;
	}
	else if (page2.checked){
		page3.checked = true;
	}
	else{
		page1.checked = true;
	}
}
// swipe page change event
var mouse_x;
var mouse_y;
window.addEventListener('touchstart', function(e){
	mouse_x = e.changedTouches[0].clientX;
	mouse_y = e.changedTouches[0].clientY;
}, false)
window.addEventListener('touchmove', function(e){
	var move = mouse_x - e.changedTouches[0].clientX;
	var vertical_move = mouse_y - e.changedTouches[0].clientY;
	if(Math.abs(move) > 5){
		e.preventDefault();
	}
	if(Math.abs(move) > 50 && Math.abs(vertical_move) < 100){
		var scrollTop =
				document.documentElement.scrollTop ||
				document.body.scrollTop;
		if (scrollTop != 0){
			$('html, body').animate({scrollTop:0}, 'fast');
		}
	}
}, false)
window.addEventListener('touchend', function(e){
	var move = mouse_x - e.changedTouches[0].clientX;
	if (Math.abs(move) > 50){
		var page1 = document.getElementById('page1');
		var page2 = document.getElementById('page2');
		var page3 = document.getElementById('page3');
		if (page1.checked){
			if (move > 0) {
				page2.checked = true;
			}
		}
		else if (page2.checked){
			if (move > 0) {
				page3.checked = true;
			}
			else{
				page1.checked = true;
			}
		}
		else if (page3.checked){
			if (move > 0) {
				page4.checked = true;
			}
			else{
				page2.checked = true;
			}
		}
		else if (page4.checked){
			if (move > 0) {
				page5.checked = true;
			}
			else{
				page3.checked = true;
			}
		}
		else{
			if (move < 0) {
				page4.checked = true;
			}
		}
	}
}, false)
// button click  event
function onHitBtnClk(dom){
	var child = dom.firstChild; 
	var id = child.id.split('-')[1];
	var hit = child.className;
	if (id < vm.hits.length - 2) return;
	if (hit == 'bar'){
		vm.tomark(id);
	}
	else if(hit == 'cross'){
		vm.tobar(id);
	}
	else{
		vm.tocross(id);
	}
}
function onCloudBtnClk(dom){
	var dom = document.getElementById('upload-background');
	dom.style.backgroundColor = 'yellow';
	$('#upload-background')
		.animate({width: '35px'}, {duration: 500})
		.animate({height: '35px'}, {duration: 500})
		.animate({width: '30px'}, {duration: 500})
		.animate({backgroundColor: '#aaa'}, {duration: 1000})
		.animate({height: '30px'}, {duration: 1000});
	var str = '';
	str += 'Name: ' + vm.name + '\n';
	for (var i = 0; i < vm.hits.length - 1; ++i){
		str += '[' + (i+1).toString() + '] ';
		str += vm.hits[i][0].toString() + ' : (';
		str += vm.hits[i][1].toFixed(1).toString() + ', ';
		str += vm.hits[i][2].toFixed(1).toString() + ')' + '\n';
	}
	alert(str);
}
// Changed display element at rotate window
function rotateWindow(width, height){
	var main = document.getElementsByClassName('main');
	var mainlabel = document.getElementsByClassName('main-label');
	var sub = document.getElementsByClassName('sub');
	//alert(main);
	if (width > height){
		for (var i = 0; i < main.length; ++i){
			main[i].style.height = '30%';
			main[i].style.fontSize = '80%';
			mainlabel[i].style.display = 'none';
		}
		sub[2].style.display = 'none';
		sub[3].style.display = 'none';
		sub[0].style.height = '70%';
		sub[1].style.height = '70%';
	}
	else{
		for (var i = 0; i < main.length; ++i){
			main[i].style.height = '40%';
			main[i].style.fontSize = '100%';
			mainlabel[i].style.display = 'block';
		}
		sub[2].style.display = 'block';
		sub[3].style.display = 'block';
		sub[0].style.height = '30%';
		sub[1].style.height = '30%';
	}
}
// Draw mark(strictly add dom). Run every input timing(=> vm.pushHits).
var mato;
function drawMark(){
	var len = vm.hits.length;
	var r = mato.rad;
	var cx = mato.pos_x;
	var cy = mato.pos_y;

	// clear DOM: id = container
	var prnt = document.getElementById('container');
	var nodes_num = prnt.childNodes.length;
	for (var i = 0; i < nodes_num; ++i){
		child = prnt.lastChild;
		if (child.className == 'circle-num'){
			prnt.removeChild(child);
		}
	}

	for (var i = 0; i < len - 1; ++i){
		var x = vm.hits[i][1] * r / 100 + cx;
		var y = vm.hits[i][2] * r / 100 + cy;
		addHitDOM(i, x, y, vm.hits[i][0]);
	}
}
// Add hit DOM
function addHitDOM(i, x, y, hit){
	var dom = document.createElement('div');
	var child = document.createElement('span');
	dom.setAttribute('style', 'position:absolute; top:' + y.toString() + 'px; left:' + x.toString() + 'px; z-index: 1;');
	dom.setAttribute('class', 'circle-num');
	dom.setAttribute('id', 'mark-' + (i+1).toString());
	if (hit == 0){
		child.setAttribute('class', 'unhit-mark');
	}
	else{
		child.setAttribute('class', 'hit-mark');
	}
	child.textContent = (i+1);
	dom.appendChild(child);
	var prnt = document.getElementById('container');
	prnt.appendChild(dom);
}

/*
 *
 * Undo/Redo
 *
 */

function onUndoBtnClk(dom){
	if (vm.hits.length <= 1) return;
	vm.pop();
}
function onRedoBtnClk(dom){
	if (vm.hits.length == stack.length) return;
	current++;
	var id = current;
	vm.hits[id] = stack[id][0];
	vm.pushHits(vm.hits.length-1, stack[id][0], stack[id][1], stack[id][2], 'redo');
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
			draw(); // この関数があるからこの場所にあることをお忘れなく
			drawMark();
			rotateWindow(canvas.width, canvas.height);
		}, 300 );
	}, false );
	canvas.addEventListener('click', function(e){
		// スクロール時と横端へのDOM追加禁止
		if (window.scrollY > 0 || e.pageX > canvas.width - 10 || e.pageX < 10){
			return;
		}
		// 内外判定
		var hit = 0;
		var r = mato.rad;
		var x = e.pageX;
		var y = e.pageY;
		var cx = mato.pos_x;
		var cy = mato.pos_y;
		if ((x-cx)*(x-cx)+(y-cy)*(y-cy) <= r*r){
			hit = 1;
		}
		// 的中心からの座標に変換
		var rx = (x - cx) / r * 100;
		var ry = (y - cy) / r * 100;
		// Vueのdata更新
		if (hit == 1){
			vm.tomark(vm.hits.length-1, rx, ry);
		}
		else{
			vm.tocross(vm.hits.length-1, rx, ry);
		}
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

	mato = new Mato(canvas.width, canvas.height);
	function draw(){
		mato.draw(canvas.width, canvas.height);
	};
	draw();

}(window, document);
