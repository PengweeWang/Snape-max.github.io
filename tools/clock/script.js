import { MiniCanvas } from './minicanvas.js';



var dom = document.getElementById("canvas");
var pen = new MiniCanvas(dom);
pen.set_hw(window.innerHeight, window.innerWidth);
var clock_number = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
var h = 0, m = 0, s = 0, day = 0;
var clock_radius, cx, cy, font_size;

var clock_color;
var clock_color_night = {
    background : "#06080f",
    edge : "#464d5b",
    face : "#0e1729", 
    hands_s : "#fb923a",
    hands_m2h : "#c8cbd0",
    number: "#c8cbd0",
    text : "#fb923a",
    center: "c8cbd0",
}
var clock_color_day = {
    background : "#f2f7ff",
    edge : "#c3c9d2",
    face : "#ffffff",
    hands_s : "#fb923a",
    hands_m2h : "#394e6a",
    number: "#394e6a",
    text : "#fb923a",
    center: "#394e6a",
}

clock_color = clock_color_day;


function init_theme(){
    if (h >= 6 && h < 18){
        clock_color = clock_color_day;
    } else {
        clock_color = clock_color_night;
    }
}

function init_pram(){
    get_time();
    clock_radius = Math.min(pen.width, pen.height)*0.4;
    if (pen.width < pen.height){
        clock_radius = pen.width*0.45;
    }
    cx = pen.width/2, cy = pen.height/2;
    font_size = Math.max(pen.height*0.07, pen.width/3/12)
}

function get_time() {
    var date = new Date();
    h = date.getHours();
    m = date.getMinutes();
    s = date.getSeconds();
    day = date.getDate();
}

function clock_hands(cx, cy, h, m, s, clock_radius){
    var h_angle = h*Math.PI/6 + m*Math.PI/360 + s*Math.PI/21600 - Math.PI/2;
    var m_angle = m*Math.PI/30 + s*Math.PI/1800 - Math.PI/2;
    var s_angle = s*Math.PI/30 - Math.PI/2;
    var h_len = clock_radius*0.4;
    var m_len = clock_radius*0.7;
    var s_len = clock_radius;
    pen.set_color(clock_color.hands_m2h)
    pen.set_line_width(9);
    pen.line(cx, cy, cx + h_len*Math.cos(h_angle), cy + h_len*Math.sin(h_angle));
    pen.line(cx, cy, cx + m_len*Math.cos(m_angle), cy + m_len*Math.sin(m_angle));
    pen.set_line_width(3);
    pen.set_color(clock_color.hands_s)
    pen.line(cx, cy, cx + s_len*Math.cos(s_angle), cy + s_len*Math.sin(s_angle), "butt");
}

function time_core(){
    s = (s + 1) % 60;
    m = (m + (s==0)) % 60;
    h = (h + (m==0 && s==0)) % 12;
    if (s == 0) {
        get_time();
    }
}


function draw_basic() {
    pen.set_background(clock_color.background)
    // pen.set_text("Clock Online", window.innerWidth/2 - font_size/2*5.5, font_size , "#c8cbd0", font_size)
    pen.set_color(clock_color.edge)
    pen.set_line_width(2)
    pen.circle(cx, cy, clock_radius, clock_color.face)
    pen.set_color(clock_color.edge)
    for(var i=0; i<60; i++){
        var angle = i*Math.PI/30;
        var x1 = cx + clock_radius*Math.cos(angle);
        var y1 = cy + clock_radius*Math.sin(angle);
        var x2 = cx + (clock_radius-5)*Math.cos(angle);
        var y2 = cy + (clock_radius-5)*Math.sin(angle);
        pen.line(x1, y1, x2, y2, "butt")
    }
    for(var i=0; i<12; i++){
        var angle = i*Math.PI/6;
        var x1 = cx + clock_radius*Math.cos(angle);
        var y1 = cy + clock_radius*Math.sin(angle);
        var x2 = cx + (clock_radius-8)*Math.cos(angle);
        var y2 = cy + (clock_radius-8)*Math.sin(angle);
        var number_size = font_size/3;
        var x3 = cx + (clock_radius-number_size*2)*Math.cos(angle - Math.PI/360);
        var y3 = cy + (clock_radius-number_size*2)*Math.sin(angle - Math.PI/360);
        pen.set_line_width(4)
        pen.line(x1, y1, x2, y2, "butt")
        pen.set_text(clock_number[(i+2)%12], x3 - number_size / 4, y3 + number_size / 3, clock_color.number,number_size)
    }
    pen.set_text(day, cx + clock_radius /3 , cy + number_size/2, clock_color.text, number_size + 3)
    clock_hands(cx, cy, h, m, s, clock_radius)
    pen.set_line_width(2)
    pen.set_color(clock_color.face)
    pen.circle(cx, cy, 6, clock_color.hands_m2h)
    

}


init_pram();
init_theme();
draw_basic();

function resize(){
    pen.set_hw(window.innerHeight, window.innerWidth);
    init_pram();
    draw_basic();
}

function change_theme(){
    clock_color = (clock_color == clock_color_day) ? clock_color_night : clock_color_day;
}

window.addEventListener("resize", resize)

setInterval(function(){
    time_core();
    draw_basic();
}, 1000)


dom.addEventListener("click", function(){
    change_theme();
    draw_basic();
})




















































