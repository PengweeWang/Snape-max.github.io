import astar from "./astar.js"
import createRainbow from "./color.js";

const DIRECTION = {
    RIGHT: 0,
    LEFT: 1,
    DOWN: 2,
    UP: 3,
}

const MAP = {
    WIDTH: 18,
    HEIGHT: 12,
    CELL_SIZE: 50,
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 600,
}

function findIdx(arr, subArr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length === subArr.length && arr[i].every((value, index) => value === subArr[index])) {
            return i;
        }
    }
    return -1;
}


function equal(pos1, pos2) {
    if (pos1[0] == pos2[0] && pos1[1] == pos2[1]){
        return true;
    }
    return false;
}


function getNextDirection(oldHead, newHead) {
    let dx = newHead[0] -  oldHead[0];
    let dy = newHead[1] - oldHead[1];
    if (dx == 0) {
        if (dy == -1) return DIRECTION.UP;
        if (dy == 1) return DIRECTION.DOWN;
    }
    if (dy == 0) {
        if (dx == 1) return DIRECTION.RIGHT;
        if (dx == -1) return DIRECTION.LEFT;
    }
}


class SnakeGame {

    mapCtx = document.getElementById("canvas").getContext('2d');
    snakeCtx = document.getElementById("snake").getContext('2d');
    scoreDom = document.getElementById('scoreDisplay');
    gameStatusDom = document.getElementById('gameStatus');
    panel = document.getElementById("panel");
    snakePos = [[2,10-4],[2,11-4],[2,12-4],[2,13-4],[2,14-4]];
    foodPos = this.getAvailablePos();
    snakeDirection = DIRECTION.UP;
    isRunning = false;
    isAIEnabled = false;
    score = 0;
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);


    lastTime = 0;
    updateInterval = 250

    constructor() {
        this.lastTime = performance.now();
        this.drawUI()
        this.drawFood()
        this.drawSnake()
        this.regEvent()
    }

    getAvailablePos(){
        var availablePositions = [];
        for(let i=0;i<MAP.WIDTH;i++){
            for (let k=0;k<MAP.HEIGHT;k++){
                if(findIdx(this.snakePos,[i,k]) == -1){
                    availablePositions.push([i,k]);
                }
            }
        }
        if (availablePositions.length == 0){
            this.gameWin(); 
            return;
        } 
        var xyIndex = Math.floor(Math.random()*availablePositions.length);
        var x = availablePositions[xyIndex][0];
        var y = availablePositions[xyIndex][1]; 
        return [x, y];
    }

    summonFood(){
        this.foodPos =  this.getAvailablePos()
    }

    drawUI() {
        // 设置地图以及蛇的style
        var mapCanvas =  document.getElementById("canvas");
        mapCanvas.height = MAP.CANVAS_HEIGHT + 8;
        mapCanvas.width = MAP.CANVAS_WIDTH + 8;
        mapCanvas.style.margin = "auto";
        mapCanvas.style.left = 0;
        mapCanvas.style.right = 0;
        mapCanvas.style.top = 0;
        mapCanvas.style.bottom = 0;
        mapCanvas.style.position = "absolute";
        mapCanvas.Zindex = -1;
        var snakeCanvas = document.getElementById("snake")
        snakeCanvas.height = MAP.CANVAS_HEIGHT;
        snakeCanvas.width = MAP.CANVAS_WIDTH;
        snakeCanvas.style.margin = "auto";
        snakeCanvas.style.left = 0;
        snakeCanvas.style.right = 0;
        snakeCanvas.style.top = 0;
        snakeCanvas.style.bottom = 0;
        snakeCanvas.style.position = "absolute";
        snakeCanvas.Zindex = 1;
        // 设置panel样式
        var panelStyle = this.panel.style;
        panelStyle.height = 180;
        panelStyle.width = 300;
        panelStyle.margin = "auto";
        panelStyle.left = 0;
        panelStyle.right = 0;
        panelStyle.top = 0;
        panelStyle.bottom = 0;
        panelStyle.textAlign = "center";
        panelStyle.position = "absolute"

        this.panel.innerHTML = "<P>SPACE 开始/暂停游戏</P><p>WASD 控制方向</p><p>AI托管请按 I</p>"
        this.panel.style.display = "block"

        // 绘制地图方框
        this.mapCtx.moveTo(0,0);
        this.mapCtx.lineTo(0,608);
        this.mapCtx.lineTo(908,608);
        this.mapCtx.lineTo(908,0);
        this.mapCtx.lineTo(0,0);
        this.mapCtx.closePath();
        this.mapCtx.strokeStyle = "#d9faff";
        this.mapCtx.lineWidth = 8;
        this.mapCtx.stroke();
        // 移动端方向键
        if (this.isMobile){
            mapCanvas.style.bottom = "50%";
            snakeCanvas.style.bottom = "50%"
            panelStyle.bottom = "50%"
            var control = document.getElementById("control");
            var controlStyle = control.style;
            controlStyle.height = MAP.CANVAS_HEIGHT;
            controlStyle.width = MAP.CANVAS_WIDTH;
            controlStyle.top = "50%"
            controlStyle.left = 0;
            controlStyle.right = 0;
            controlStyle.bottom = 0;
            controlStyle.margin = "auto";
            controlStyle.position = "absolute"
            controlStyle.display = "block";
        }
    }

    drawFood() {
        if(this.foodPos == undefined) return;
        // // console.log(this.foodPos)
        this.snakeCtx.shadowColor = 'orange';
        this.snakeCtx.shadowBlur = 15;
        this.snakeCtx.fillStyle = "orange";
        this.snakeCtx.fillRect(MAP.CELL_SIZE*this.foodPos[0]+2,MAP.CELL_SIZE*this.foodPos[1]+MAP.CELL_SIZE*0.15,MAP.CELL_SIZE*0.7,MAP.CELL_SIZE*0.7);
    
        this.snakeCtx.fillStyle = "green";
        this.snakeCtx.fillRect(MAP.CELL_SIZE*this.foodPos[0]+MAP.CELL_SIZE*0.30,MAP.CELL_SIZE*this.foodPos[1]+1,MAP.CELL_SIZE*0.2,MAP.CELL_SIZE*0.2);
        this.snakeCtx.fillRect(MAP.CELL_SIZE*this.foodPos[0]+MAP.CELL_SIZE*0.25,MAP.CELL_SIZE*this.foodPos[1] - 2,MAP.CELL_SIZE*0.1,MAP.CELL_SIZE*0.1);

    }

    // 添加圆角矩形方法
    roundRect(x, y, width, height, radius) {
        this.snakeCtx.beginPath();
        this.snakeCtx.moveTo(x + radius, y);
        this.snakeCtx.lineTo(x + width - radius, y);
        this.snakeCtx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.snakeCtx.lineTo(x + width, y + height - radius);
        this.snakeCtx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.snakeCtx.lineTo(x + radius, y + height);
        this.snakeCtx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.snakeCtx.lineTo(x, y + radius);
        this.snakeCtx.quadraticCurveTo(x, y, x + radius, y);
        this.snakeCtx.closePath();
    }

    drawSnake() {
        // 绘制舌头
        this.snakeCtx.fillStyle = "coral";
        this.snakeCtx.fillRect(MAP.CELL_SIZE * this.snakePos[0][0] + MAP.CELL_SIZE*0.15, MAP.CELL_SIZE * this.snakePos[0][1] - MAP.CELL_SIZE*0.2 + 2, MAP.CELL_SIZE*0.2, MAP.CELL_SIZE*0.2);
        this.snakeCtx.fillRect(MAP.CELL_SIZE * this.snakePos[0][0] + MAP.CELL_SIZE*0.65, MAP.CELL_SIZE * this.snakePos[0][1] - MAP.CELL_SIZE*0.2 + 2, MAP.CELL_SIZE*0.2, MAP.CELL_SIZE*0.2);
        let colors = createRainbow(this.snakePos.length);
    
        // 绘制蛇身
        for (let i = 0; i < this.snakePos.length; i++) {
            // 渐变效果
            let gradient = this.snakeCtx.createRadialGradient(
                MAP.CELL_SIZE * this.snakePos[i][0] + MAP.CELL_SIZE/2,
                MAP.CELL_SIZE * this.snakePos[i][1] + MAP.CELL_SIZE/2,
                0,
                MAP.CELL_SIZE * this.snakePos[i][0] + MAP.CELL_SIZE/2,
                MAP.CELL_SIZE * this.snakePos[i][1] + MAP.CELL_SIZE/2,
                MAP.CELL_SIZE/2
            );
            
            gradient.addColorStop(0, `rgba(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]}, 1)`);
            gradient.addColorStop(1, `rgba(${colors[i][0]}, ${colors[i][1]}, ${colors[i][2]}, 0.7)`);
            
            this.snakeCtx.fillStyle = gradient;
            
            // 圆角矩形
            this.roundRect(
                MAP.CELL_SIZE * this.snakePos[i][0] + 2,
                MAP.CELL_SIZE * this.snakePos[i][1] + 2,
                MAP.CELL_SIZE - 4,
                MAP.CELL_SIZE - 4,
                10
            );
            this.snakeCtx.fill();
            
            // 边框
            this.snakeCtx.strokeStyle = "rgba(255, 255, 255, 0.3)";
            this.snakeCtx.lineWidth = 2;
            this.snakeCtx.stroke();
        }
        
        // 绘制蛇头
        if (this.snakePos.length > 0) {
            // 眼睛
            this.snakeCtx.fillStyle = "black";
            this.snakeCtx.beginPath();
            this.snakeCtx.arc(
                MAP.CELL_SIZE*this.snakePos[0][0]+MAP.CELL_SIZE*0.3,
                MAP.CELL_SIZE*this.snakePos[0][1]+ MAP.CELL_SIZE*0.3,
                MAP.CELL_SIZE*0.1,
                0,
                Math.PI * 2
            );
            this.snakeCtx.arc(
                MAP.CELL_SIZE*this.snakePos[0][0]+MAP.CELL_SIZE*0.7,
                MAP.CELL_SIZE*this.snakePos[0][1]+ MAP.CELL_SIZE*0.3,
                MAP.CELL_SIZE*0.1,
                0,
                Math.PI * 2
            );
            this.snakeCtx.fill();
        
        }
    
    }

    // 清除蛇
    clearSnake(){
        this.snakeCtx.clearRect(0,0,MAP.CANVAS_WIDTH, MAP.CANVAS_HEIGHT);
    }

    resetGame() {
        this.snakePos = [[10,10],[10,11],[10,12],[10,13],[10,14]];
        this.foodPos = this.getAvailablePos();
        this.snakeDirection = DIRECTION.UP;
        this.isRunning = false;
        this.isAIEnabled = false;
        this.score = 0;
    }

    getNextPosition() {
        const head = this.snakePos[0];
        switch(this.snakeDirection) {
            case DIRECTION.RIGHT: return [head[0]+1, head[1]];
            case DIRECTION.LEFT: return [head[0]-1, head[1]];
            case DIRECTION.DOWN: return [head[0], head[1]+1];
            case DIRECTION.UP: return [head[0], head[1]-1];
        }
    }

    moveSnake(newHead) {
        this.snakePos.unshift(newHead);
        if (!this.isFoodEaten()) {
            this.snakePos.pop();
        } else {
            this.score++;
        }
    }

    isFoodEaten() {
        return this.snakePos[0][0] === this.foodPos[0] && this.snakePos[0][1] == this.foodPos[1]
    }

    gameLoop = () =>  {
        this.scoreDom.textContent = `分数: ${this.score}`;
        let statusText = '';
        if (this.isAIEnabled) statusText = 'AI模式';
        else if (!this.isRunning) statusText = '暂停中';
        else statusText = '游戏中';
        this.gameStatusDom.textContent = statusText;

        if (!this.isRunning) {
            requestAnimationFrame(() => this.gameLoop());
            return;
        }




        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
            
        if (deltaTime >= this.updateInterval) {
            this.lastTime = currentTime - (deltaTime % this.updateInterval);

            this.clearSnake();
            // this.drawSnake();
            this.updateInterval = 250;
            if (this.isAIEnabled){
                this.snakeDirection = this.aiGamer();
                this.updateInterval = 1;
            }
            let newHead = this.getNextPosition();

            this.moveSnake(newHead);
            this.checkCollisions();
            if (this.isFoodEaten()) {
                this.summonFood();
            }
            this.drawFood();
            this.drawSnake();
        }
        requestAnimationFrame(() => this.gameLoop());

    }

    isLegalPos(pos) {
        let res = true;
        let envMap = new Array(MAP.HEIGHT).fill(0).map(() => new Array(MAP.WIDTH).fill(0));
        for (let i=0; i<this.snakePos.length;i++){
            this.envMap[this.snakePos[i][1]][this.snakePos[i][0]] = 1;
        }
        if (pos[0] < 0 || pos[1] >= MAP.WIDTH || pos[1] < 0 || pos[1] >= MAP.HEIGHT) res = false;
        if (envMap[pos[1]][pos[0]] == 1) res == false;
        return res;
    }

    checkCollisions() {
        const [x, y] = this.snakePos[0];
        if (x < 0 || x >= MAP.WIDTH || y < 0 || y >= MAP.HEIGHT) this.gameOver();
        if (this.snakePos.slice(1).some(pos => pos[0] === x && pos[1] === y)) this.gameOver();
    }

    gameOver() {
        this.panel.innerHTML = 
        "<h1>NO GAME OVER</h1><p>SCORE: "+(this.snakePos.length - 5)+"</p><p>重新开始请刷新</p>";
        this.isRunning = undefined;
        this.panel.style.display = "block"
    }

    gameWin() {
        this.panel.innerHTML = 
        "<h1 style='color: #4CAF50; text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);'>You Win</h1><p>SCORE: "+(this.snakePos.length - 5)+"</p><p>重新开始请刷新</p>";
        this.isRunning = undefined;
        this.panel.style.display = "block"
    }

    regEvent() {
        document.onkeydown =  (e) =>  {
            var timeOutId;
            if (timeOutId) {
                clearTimeout(timeOutId);
            } else {
                timeOutId = setTimeout(() => {
                var key = e.key;
                
                if (key == " " & this.isRunning != undefined){
                    this.isRunning = !this.isRunning
                    this.panel.style.display = this.isRunning ? "none" : "block";
                }

                if (key == "i") {
                    this.isAIEnabled = true
                }


                if (this.isRunning & !this.isAIEnabled) {
                    switch (key) {
                        case "w":
                            if (this.snakeDirection != DIRECTION.DOWN) {
                                this.snakeDirection = DIRECTION.UP;
                            }
                            break;
                        case "s":
                            if (this.snakeDirection != DIRECTION.UP) {
                                this.snakeDirection = DIRECTION.DOWN;
                            }
                            break;
                        case "a":
                            if (this.snakeDirection != DIRECTION.RIGHT) {
                                this.snakeDirection = DIRECTION.LEFT;
                            }
                            break;
                        case "d":
                            if (this.snakeDirection != DIRECTION.LEFT) {
                                this.snakeDirection = DIRECTION.RIGHT
                            }
                            break;
                    }
                }

                }, 10);
            }
        }
    }


    start() {
        this.lastTime = performance.now();
        this.gameLoop();
    }

    envMap = null
    aiGamer() {
        let canFindFood = false;
        let canFindTail = false;
        this.envMap = new Array(MAP.HEIGHT).fill(0).map(() => new Array(MAP.WIDTH).fill(0));
        for (let i=0; i<this.snakePos.length;i++){
            this.envMap[this.snakePos[i][1]][this.snakePos[i][0]] = 1;
        }
        let snakeHead = this.snakePos[0];
        let findFoodPath = astar(snakeHead, this.foodPos, this.envMap)
        let findTailPath = undefined;
        if (findFoodPath.length != 1) canFindFood = true;
        if (canFindFood) {
            let newSnakeHead = findFoodPath[findFoodPath.length - 1];
            let fakeSnakePos = JSON.parse(JSON.stringify(this.snakePos)); // 深拷贝
            for (let i=0;i< findFoodPath.length - 2;i++){
                fakeSnakePos.unshift(findFoodPath[i + 1])
                fakeSnakePos.pop()
            }
            fakeSnakePos.unshift(newSnakeHead)

            
            this.envMap = new Array(MAP.HEIGHT).fill(0).map(() => new Array(MAP.WIDTH).fill(0));
            for (let i=0; i<fakeSnakePos.length-1;i++){
                this.envMap[fakeSnakePos[i][1]][fakeSnakePos[i][0]] = 1;
            }
            let newSnakeTail = fakeSnakePos[fakeSnakePos.length - 1];
            findTailPath = astar(newSnakeHead, newSnakeTail, this.envMap)

            if (findTailPath.length != 1) canFindTail = true;
            if (canFindTail) {
                return getNextDirection(snakeHead, findFoodPath[1]);
            }
        }
        
        // 如果无法安全吃到食物，则选择离食物最远的安全方向
        if (!canFindFood || !canFindTail) {

            this.envMap = new Array(MAP.HEIGHT).fill(0).map(() => new Array(MAP.WIDTH).fill(0));
            for (let i=0; i<this.snakePos.length;i++){
                this.envMap[this.snakePos[i][1]][this.snakePos[i][0]] = 1;
            }

            let directions = [
                [1, 0],  // RIGHT
                [-1, 0], // LEFT
                [0, 1],  // DOWN
                [0, -1], // UP
            ];
            let maxDistance = -Infinity;
            let bestDirection = null;

            for (let [dx, dy] of directions) {
                let nextPos = [snakeHead[0] + dx, snakeHead[1] + dy];

                // 检查是否合法
                if (
                    nextPos[0] >= 0 && nextPos[0] < MAP.WIDTH &&
                    nextPos[1] >= 0 && nextPos[1] < MAP.HEIGHT &&
                    this.envMap[nextPos[1]][nextPos[0]] === 0
                ) {
                    // 模拟移动到该位置
                    let fakeSnakePos = JSON.parse(JSON.stringify(this.snakePos));
                    fakeSnakePos.unshift(nextPos);
                    fakeSnakePos.pop();

                    // 检查是否能回到尾巴
                    let fakeEnvMap = new Array(MAP.HEIGHT).fill(0).map(() => new Array(MAP.WIDTH).fill(0));
                    for (let i = 0; i < fakeSnakePos.length - 1; i++) {
                        fakeEnvMap[fakeSnakePos[i][1]][fakeSnakePos[i][0]] = 1;
                    }

                    let newSnakeTail = fakeSnakePos[fakeSnakePos.length - 1];
                    let findTailPath = astar(nextPos, newSnakeTail, fakeEnvMap);

                    if (findTailPath.length > 1) {
                        // 计算与食物的距离
                        let distance = Math.pow(nextPos[0] - this.foodPos[0], 2) + Math.pow(nextPos[1] - this.foodPos[1], 2);
                        if (distance > maxDistance) {
                            maxDistance = distance;
                            bestDirection = getNextDirection(snakeHead, nextPos);
                        }
                    }
                }
            }

            // 如果找到最佳方向，则返回
            if (bestDirection == null) {
                let snakeTail = this.snakePos[this.snakePos.length - 1];
                this.envMap = new Array(MAP.HEIGHT).fill(0).map(() => new Array(MAP.WIDTH).fill(0));
                for (let i=0; i<this.snakePos.length - 1;i++){
                    this.envMap[this.snakePos[i][1]][this.snakePos[i][0]] = 1;
                }
                let findTailPath = astar(snakeHead, snakeTail, this.envMap);
                if (findTailPath.length == 1) {
                    console.log(findTailPath)
                    return this.snakeDirection;
                }
                bestDirection = getNextDirection(snakeHead, findTailPath[1]);
            }
            return bestDirection;
        }

        // 如果所有方向都无法安全移动，则直接返回原方向
        return this.snakeDirection;

    }


}



// 添加背景粒子效果
class BackgroundParticles {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '-1';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 初始化粒子
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.x += p.speedX;
            p.y += p.speedY;
            
            // 边界检查
            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
            
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.update());
    }
}





const game = new SnakeGame();
const bgParticles = new BackgroundParticles();
bgParticles.update();
game.start()