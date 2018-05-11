var timer = null;//计时器

function startMoveLeft(element,iTarget){//基本左右移动
    clearInterval(timer);//timer可被干扰
    timer = setInterval(function(){
        var iSpeed = 0;//手动设置速度值 没有固定速度
        if(element.offsetLeft<iTarget){//左右移动
            iSpeed = 5;
        }else{
            iSpeed = -5;
        };
        if(element.offsetLeft==iTarget){
            clearInterval(timer);//关闭计时器
        }else{
            element.style.left=element.offsetLeft+iSpeed+"px";
        };
    },30);
}
     
function startMoveOpacity(element,iTarget){//透明度运动
    clearInterval(timer);//于上面互相影响
    var alpha =element.style.opacity*100;//透明度放入变量alpha
    timer = setInterval(function(){
        var iSpeed = 0;
        if(alpha<iTarget){
            iSpeed = 5;
        }else{
            iSpeed = -5;
        };
        if(alpha==iTarget){
            clearInterval(timer);//关闭
        }else{
           alpha += iSpeed;
           element.style.opacity = alpha/100; //变量除100回到透明度
        };
    },30);
}
 

//缓冲运动
function startMoveLeftBuffer(element,iTarget){
    clearInterval(element.timer);//防止多次触发 并且用element.timer不影响其他timer
    element.timer = setInterval(function(){
        var iSpeed =(iTarget-element.offsetLeft)/10;//(目标值-当前值)/速率 = 速度
        iSpeed= iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);//大于0 向上取整； 小于0 向下；
        if(element.offsetLeft==iTarget){
            clearInterval(element.timer);//关闭
        }else{
            element.style.left=element.offsetLeft+iSpeed+"px";
        };
    },30);
}


//获取实际样式的函数 
//若设置了边框, padding, 等可以改变元素宽度高度的属性时会出现BUG

function getStyle(element,attr){
        //IE写法
        if ( element.currentStyle ) {
         return element.currentStyle[attr];
         //标准
          } else {
              return getComputedStyle(element,false)[attr];
          }
      }
    
//任意值
function startMoveAttr( element , attr , iTarget ,fn ) {
    clearInterval ( element.timer );//防止多次触发
    element.timer = setInterval ( function ( ) {
    //因为速度要动态改变,所以必须放在定时器中
    var iCurrent=0;//取变量
    if ( attr === "opacity" ){//为透明度时执行。
        iCurrent = Math.round ( parseFloat ( getStyle ( element , attr ) ) * 100 );//parseFloat：保留两位小数；Math.round：四舍五入
    } else { //默认情况
        iCurrent=parseInt(getStyle(element,attr));//实际样式大小 
    }
    var iSpeed=(iTarget-iCurrent)/10;//(目标值‐当前值)/缩放系数=速度
    iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);//速度取整 大于0 ceil为向上取整；否则 floor向下；
    
    if(iCurrent==iTarget){//结束运动
        clearInterval(element.timer);
        if(fn){
            fn();
        }
    } else {
        if ( attr==="opacity"){//为透明度时,执行
           // element.style.filter="alpha(opacity:"+(iCurrent+iSpeed)+")";//IE
            element.style.opacity=(iCurrent+iSpeed)/100;//标准
        }else{//默认
            element.style [ attr ] =iCurrent+iSpeed+"px";
        }
    };
    },30);
}
    

//真！！完美框架
function startMove(element,json,fn){
    var flag= true;//判断是否全部运动完毕
    clearInterval(element.timer);
    element.timer = setInterval(function(){
    for(var attr in json){//遍历json
        var iCurrent = 0;//当前值
        if(attr === 'opacity'){//透明的话需要*100
            iCurrent = Math.round(parseFloat(getStyle(element,attr))*100);
        }else{//默认
            iCurrent = parseInt(getStyle(element,attr));
        }//速度
        var iSpeed = (json[attr]-iCurrent)/10;//目标值 - 当前值 / 速率 = 速度
        iSpeed = iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
        if(iCurrent!= json[attr]){//判断完毕 ， 未全部运动完
            flag = false;  //继续
            if(attr == 'opacity'){
                element.style.opacity=(iCurrent+iSpeed)/100;
            }else{
                element.style[attr]= iCurrent+iSpeed+'px';
            }
        }else{//运动完毕
            flag=true;
            }
        if(flag){
            clearInterval(element.timer);//关闭定时器 继续执行函数
            if(fn){
                fn();
            }
        }
    }
    },30);
}
