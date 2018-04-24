/**
 * JsToDiagram
 * @author SevensChan
 * @description
 */
import Components from './components';
import fs from 'fs';
import {createCanvas,loadImage} from 'canvas';
import {extend,direction,Queue,firstUpper} from './utils'
//const { createCanvas, loadImage } = require('canvas')
//const canvas = createCanvas(200, 200)
//const ctx = canvas.getContext('2d')

function jsToDiagram(config) {
	var defaults = {
		fillStyle: 'white',//默认填充颜色
		strokeStyle: '#81C7D4',
		fontColor: 'black',
		showPoint: false,
		fontFamily: 'Microsoft YaHei',
		fontSize: 20,
		canvasPadding: [50,100,50,100],
		lineAmount:15,//一行的字数
		padding: [20,30,30,20],
		gap: 50,
		theme: {
			blockStroke: '#bfbfbf',
			blockFill: '#FFF',
			blockTextColor: '#000',
			blockRadius: 5,
			judgeStroke: '#66db59',
			judgeFill: '#FFF',
			judgeTextColor: '#66dc59',
			judgeSuccessStroke: '#66dc59',
			judgeFailStroke: '#D79196',
			lineStroke: '#66dc59',
			lineWidth: 1,
			lineTextColor: '#bfbfbf'
		}
	};
	this.setting = extend({},defaults,config);
	this.container = [];
	this.canvas = null;
	this.ctx = null;
	this.middleLine = 0;
	this.paints = [];
};

jsToDiagram.prototype = {
	//创建块 并加入管理
	create (type,text){
		if (typeof type !== 'string'){
			throw Error('Create type error.');
		}else{
			type = firstUpper(type);
		}
		var block = new Components[type](this.setting,text);
		this.container.push(block);
		return block;
	},
	initCanvas (width,height){
		this.canvas	 = createCanvas(width,height);
		this.ctx = this.canvas.getContext('2d');
		//白底
		this.ctx.fillStyle = "white";
		this.ctx.beginPath();
		this.ctx.rect(0,0,width,height);
		this.ctx.fill();
		this.ctx.closePath();
		this.ctx.fillStyle = this.setting.fillStyle;  // 设置或返回用于填充绘画的颜色、渐变或模式
		this.ctx.strokeStyle = this.setting.strokeStyle;  //图形边框的填充颜色
 	    this.ctx.lineWidth = this.setting.lineWidth;
 	    this.ctx.textBaseline = "middle";
 	    this.ctx.font= this.setting.fontSize + "px" + this.setting.fontFamily;
	},
	arrange: function(){
		var len = this.container.length;
		for (var i=0;i<len+1;i++){
			this.paints[i] = [];
			for (var j=0;j<len+1;j++){
				this.paints[i][j] = 0;
			}
		}
		//第一个block放在中间位置
		var startBlock = this.container[0];
		var curRow = 1;
		var curCol = 1;//Math.floor(len/2)-1;
		this.paints[curRow][curCol] = startBlock;
		startBlock.row = curRow;
		startBlock.col = curCol;
		for (var i = 1; i < len ; i++){
			var curBlock = this.container[i];
			//判断与已经放置好的block是否有关联
			var connectPoint = [];
			for (var j = i-1; j >= 0 ; j--){
				if (curBlock.isConnect(this.container[j]) || this.container[j].isConnect(curBlock)){
					connectPoint.push(this.container[j]);
				}
			}
			var freePlace = this.getFreePlace(this.container[i-1],connectPoint);
			if (!freePlace){
				throw new Error('System Error');
			}
			curBlock.row = freePlace.row;
			curBlock.col = freePlace.col;
			this.paints[freePlace.row][freePlace.col] = curBlock;
		}
		
	},
	getFreePlace(pastPoint,points){
		if (points.length == 0 ){
			return this.getFreeNeighborsPos(pastPoint)[0];
		}
		var minPoint = null, minDistance = 1000,neighbors,point;
		var freePlaces = [],tempResult;
		for (var i in points){
			tempResult = this.getFreeNeighborsPos(points[i]);
			freePlaces = freePlaces.concat(tempResult);
		}
		var tempD;
		for (var i in freePlaces){
			tempD = 0;
			for (var j in points){
				tempD += this.distance(freePlaces[i],points[j]);
			}
			if (tempD < minDistance){
				minDistance = tempD;
				minPoint = freePlaces[i];
			}
		}
		
		return minPoint;
	},
	getFreeNeighborsPos(point){
		var result = [];
		//顺序下 右 右下 右上 上 左上 左 左下
		var row = point.row,col = point.col;
		if (!this.paints[row+1][col])result.push({row:row+1,col:col});
		if (!this.paints[row+1][col+1] && !this.paints[row][col+1])result.push({row:row+1,col:col+1});
		if (!this.paints[row][col+1])result.push({row:row,col:col+1});
		if (row-1>=0 && !this.paints[row-1][col+1] && !this.paints[row-1][col])result.push({row:row-1,col:col+1});
		if (row-1>=0 && !this.paints[row-1][col])result.push({row:row-1,col:col});
		if (row-1>=0 && col-1>0 && !this.paints[row-1][col-1])result.push({row:row-1,col:col-1});
		if (col-1>=0 && !this.paints[row][col-1])result.push({row:row,col:col-1});
		if (col-1>=0 && !this.paints[row+1][col-1])result.push({row:row+1,col:col-1});
		return result;
	},
	distance(pointA,pointB){
		return Math.sqrt(Math.pow(pointB.col - pointA.col,2) + Math.pow(pointB.row - pointA.row,2))	
	},
	getUsePlace(){
		var maxWidth = 0;//this.paints[0].length;
		var maxHeight = 0;//this.paints.length;
		var hasValue = false;
		for (var i = this.paints.length-1; i >= 0 ; i--){
			hasValue = false;
			for (var j = this.paints[i].length; j >= 0; j--){
				if (typeof this.paints[i][j] !== 'undefined' && this.paints[i][j] !== 0){
					if (maxWidth < j){
						maxWidth = j;
					}
					hasValue = true;
				}
			}
			if (hasValue){
				if (maxHeight < i){
					maxHeight = i;
				}
			}
		}
		
		return {width:maxWidth,height:maxHeight};
	},
	draw: async function (callback){
		//安排好位置
		this.arrange();
		//計算使用到的大小
		var size = this.getUsePlace();
		var blockWidth = 300,blockHeight = 200;
		this.initCanvas((size.width+1) * blockWidth,(size.height+1) * blockHeight);
		
		//先计算中位线
		var maxWidth = 0;
		for (var i in this.container){
			this.container[i].reload(this.ctx);
			if(maxWidth < this.container[i].width)maxWidth = this.container[i].width;
		}
		this.middleLine = maxWidth/2 + this.setting.canvasPadding[3];
		blockWidth = maxWidth * 1.6;
		
		//画主体
		var x = 0, y = this.setting.canvasPadding[0];
		var centerX,centerY;
		for (var i in this.container){
			this.container[i].width = maxWidth;
//			x = this.middleLine - this.container[i].width/2;
			centerX = this.container[i].col * blockWidth;
			centerY = this.container[i].row * blockHeight;
			x = centerX - this.container[i].width/2;
			y = centerY - this.container[i].height/2;
			var cur = this.container[i].render(this.ctx,x,y);
//			y = cur.y + cur.height + this.setting.gap;
		}
		
		//计算每个主体的每条边被用多少次
		for (var i in this.container){
			var block = this.container[i];
			for (var j in block.lines){
				let line = block.lines[j];
				let direc = direction(line.from,line.to);
				switch(direc){
					case 'Top':
						line.from.topLineAmount++;
						line.to.bottomLineAmount++;
						break;
					case 'Bottom':
						line.from.bottomLineAmount++;
						line.to.topLineAmount++;
						break;
					case 'Right':
						line.from.rightLineAmount++;
						line.to.leftLineAmount++;
						break;
					case 'Left':
						line.from.leftLineAmount++;
						line.to.rightLineAmount++;
						break;
					case 'rightBottom':
						line.from.rightLineAmount++;
						line.to.topLineAmount++;
						break;
					case 'rightTop':
						line.from.rightLineAmount++;
//						line.to.leftLineAmount++;
						line.to.bottomLineAmount++;
						break;
					case 'leftTop':
						line.from.topLineAmount++;
						line.to.rightLineAmount++;
						break;
					case 'leftBottom':
						line.from.bottomLineAmount++;
						line.to.rightLineAmount++;
						break;
				}
			}
		}

		//计算主体每条边的接口
		var directionMeta = ['top','bottom','left','right','rightTop','rightBottom','leftTop','leftBottom'];
		for (var i in this.container){
			var block = this.container[i];
			//八个方向
			for (var d in directionMeta){
				if (block[directionMeta[d]+'LineAmount'] > 0){
					for (var j=0;j< block[directionMeta[d]+'LineAmount'];j++){
						var x = block.x + block.width / (block[directionMeta[d]+'LineAmount'] + 1) * (j+1);
						var y = block.y;
						switch(directionMeta[d]){
							case 'leftTop':
							case 'rightTop':
							case 'top': x = block.x + block.width / (block[directionMeta[d]+'LineAmount'] + 1) * (j+1);
										y = block.y;
										break;
							case 'leftBottom':
							case 'rightBottom':
							case 'bottom': y += block.height;break;
							case 'left' : x = block.x;
										  y += block.height / (block[directionMeta[d]+'LineAmount'] + 1)* (j+1);break;
							case 'right':x = block.x + block.width;
										  y += block.height / (block[directionMeta[d]+'LineAmount'] + 1)* (j+1);
										  break;
						}
						block.points[directionMeta[d]].push({
							x: x,
							y: y,
							isUse: false
						});
					}
				}
			}
		}
		
		
		//画线
		for (var i in this.container){
			this.container[i].renderLine(this.ctx);
		}
		
		var savePath = await this.output();
		callback();
	},
    output: async function (){
		return new Promise((resolve,reject)=>{
			try {
				var savePath = './test.png';
				var img = this.canvas.toDataURL();
				var data = img.replace(/^data:image\/\w+;base64,/, "");
				var buf = new Buffer(data, 'base64');
				fs.writeFileSync(savePath, buf);
				console.log("Create Img:" + savePath);
				resolve(savePath);
			} catch (err){
				reject(err)
			    console.error("Error: Write File failed " + err.message);
			}
		});
	}
}

module.exports = jsToDiagram;
