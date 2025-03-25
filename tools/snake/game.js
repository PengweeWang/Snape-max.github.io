import astar from "./astar.js"
import createRainbow from "./color.js";

var MapHeight = 600;
var MapWidth = 900;
var pen = document.getElementById("canvas").getContext('2d');
var world = document.getElementById("snake").getContext('2d');
var SnakeLength = 5;
var Position = [[10,10],[10,11],[10,12],[10,13],[10,14]];
var Panel = document.getElementById("panel");
var ISPHONE;
var Map = new Array(30).fill(0).map(() => new Array(45).fill(0));
var isAi = 0;
var isclear = 0;
var Timer;

function r(direction, num){
    return {
        d: direction,
        n: num
    };
}

let simple_path_pre = [r(3, 10), r(0, 34)];
let simple_path_head = [r(2, 29), r(1, 44)];
let simple_path_body = [r(3, 1), r(0, 43), r(3, 1), r(1, 43)];
let simple_path_tail = [r(3, 1), r(0, 44)];



var os = function() {
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isPhone && !isAndroid && !isSymbian;
    return {
        isTablet: isTablet,
        isPhone: isPhone,
        isAndroid: isAndroid,
        isPc: isPc
    };
}();

if(os.isAndroid || os.isPhone) {
    ISPHONE = 1;
} else {
    ISPHONE = 0;
}

var GameConfig = {
    StartFlag: 0,
    Stopflag: 0,

    SnakeDirection: 3,  // 0 x+， 1 x-， 2 y+， 3 y-
    SnakeSpeed: 1,

}

var FoodConfig = {
    IsEaten: 0,
    IsSummon: 0,
    Foodxy: [],
}


// 初始化地图
function MapCreate(){
    var canvas =  document.getElementById("canvas");
    canvas.height = MapHeight + 8;
    canvas.width = MapWidth + 8;
    canvas.style.margin = "auto";
    canvas.style.left = 0;
    canvas.style.right = 0;
    canvas.style.top = 0;
    canvas.style.bottom = 0;
    canvas.style.position = "absolute";
    canvas.Zindex = -1;
    var c2 = document.getElementById("snake")
    c2.height = MapHeight;
    c2.width = MapWidth;
    c2.style.margin = "auto";
    c2.style.left = 0;
    c2.style.right = 0;
    c2.style.top = 0;
    c2.style.bottom = 0;
    c2.style.position = "absolute";
    c2.Zindex = 1;


    var Pstyle = Panel.style;
    Pstyle.height = 450;
    Pstyle.width = 300;
    Pstyle.margin = "auto";
    Pstyle.left = 0;
    Pstyle.right = 0;
    Pstyle.top = 0;
    Pstyle.bottom = 0;
    Pstyle.textAlign = "center";
    Pstyle.position = "absolute"


    pen.moveTo(0,0);
    pen.lineTo(0,608);
    pen.lineTo(908,608);
    pen.lineTo(908,0);
    pen.lineTo(0,0);
    pen.closePath();
    pen.strokeStyle = "#d9faff";
    pen.lineWidth = 8;
    pen.stroke();

    if(ISPHONE){
        canvas.style.bottom = "50%";
        c2.style.bottom = "50%"
        Pstyle.bottom = "50%"
        var Control = document.getElementById("control");
        var Cstyle = Control.style;
        Cstyle.height = MapHeight;
        Cstyle.width = MapWidth;
        Cstyle.top = "50%"
        Cstyle.left = 0;
        Cstyle.right = 0;
        Cstyle.bottom = 0;
        Cstyle.margin = "auto";
        Cstyle.position = "absolute"
        Cstyle.display = "block";
    }

}



// 绘制贪吃龙
function DrawSnake() {
    // 生成彩虹渐变色
    let colors = createRainbow(Position.length);

    for (let i = 0; i < SnakeLength; i++) {
        // 设置填充样式为当前颜色
        world.fillStyle = `rgb(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]})`;
        // 绘制蛇的身体
        world.fillRect(20 * Position[i][0], 20 * Position[i][1] + 1, 20, 20);
        
        // 添加阴影效果（可选）
        world.strokeStyle = "white";
        world.strokeRect(20 * Position[i][0], 20 * Position[i][1] + 1, 20, 20);
    }

    // 绘制蛇头的眼睛
    world.fillStyle = "black";
    world.fillRect(20*Position[0][0]+3,20*Position[0][1]+5,5,5);
    world.fillRect(20*Position[0][0]+12,20*Position[0][1]+5,5,5);

    // 绘制舌头
    world.fillStyle = "coral";
    world.fillRect(20 * Position[0][0] + 3, 20 * Position[0][1] - 5, 5, 5);
    world.fillRect(20 * Position[0][0] + 12, 20 * Position[0][1] - 5, 5, 5);
}

// 清除蛇
function ClearSnake(){
    world.clearRect(0,0,MapWidth, MapHeight);
}





// 游戏运行
function initGame(){
    MapCreate();
    DrawSnake();
}

function RegEvent(){
    document.onkeydown=function(e){    //对整个页面监听 
        // 按键消抖 
        var TimeOutId;
        if (TimeOutId) {
            clearTimeout(TimeOutId);
        }else {
            TimeOutId = setTimeout(() => {
                var keyNum=window.event ? e.keyCode :e.which;       //获取被按下的键值  
                // Space: Game Start and Stop
                if(keyNum==32){  
                    GameConfig.StartFlag = (GameConfig.StartFlag==0);
                } 
                if (keyNum == 13) { // egg
                    GameConfig.StartFlag = 1;
                    console.log("debug");
                    isclear = 1;
                    setupTimer();
                }

                if( GameConfig.StartFlag){

                    if (keyNum== 87){
                        // w
                        if ((GameConfig.SnakeDirection == 0) || (GameConfig.SnakeDirection == 1)){
                            GameConfig.SnakeDirection = 3;
                        }
                    }
                    else if(keyNum == 65){
                        // a
                        if ((GameConfig.SnakeDirection == 2) || (GameConfig.SnakeDirection == 3)){
                            GameConfig.SnakeDirection = 1;
                        }
                    }
                    else if(keyNum == 83){
                        //s
                        if ((GameConfig.SnakeDirection == 0) || (GameConfig.SnakeDirection == 1)){
                            GameConfig.SnakeDirection = 2;
                        }
                    }
                    else if(keyNum == 68){
                        //d
                        if ((GameConfig.SnakeDirection == 2) || (GameConfig.SnakeDirection == 3)){
                            GameConfig.SnakeDirection = 0;
                        }
                    }
                    else if(keyNum == 73){
                        isAi = !isAi;
                        setupTimer();
                    }
                    
                }
            }, "1");
        }
        
        
    }
}


// 判断元素在数组中
function InPosition(arr, subArr){
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length === subArr.length && arr[i].every((value, index) => value === subArr[index])) {
            return i;
        }
    }
    return -1;
}


function RandomPos(){
    var AllXY = [];
    for(let i=0;i<45;i++){
        for (let k=0;k<30;k++){
            if(InPosition(Position,[i,k]) == -1){
                AllXY.push([i,k]);
            }
        }
    }
    var XYindex = Math.floor(Math.random()*AllXY.length);
    var x = AllXY[XYindex][0];
    var y = AllXY[XYindex][1]; 
    return [x, y];
}

function FoodSummon(){
    FoodConfig.Foodxy = RandomPos();
}

function DrawFood(){
    // draw food
    world.fillStyle = "orange";
    world.fillRect(20*FoodConfig.Foodxy[0]+2,20*FoodConfig.Foodxy[1]+4,16,16);

    world.fillStyle = "green";
    world.fillRect(20*FoodConfig.Foodxy[0]+8,20*FoodConfig.Foodxy[1]+1,5,5);
    world.fillRect(20*FoodConfig.Foodxy[0]+12,20*FoodConfig.Foodxy[1],3,3);
}


// 游戏主循环
function GameLoop(){

    if (GameConfig.StartFlag){
        Panel.style.display = "none"
        Panel.innerHTML = "";
        ClearSnake();
        let NextStepX = Position[0][0], NextStepY = Position[0][1];
        switch (GameConfig.SnakeDirection) {
            case 0:
                NextStepX += GameConfig.SnakeSpeed;
                break;
            case 1:
                NextStepX -= GameConfig.SnakeSpeed;
                break;
    
            case 2:
                NextStepY += GameConfig.SnakeSpeed;
                break;
            
            case 3:
                NextStepY -= GameConfig.SnakeSpeed;
                break;
            default:
                break;
        }

        if((InPosition(Position, [NextStepX, NextStepY]) != -1) 
            && ((NextStepX != Position[Position.length-1][0]) && (NextStepY != Position[Position.length-1][1]))){
            GameConfig.Stopflag = 1;
        }
        if (GameConfig.Stopflag == 0){
            if (FoodConfig.IsEaten == 0){
                for(let i = SnakeLength-1; i >= 1;i--){
                    Position[i][0] = Position[i-1][0];
                    Position[i][1] = Position[i-1][1];
                }
                Position[0][0] = NextStepX;
                Position[0][1] = NextStepY;
            } else {
                Position.unshift([NextStepX,NextStepY]);
                SnakeLength += 1;
                FoodConfig.IsEaten = 0;
            }
        } 

        // 边界判断
        if (NextStepX < 0 || NextStepX >= 45 || NextStepY < 0 || NextStepY >= 30){
            GameConfig.Stopflag = 1;
        }

        
    } else {
        Panel.style.display = "block";
        Panel.innerHTML = "<P>SPACE 开始/暂停游戏</P><p>WASD 控制方向</p><p>AI托管请按 I</p>"
    }

    if(GameConfig.Stopflag == 1){
        DrawFood();
        Panel.style.display = "block";
        Panel.innerHTML = "<h1>NO GAME OVER</h1><p>SCORE: "+(SnakeLength-5)+"</p><p>重新开始请刷新</p>";

    }

    if(InPosition(Position,FoodConfig.Foodxy) != -1){
        FoodConfig.IsEaten = 1;
        FoodConfig.IsSummon = 0;
    }

    if (GameConfig.Stopflag == 0 && GameConfig.StartFlag){
        if(FoodConfig.IsSummon == 0){
            FoodSummon();
            DrawFood();
            FoodConfig.IsSummon = 1;
        }

        if(FoodConfig.IsEaten == 0){
            DrawFood();
        } 
        if (isAi && !isclear){
            aiPlay();
        }
        if (isclear){
            clear();
        }
        
}
    DrawSnake();

}

function nextStep(p1, p2) {
    let dif_x = p2[0] - p1[0];
    let dif_y = p2[1] - p1[1];
    if (dif_x > 0) {
        return 0;
    } else if (dif_x < 0) {
        return 1;
    } else if (dif_y > 0) {
        return 2;
    } else if (dif_y < 0) {
        return 3;
    }
}

function prepareRoad(){
    let road = [];
    for(let i=0;i<simple_path_head.length;i++){
        for (let s = simple_path_head[i].n;s>0;s--){
            road.push(simple_path_head[i].d);
        }
    }
    for (let k=0;k<14;k++){
        for(let i=0;i<simple_path_body.length;i++){
            for (let s = simple_path_body[i].n;s>0;s--){
                road.push(simple_path_body[i].d);
            }
        }
    }
    for(let i=0;i<simple_path_tail.length;i++){
        for (let s = simple_path_tail[i].n;s>0;s--){
            road.push(simple_path_tail[i].d);
        }
    }
    return road;

}
var cyclecnt = 0;
var road = prepareRoad();
let cycle = 0;
console.log(road);
function clear(){
    
    if (cycle == 0){
        cyclecnt++;
        console.log(cyclecnt);
        if (cyclecnt < 10) GameConfig.SnakeDirection = 3;
        if (cyclecnt >= 10) GameConfig.SnakeDirection = 0;
        if (cyclecnt == 43) {cycle = 1; cyclecnt=0};
    } else {
        GameConfig.SnakeDirection = road[cyclecnt];
        cyclecnt = (cyclecnt+1)%road.length;
    }
    
}


function aiPlay() {
    Map = new Array(30).fill(0).map(() => new Array(45).fill(0));
    for(let i=0;i<Position.length;i++){
        Map[Position[i][1]][Position[i][0]] = 1;
    }
    var path = astar(Position[0],FoodConfig.Foodxy,Map);

    if (path.length != 1){ // 可以吃到食物
        var fakeSnake = Position;
        while(InPosition(fakeSnake,FoodConfig.Foodxy) != -1){
            Map = new Array(30).fill(0).map(() => new Array(45).fill(0));
            for(let i=0;i<fakeSnake.length;i++){
                Map[fakeSnake[i][1]][fakeSnake[i][0]] = 1;
            }
            var fakepath = astar(fakeSnake[0],FoodConfig.Foodxy,Map);
            let nextdirection = nextStep(fakepath[0],fakepath[1]);
            let NextStepX = fakeSnake[0][0], NextStepY = fakeSnake[0][1];
            switch (nextdirection) {
                case 0:
                    NextStepX += GameConfig.SnakeSpeed;
                    break;
                case 1:
                    NextStepX -= GameConfig.SnakeSpeed;
                    break;
        
                case 2:
                    NextStepY += GameConfig.SnakeSpeed;
                    break;
                
                case 3:
                    NextStepY -= GameConfig.SnakeSpeed;
                    break;
                default:
                    break;
            }
            for(let i = SnakeLength-1; i >= 1;i--){
                fakeSnake[i][0] = fakeSnake[i-1][0];
                fakeSnake[i][1] = fakeSnake[i-1][1];
            }
            fakeSnake[0][0] = NextStepX;
            fakeSnake[0][1] = NextStepY;
        }
        Map = new Array(30).fill(0).map(() => new Array(45).fill(0));
        for(let i=0;i<fakeSnake.length-1;i++){
            Map[fakeSnake[i][1]][fakeSnake[i][0]] = 1;
        }
        var eatEndpath = astar(fakeSnake[0],fakeSnake[fakeSnake.length - 1],Map);

        // 虚拟蛇不能吃到自己的尾巴
        if (eatEndpath.length == 1){
            // 真蛇能否吃到自己的尾巴
            path = astar(Position[0],Position[Position.length-1],Map);
            if (path.length == 1){ // 真蛇不能吃到自己的尾巴
                let cnt = 0;
                while(path.length == 1 && cnt < Position.length) {path = astar(Position[0],RandomPos(),Map);cnt++;}
            }
        }
    } else if (path.length == 1) { // 吃不到食物
        // console.log("eat tail")
        Map = new Array(30).fill(0).map(() => new Array(45).fill(0));
        for(let i=0;i<Position.length-1;i++){
            Map[Position[i][1]][Position[i][0]] = 1;
        }
        path = astar(Position[0],Position[Position.length - 1],Map);
        // 如果真蛇能吃到自己的尾巴，就直接吃
        if (path.length == 1){ // 否则就 wander
            let cnt = 0;
            // console.log("Random Pos")
            while(path.length == 1 && cnt < Position.length) {path = astar(Position[0],RandomPos(),Map);cnt++;}
        }

    } 
    let nextdirection = nextStep(path[0],path[1]);
    GameConfig.SnakeDirection = nextdirection;
}

function setupTimer() {
    if (Timer) {
        clearInterval(Timer); // 清除之前的定时器
    }
    if (isAi) {
        Timer = window.setInterval(GameLoop, 10); // 对于AI使用更快的间隔
    } else if (isclear){
        Timer = window.setInterval(GameLoop, 1);
    }
    else {
        Timer = window.setInterval(GameLoop, 250); // 对于非AI使用较慢的间隔
    }
}

function GameRun(){
    initGame();
    RegEvent();
    setupTimer();
}

GameRun();