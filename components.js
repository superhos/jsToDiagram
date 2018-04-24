import {extend,direction,roundRect,extendClass,roundPloyin} from './utils'
/**
 * 组件
 */
function Block (setting,text){
	this.setting = setting;
	this.text = text?text:'';
	this.line = Math.floor(this.text.length / this.setting.lineAmount) + 1;
	this.components = [];
	this.lines = [];
	this.width = 20;
	this.height = 20;
	this.col = 0;
	this.row = 0;
	this.x = 0;
	this.y = 0;
	this.bottomLineAmount = 0;
	this.topLineAmount = 0;
	this.leftLineAmount = 0;
	this.rightLineAmount = 0;
	this.points = {
		'top':[],
		'bottom':[],
		'left':[],
		'right':[]
	}
}

Block.prototype = {
	doubleLink (to,text){
		this.link('double',this,to,text);
//		to.link(to,this,text);
	},
	singleLink(to,text){
		this.link('single',this,to,text);
	},
	judge (judge,success,fail){
		this.link('single',this, judge);
		judge.setSuccess(success);
		judge.setFail(fail);
	},
	link (type,from,to,text){
		var line = new Line(this.setting,from,to,text,type);
		this.lines.push(line);
		return this;
	},
	//重新计算大小
	reload (ctx){
		this.width = ctx.measureText(this.text.substr(0,this.setting.lineAmount)).width + this.setting.padding[1] + this.setting.padding[3];
		this.height = this.line * this.setting.fontSize  + this.setting.padding[0] + this.setting.padding[2];
	},
	render (ctx,x,y){
//		this.reload(ctx);
		this.x = x;
		this.y = y;
		
		var w = this.width;
		var h = this.height;
		
//		ctx.beginPath();
		ctx.strokeStyle = this.setting.theme.blockStroke;
		ctx.fillStyle = this.setting.theme.blockFill;
//		ctx.roundRect(10,x,y,w,h);  // x轴 y轴 宽 和 高 ,绘制“被填充”的矩形
		roundRect(ctx,x,y,w,h,10)
		ctx.fill();
		ctx.stroke();
		
		//加入字体
		if (this.text.length > 0){
			this.drawText(ctx,x,y,w,h);
		}
		ctx.closePath();
		
		return this;
	},
	drawText (ctx,x,y,w,h){
		ctx.fillStyle = this.setting.theme.blockTextColor;
		var tWidth = ctx.measureText(this.text.substr(0,this.setting.lineAmount)).width;
		var tHeight = this.line * this.setting.fontSize;
		var textX = x + (w - tWidth)/2;
		var textY = y + (h - tHeight)/2 + this.setting.fontSize/2;
		for (var i=0;i<this.line;i++){
			textX = x + (w - ctx.measureText(this.text.substr(i*this.setting.lineAmount,this.setting.lineAmount)).width)/2;
			ctx.fillText(this.text.substr(i*this.setting.lineAmount,this.setting.lineAmount),textX,textY);
			textY += this.setting.fontSize;
		}
	},
	renderLine (ctx){
		if (this.setting.showPoint){
			for (var j in this.points){
				for (var i in this.points[j]){
					ctx.beginPath();
					ctx.arc(this.points[j][i].x,this.points[j][i].y,5,0,360,false);
					ctx.fillStyle="red";//填充颜色,默认是黑色
					ctx.fill();//画实心圆
					ctx.closePath();
				}
			}
		}
		//判断目标块的中点位置与自己的中点位置
		for (var i in this.lines){
			let line = this.lines[i];
			let direc = direction(line.from,line.to);
			ctx.beginPath();
			let cx,cy,tx,ty;
			var freePoint = this.getFreePoint('leftToRight',direc.toLowerCase());
//			if (typeof freePoint === 'undefined')continue;
			freePoint.isUse = true;
			switch (direc){
				case 'Top':
					//目标在自己上方，先移动到自己顶部的中点
					var targetFreePoint = line.to.getFreePoint('leftToRight','bottom');
					break;
				case 'Bottom':
					var targetFreePoint = line.to.getFreePoint('leftToRight','top');
					break;
				case 'Right':
					var targetFreePoint = line.to.getFreePoint('leftToRight','left');
					break;
				case 'Left':
					var targetFreePoint = line.to.getFreePoint('leftToRight','right');
					break;
				case 'leftTop':
					var targetFreePoint = line.to.getFreePoint('rightToLeft','right');
					break;
				case 'leftBottom':
					var targetFreePoint = line.to.getFreePoint('leftToRight','right');
					break;
				case 'rightBottom':
					var targetFreePoint = line.to.getFreePoint('rightToLeft','top');
					break;
				case 'rightTop':
					var targetFreePoint = line.to.getFreePoint('leftToRight','bottom');
					break;
			}
//			if (typeof targetFreePoint === 'undefined')continue;
			targetFreePoint.isUse = true;
			line.drawLine(ctx,freePoint,targetFreePoint,30,10,this.setting.theme.lineWidth,this.setting.theme.lineStroke);
//			ctx.strokeStyle = this.setting.theme.lineStroke;
//			ctx.stroke();
		}
		
	},
	//side 读取空闲点的方向
	getFreePoint(side,direction){
		switch(direction){
			case 'rightbottom':direction = 'right';break;
			case 'righttop':direction = 'right';break;
			case 'leftbottom':direction = 'bottom';break;
			case 'lefttop':direction = 'top';break;
		}
		if (side == 'leftToRight'){
			for (var i in this.points[direction]){
				if (this.points[direction][i].isUse == false){
					return this.points[direction][i];
				}
			}
		}else{
			for (var i = this.points[direction].length-1;i>=0;i--){
				if (this.points[direction][i].isUse == false){
					return this.points[direction][i];
				}
			}
		}
		switch(direction){
			case 'rightbottom':direction = 'bottom';break;
			case 'righttop':direction = 'right';break;
			case 'leftbottom':direction = 'bottom';break;
			case 'lefttop':direction = 'left';break;
		}
//		this.getFreePoint(side,direction);
	},
	isConnect(target){
		for (var i in this.lines){
			if (this.lines[i].from == target || this.lines[i].to == target){
				return true;
			}
		}
		return false;
	},
	toString(){
//		console.log('This is Block');
	}
}

function Judge (setting,text){
	Block.call(this,setting,text);
	this.successBlock = null;
	this.failBlock = null;
}
extendClass(Block,Judge);

Judge.prototype.toString = function(){
//	console.log('This is Judge:' + this.text);
}

Judge.prototype.reload = function(ctx){
		this.width = ctx.measureText(this.text.substr(0,this.setting.lineAmount)).width + this.setting.padding[1]*2 + this.setting.padding[3]*2;
		this.height = this.line * this.setting.fontSize  + this.setting.padding[0]*2 + this.setting.padding[2]*2;
};
	
Judge.prototype.drawText = function (ctx,x,y,w,h){
		ctx.fillStyle = this.setting.theme.judgeTextColor;
		var tWidth = ctx.measureText(this.text.substr(0,this.setting.lineAmount)).width;
		var tHeight = this.line * this.setting.fontSize;
		var textX = x + (w - tWidth)/2;
		var textY = y + (h - tHeight)/2 + this.setting.fontSize/2;
		for (var i=0;i<this.line;i++){
			textX = x + (w - ctx.measureText(this.text.substr(i*this.setting.lineAmount,this.setting.lineAmount)).width)/2;
			ctx.fillText(this.text.substr(i*this.setting.lineAmount,this.setting.lineAmount),textX,textY);
			textY += this.setting.fontSize;
		}
};

Judge.prototype.render = function(ctx,x,y){
//		this.reload(ctx);
		this.x = x;
		this.y = y;
		
		var w = this.width;
		var h = this.height;
		
//		ctx.beginPath();
		ctx.strokeStyle = this.setting.theme.judgeStroke;
		ctx.fillStyle = this.setting.theme.judgeFill;
//		ctx.roundRect(10,x,y,w,h);  // x轴 y轴 宽 和 高 ,绘制“被填充”的矩形
		roundPloyin(ctx,x,y,w,h,5);
		ctx.fill();
		ctx.stroke();
		
		//加入字体
		if (this.text.length > 0){
			this.drawText(ctx,x,y,w,h);
		}
		ctx.closePath();
		
		return this;
};

Judge.prototype.setSuccess = function(success){
	this.successBlock = success;
	this.link('success',this,this.successBlock);
}

Judge.prototype.setFail = function(fail){
	this.failBlock = fail;
	this.link('fail',this,this.failBlock);
}

function Line (setting,from,to,text,type){
	this.setting = setting;
	this.type = type;
	this.from = from;
	this.to = to;
	this.text = text?text:'';
}

Line.prototype = {
	drawLine(ctx, from, to,theta,headlen,width,color){
		if (this.type === 'single'){
			this.drawArrow(ctx, from, to,theta,headlen,width,color);
		}else if(this.type === 'double'){
			this.drawDoubleArrow(ctx, from, to,theta,headlen,width,color);
		}else if(this.type === 'success'){
			this.drawArrow(ctx, from, to,theta,headlen,width,color);
			this.drawJudge(ctx, from, to ,'success');
		}else if(this.type === 'fail'){
			this.drawArrow(ctx, from, to,theta,headlen,width,color);
			this.drawJudge(ctx, from, to ,'fail');
		}
		if (this.text && this.text.length > 0){
			this.drawText(ctx, from, to,theta,headlen,width,color);
		}
	},
	drawText(ctx, from, to,theta,headlen,width,color){
		
	},
	drawJudge(ctx, from, to, type){
		var cx = to.x === from.x ? to.x : (to.x - from.x) /2 + from.x;
		var cy = to.y === from.y ? to.y : (to.y - from.y) /2 + from.y;
		ctx.beginPath();
		ctx.arc(cx,cy,20,0,2*Math.PI);
		ctx.fillStyle = 'white';
		ctx.fill();
		if (type === 'success'){
			ctx.strokeStyle = this.setting.theme.judgeSuccessStroke;
			ctx.moveTo(cx-9,cy);
			ctx.lineTo(cx,cy+10);
			ctx.lineTo(cx+10,cy-10);
		}else{
			ctx.strokeStyle = this.setting.theme.judgeFailStroke;
			ctx.moveTo(cx-5,cy-5);
			ctx.lineTo(cx+5,cy+5);
			ctx.moveTo(cx-5,cy+5);
			ctx.lineTo(cx+5,cy-5);
		}
		ctx.stroke();
		ctx.closePath();
	},
	drawDoubleArrow(ctx, from, to,theta,headlen,width,color){
		this.drawArrow(ctx, from, to,theta,headlen,width,color);
		this.drawArrow(ctx, to ,from, theta,headlen,width,color);
	},
	drawArrow (ctx, from, to,theta,headlen,width,color) { 
		var fromX = from.x;
		var fromY = from.y;
		var toX = to.x;
		var toY = to.y;
		theta = typeof(theta) != 'undefined' ? theta : 30; 
		headlen = typeof(theta) != 'undefined' ? headlen : 10; 
		width = typeof(width) != 'undefined' ? width : 1; 
		color = typeof(color) != 'color' ? color : '#000';
		
		if (from.x !== to.x && from.y !== to.y && Math.abs(from.y - to.y) >5){
			ctx.beginPath();
			var mX = fromX > toX ? fromX:toX;
			var mY = fromY > toY ? toY:fromY;
			var sX = mX > fromX?mX - 15:mX;
			var sY = mX > fromX?mY:mY+15;
			var eX = mX > fromX?mX:mX - 15;
			var eY = mX > fromX?mY + 15:mY;
			ctx.moveTo(fromX,fromY);
			ctx.lineTo(sX,sY);
			ctx.moveTo(sX,sY);
			ctx.quadraticCurveTo(mX,mY,eX,eY);
			
			ctx.strokeStyle = color; 
			ctx.lineWidth = width; 
			ctx.stroke();
			ctx.closePath();
			fromX = eX;//mX;
			fromY = eY;//mY;
		}
		
		// 计算各角度和对应的P2,P3坐标 
		var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI, 
			angle1 = (angle + theta) * Math.PI / 180, 
			angle2 = (angle - theta) * Math.PI / 180, 
			topX = headlen * Math.cos(angle1), 
			topY = headlen * Math.sin(angle1), 
			botX = headlen * Math.cos(angle2), 
			botY = headlen * Math.sin(angle2); 
			ctx.save();
			ctx.beginPath();
			
		var arrowX = fromX - topX, arrowY = fromY - topY; 
//		ctx.moveTo(arrowX, arrowY);
		ctx.moveTo(fromX, fromY); 
		ctx.lineTo(toX, toY);
		arrowX = toX + topX;
		arrowY = toY + topY;
		ctx.moveTo(arrowX, arrowY);
		ctx.lineTo(toX, toY); 
		ctx.moveTo(arrowX, arrowY);
		arrowX = toX + botX; 
		arrowY = toY + botY; 
		ctx.lineTo(arrowX, arrowY);
		ctx.lineTo(toX, toY); 
		ctx.strokeStyle = color; 
		ctx.fillStyle = color;
		ctx.lineWidth = width;
		ctx.stroke();
		ctx.fill();
		ctx.restore(); 
	}
}

module.exports = {
	Block,Line,Judge
}
