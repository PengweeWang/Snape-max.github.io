/**
 * Canvas类提供了一系列在HTML5 Canvas元素上进行绘图的方法
 */
export class MiniCanvas {
    /**
     * 构造函数，初始化Canvas对象
     * @param {HTMLElement} dom - Canvas DOM元素
     * @throws {Error} 如果传入的DOM元素无效，则抛出错误
     */
    constructor(dom) {
        if (!dom || !dom.getContext) {
            throw new Error('Invalid DOM element');
        }
        this.dom = dom;
        this.ctx = dom.getContext("2d");
        this.width = dom.width;
        this.height = dom.height;
    }

    set_background(color) {
        // 设置背景颜色
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * 设置元素的高和宽
     * 
     * @param {number} height - 元素的高度
     * @param {number} width - 元素的宽度
     */
    set_hw(height, width) {
        // 设置元素的高度和宽度
        this.dom.height = height;
        this.dom.width = width;
        this.width = width;
        this.height = height;
    }

    /**
     * 清除Canvas上的绘图区域
     * @param {number} [x] - 清除区域的起始x坐标
     * @param {number} [y] - 清除区域的起始y坐标
     * @param {number} [w] - 清除区域的宽度
     * @param {number} [h] - 清除区域的高度
     */
    clear(x, y, w, h) {
        if (x === undefined && y === undefined && w === undefined && h === undefined) {
            this.ctx.clearRect(0, 0, this.width, this.height);
        } else {
            this.ctx.clearRect(x, y, w, h);
        }
    }

    /**
     * 设置绘图颜色
     * @param {string} color - 绘图的颜色，用于填充和描边
     */
    set_color(color) {
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;
    }

    /**
     * 设置线条宽度
     * @param {number} width - 线条的宽度
     * @throws {Error} 如果传入的宽度无效（非数字或负数），则抛出错误
     */
    set_line_width(width) {
        if (typeof width !== 'number' || width < 0) {
            throw new Error('Invalid line width');
        }
        this.ctx.lineWidth = width;
    }

    /**
     * 绘制直线
     * @param {number} x1 - 直线的起始x坐标
     * @param {number} y1 - 直线的起始y坐标
     * @param {number} x2 - 直线的结束x坐标
     * @param {number} y2 - 直线的结束y坐标
     * @throws {Error} 如果任何坐标无效，则抛出错误
     */
    line(x1, y1, x2, y2, lineCap='round') {
        if (typeof x1 !== 'number' || typeof y1 !== 'number' || typeof x2 !== 'number' || typeof y2 !== 'number') {
            throw new Error('Invalid coordinates');
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineCap = lineCap;
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    /**
     * 绘制弧线
     * @param {number} x - 弧线的中心x坐标
     * @param {number} y - 弧线的中心y坐标
     * @param {number} r - 弧线的半径
     * @param {number} s - 弧线的起始角度，以弧度计
     * @param {number} e - 弧线的结束角度，以弧度计
     * @param {boolean} [anticlockwise=false] - 是否逆时针绘制弧线，默认为顺时针
     * @throws {Error} 如果任何参数无效，则抛出错误
     */
    arc(x, y, r, s, e, anticlockwise = false) {
        if (typeof x !== 'number' || typeof y !== 'number' || typeof r !== 'number' || typeof s !== 'number' || typeof e !== 'number') {
            throw new Error('Invalid parameters');
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, s, e, anticlockwise);
        this.ctx.stroke();
    }

    /**
     * 绘制圆形
     * @param {number} x - 圆心的x坐标
     * @param {number} y - 圆心的y坐标
     * @param {number} r - 圆的半径
     * @throws {Error} 如果任何参数无效，则抛出错误
     */
    circle(x, y, r, fill_color=null) {
        if (typeof x !== 'number' || typeof y !== 'number' || typeof r !== 'number') {
            throw new Error('Invalid parameters');
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, Math.PI * 2);
        if(fill_color!=null){
            this.ctx.fillStyle = fill_color;
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    /**
     * 绘制矩形
     * @param {number} x - 矩形的起始x坐标
     * @param {number} y - 矩形的起始y坐标
     * @param {number} w - 矩形的宽度
     * @param {number} h - 矩形的高度
     * @throws {Error} 如果任何参数无效，则抛出错误
     */
    rect(x, y, w, h, fill_color=null) {
        if (typeof x !== 'number' || typeof y !== 'number' || typeof w !== 'number' || typeof h !== 'number') {
            throw new Error('Invalid parameters');
        }
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        if(fill_color!=null){
            this.ctx.fillStyle = fill_color;
            this.ctx.fill();
        }
        this.ctx.stroke();
    }

    set_text(text, x, y, color, font_size) {
        // 设置文本样式
        this.ctx.fillStyle = color;
        this.ctx.font = `${font_size}px Arial`;
        this.ctx.fillText(text, x, y);
    }
}
