

var config = {
    dom: document.getElementById("game"),  //游戏的dom对象
    width: 500,
    height: 500,
    rows: 3,  //行数
    cols: 3,  //列数
    url: "https://t.mwm.moe/fj/",  //图片路径
};


function level(k){
    config.cols = config.rows = k;
    var div = document.getElementById("game");
    while(div.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        div.removeChild(div.firstChild);
    }
    blocks = [];
    run();
    iswinflag = 0;
}

var answer = document.getElementById("answer");
function saveAnswer(){
    answer.style.background = 'url("'+ config.url + '") ' + "0" + "px " + "0" + "px";
}


/**
 * 初始化游戏容器
 */
function initGameDom(){
    config.dom.style.width = config.width + "px";
    config.dom.style.height = config.height + "px";
    config.dom.style.border = "2px solid #ccc";
    config.dom.style.position = "relative";
    //每一个拼图块的宽高
    config.blockWidth = config.width / config.cols;
    config.blockHeight = config.height / config.rows;

    //拼图块的数量
    config.blockNumber = config.rows * config.cols;
}

//存放拼图块信息
var blocks = [];
//答案图片

/**
 * 初始化拼图块的数组
 */
function initBlocks(){
    var pid = 0;
    for(var i = 0; i < config.rows; i++){
        for(var j = 0; j < config.cols; j++){
            var isVisible = true;
            pid = pid + 1;
            blocks.push(new Block(j * config.blockWidth, i * config.blockHeight, isVisible,pid));
        }
    }
}

/**
 * 拼图块的构造函数
 * @param {*} left 
 * @param {*} top 
 * @param {*} isVisible 是否可见
 */
function Block(left, top, isVisible, pid){
    this.left = left;
    this.top = top;
    this.correctBgX = -this.left;
    this.correctBgY = -this.top;
    this.isVisible = isVisible;//是否可见
    this.pid = pid;

    this.dom = document.createElement("div");
    this.dom.className = "ock";
    this.dom.style.width = config.blockWidth + "px";
    this.dom.style.height = config.blockHeight + "px";
    this.dom.style.boxSizing = "border-box";
    this.dom.style.border = "2px solid #fff";
    this.dom.style.background = 'url("'+ config.url + '") ' + this.correctBgX + "px " + this.correctBgY + "px";
    this.dom.style.cursor = "pointer";
    this.dom.style.transition = ".5s";//css属性变化的时候，在0.5秒内完成
    this.dom.style.position = "absolute";
    /**
     * 根据当前的left、top，显示div的位置
     */
    this.show = function(){
        this.dom.style.left = this.left + "px";
        this.dom.style.top = this.top + "px";
    }

    this.show();
    config.dom.appendChild(this.dom);
}

/**
 * 给blocks数组从新排序
 */
function shuffle(){
    for(var i = 0; i < blocks.length-1; i++){
        //随机产生一个下标
        var index = getRandom(0, blocks.length-2);
        //交换left、top
        exchangeBlock(blocks[i], blocks[index]);  
    }
}

/**
 * 生成[min, max]范围内的随机数
 * @param {*} min 
 * @param {*} max 
 */
function getRandom(min, max){
    return Math.floor(Math.random() * (max +1 -min) + min);
}

/**
 * 交换两个拼图块的top、left，并在页面上重新显示
 * 参数都为拼图块对象
 * @param {*} x 
 * @param {*} y 
 */
function exchangeBlock(x, y){
    //交换left
    var temp = x.left;
    x.left = y.left;
    y.left = temp;
    //交换top
    var temp = x.top;
    x.top = y.top;
    y.top = temp;
    //在页面重新显示
    x.show();
    y.show();
}

function isEqual(x, y){
    return parseInt(x) === parseInt(y);
}

/**
 * 游戏结束判定
 */
function isWin(){
    //过滤不在正确位置上的拼图块
    var mistakenBlocks = blocks.filter(function(b){
        return !(isEqual(b.left, -b.correctBgX) && isEqual(b.top, -b.correctBgY));
    });
    if(mistakenBlocks.length === 0){
        //游戏结束
        blocks.forEach(function(b){
            b.dom.style.border = "none";
        });
        return 1;
    }
    return 0;
}






function selectFirst(e){
    e.dom.style.borderColor = "#611f1f";
    e.dom.style.borderWidth = 2;
    e.dom.style.zIndex = 1;
}


function unselect(e){
    e.dom.style.borderColor = "#fff";
    e.dom.style.borderWidth = 2;
}

var LastBlock = null;
var iswinflag = 0;
function regEvent(){
    blocks.forEach(function(b){
        b.dom.onclick = function(){
            if (!iswinflag){
                if (LastBlock == null){
                    LastBlock = b;
                    selectFirst(b);
                } else {
                    if (LastBlock != b){
                        exchangeBlock(LastBlock,b);
                        unselect(b);
                        unselect(LastBlock);
                        LastBlock = null;
                    } else {
                        unselect(b);
                        LastBlock = null;
                    }
                }
                iswinflag =  isWin();
            }
        }
    });
}

var isshow = 0;
function showAnswer(){
    if (isshow){
        answer.style.display = "none";
        isshow = 0;
    } else {
        answer.style.display = "block";
        isshow = 1;
    }
    
}

function run(){
    initGameDom();
    initBlocks();
    saveAnswer();
    shuffle();
    regEvent();
}
