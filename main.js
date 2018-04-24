/**
   *  A tools for drawing diagram by code.
   *  工具调用实例
   */
import jsToDiagram from './jsToDiagram'; 

const config = {
	savePath: './test.png',
	showPoint: false,//是否显示连接点
}

const mvcDiagram = new jsToDiagram(config);
//画一个MVC示意图
//Sample 0
var wakeBlock = mvcDiagram.create('block','睡醒');
var prettyBlock = mvcDiagram.create('block','去吃拉麵');
var judgeBlock = mvcDiagram.create('Judge','加辣嗎');
var noeatBlock = mvcDiagram.create('block','好好吃');
var eatBlock = mvcDiagram.create('block','好辣啊');
var hotelBlock = mvcDiagram.create('block','吃飽睡覺');
wakeBlock.singleLink(prettyBlock);
prettyBlock.judge(judgeBlock,eatBlock,noeatBlock);
eatBlock.singleLink(hotelBlock);
noeatBlock.singleLink(hotelBlock);

//Sample 1
//var modelBlock = mvcDiagram.create('block','model');
//var controllerBlock = mvcDiagram.create('block','controller');
//var viewBlock = mvcDiagram.create('block','view');
//modelBlock.doubleLink(controllerBlock);
//controllerBlock.doubleLink(viewBlock);
//viewBlock.doubleLink(modelBlock);

//sample 2
//var aBlock = mvcDiagram.createBlock('Resource Owner');
//var bBlock = mvcDiagram.createBlock('User-Agent');
//var cBlock = mvcDiagram.createBlock('Client');
//var dBlock = mvcDiagram.createBlock('Authorization  Server');
//bBlock.singleLink(aBlock);
//bBlock.doubleLink(cBlock);
//bBlock.singleLink(dBlock);
//bBlock.singleLink(dBlock);
//bBlock.singleLink(dBlock);
//cBlock.doubleLink(dBlock);

mvcDiagram.draw((err) =>{
	if (err)throw err;
	console.log('Draw done')
});