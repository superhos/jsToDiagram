var extend = function() {
　　/*
　　*target被扩展的对象
　　*length参数的数量
　　*deep是否深度操作
　　*/
　　var options, name, src, copy, copyIsArray, clone,
　　　　target = arguments[0] || {},
　　　　i = 1,
　　　　length = arguments.length,
　　　　deep = false;

　　// target为第一个参数，如果第一个参数是Boolean类型的值，则把target赋值给deep
　　// deep表示是否进行深层面的复制，当为true时，进行深度复制，否则只进行第一层扩展
　　// 然后把第二个参数赋值给target
　　if ( typeof target === "boolean" ) {
　　　　deep = target;
　　　　target = arguments[1] || {};

　　　　// 将i赋值为2，跳过前两个参数
　　　　i = 2;
　　}

　　// target既不是对象也不是函数则把target设置为空对象。
　　if ( typeof target !== "object" && typeof target !== "function" ) {
　　　　target = {};
　　}

　　// 如果只有一个参数，则把jQuery对象赋值给target，即扩展到jQuery对象上
　　if ( length === i ) {
　　　　target = this;

　　　　// i减1，指向被扩展对象
　　　　--i;
　　}

　　// 开始遍历需要被扩展到target上的参数

　　for ( ; i < length; i++ ) {
　　　　// 处理第i个被扩展的对象，即除去deep和target之外的对象
　　　　if ( (options = arguments[ i ]) != null ) {
　　　　　　// 遍历第i个对象的所有可遍历的属性
　　　　　　for ( name in options ) {
　　　　　　　　// 根据被扩展对象的键获得目标对象相应值，并赋值给src
　　　　　　　　src = target[ name ];
　　　　　　　　// 得到被扩展对象的值
　　　　　　　　copy = options[ name ];

　　　　　　　　// 这里为什么是比较target和copy？不应该是比较src和copy吗？
　　　　　　　　if ( target === copy ) {
　　　　　　　　　　continue;
　　　　　　　　}

　　　　　　　　if ( copy !== undefined ) {
　　　　　　　　　　target[ name ] = copy;
　　　　　　　　}
　　　　　　}
　　　　}
　　}

　　// 原对象被改变，因此如果不想改变原对象，target可传入{}
　　return target;
};

var extendClass = function(Parent,Child){
	Child.prototype = Object.create(Parent.prototype);   //修改
    Child.prototype.constructor = Child;
}

//to 相对于 from 的位置
var direction = function (from,to){
		var cx = to.x + to.width/2;
		var cy = to.y + to.height/2;
		var fcx = from.x + from.width/2;
		var fcy = from.y + from.height/2;
		if (cy < fcy && cx < fcx)return 'leftTop';
		if (cy < fcy && cx == fcx)return 'Top';
		if (cy < fcy && cx > fcx)return 'rightTop';
		if (cy > fcy && cx < fcx)return 'leftBottom';
		if (cy > fcy && cx == fcx)return 'Bottom';
		if (cy > fcy && cx > fcx)return 'rightBottom';
		if (cy == fcy && cx > fcx)return 'Right';
		if (cy == fcy && cx < fcx)return 'Left';
}

var Queue = function () {
    var items = [];
    this.enqueue = function(element){
        items.push(element);
    }

    this.dequeue = function(){
        return items.shift();
    }

    this.front = function(){
        return items[0];
    }

    this.isEmpty = function(){
        return items.length == 0;
    }

    this.clear = function(){
        items = [];
    }

    this.size = function(){
        return items.length;
    }

    this.print = function(){
        console.log(items.toString());
    }
}

var roundPloyin = function (ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }

  //求四个顶点位置
  var v1 = {x:x, y:y + height/2};
  var v2 = {x:x+width/2,y:y};
  var v3 = {x:x+width,y:y+height/2};
  var v4 = {x:x+width/2,y:y+height};
  
  ctx.beginPath();
  ctx.moveTo(v1.x + radius.tl,v1.y + radius.tl);
  ctx.quadraticCurveTo(v1.x,v1.y,v1.x+radius.tl,v1.y-radius.tl);
  ctx.moveTo(v1.x+radius.tl,v1.y-radius.tl);
  ctx.lineTo(v2.x - radius.tr,v2.y + radius.tr);
  ctx.quadraticCurveTo(v2.x,v2.y,v2.x+radius.tr,v2.y+radius.tr);
  ctx.moveTo(v2.x+radius.tr,v2.y+radius.tr);
  ctx.lineTo(v3.x - radius.br,v3.y - radius.br);
  ctx.quadraticCurveTo(v3.x,v3.y,v3.x-radius.br,v3.y+radius.br);
  ctx.moveTo(v3.x-radius.br,v3.y+radius.br);
  ctx.lineTo(v4.x + radius.bl,v4.y - radius.bl);
  ctx.quadraticCurveTo(v4.x,v4.y,v4.x-radius.bl,v4.y-radius.bl);
  ctx.moveTo(v4.x-radius.bl,v4.y-radius.bl);
  ctx.lineTo(v1.x + radius.tl,v1.y + radius.tl);
  ctx.closePath();
  
//ctx.beginPath();
//ctx.moveTo(x + radius.tl, y);
//ctx.lineTo(x + width - radius.tr, y);
//ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
//ctx.lineTo(x + width, y + height - radius.br);
//ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
//ctx.lineTo(x + radius.bl, y + height);
//ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
//ctx.lineTo(x, y + radius.tl);
//ctx.quadraticCurveTo(x, y, x + radius.tl, y);
//ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}

var roundRect = function (ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}

var firstUpper = function(str){
	return str[0].toUpperCase() + str.substring(1);
}

module.exports = {
	extend,direction,Queue,roundRect,firstUpper,extendClass,roundPloyin
}
