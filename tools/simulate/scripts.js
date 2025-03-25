var mousex,mousey;
var canvas = document.getElementById("tutorial");
var canvas2 = document.getElementById("buttom");
var e2 = document.getElementById("epsilon2");
var m2 = document.getElementById("mu2");
var ctx = canvas.getContext("2d");
var texti = document.getElementById("thetai");
var textr = document.getElementById("thetar");
var textt = document.getElementById("thetat");

var text_tao1 = document.getElementById("tao1");
var text_ga1 = document.getElementById("ga1");
var text_tao2 = document.getElementById("tao2");
var text_ga2 = document.getElementById("ga2");
//背景
var ctx2 = canvas2.getContext("2d");
if (canvas.getContext) {
    ctx2.beginPath();
    ctx2.setLineDash([1,0])
    ctx2.moveTo(400, 0);
    ctx2.lineTo(400, 600);
    ctx2.closePath();
    ctx2.stroke();
    ctx2.beginPath();
    ctx2.setLineDash([5,10])
    ctx2.moveTo(0, 300);
    ctx2.lineTo(800, 300);
    ctx2.stroke();  
    ctx2.fillStyle = "rgba(0,0,0,0.3)";
    ctx2.fillRect(400, 0, 400, 600);
    ctx2.font = "14px Comic Sans MS";
    ctx2.fillStyle = "rgba(0,0,0,1)";
    ctx2.fillText("介质1", 15, 30);
    ctx2.fillText("介质2", 415, 30);
}

let isdraw = false;


canvas.addEventListener('mousedown', (event) => {
    isdraw = true;
});

canvas.addEventListener('mouseup', (event) => {
    isdraw = false;
    draw(event);
    clear();
});

canvas.addEventListener('mousemove', (event) => {
    if (isdraw){
        clear();
        draw(event);
    }

        
});

// 触摸
canvas.addEventListener('touchstart', (event) => {
    isdraw = true;
});

canvas.addEventListener('touchend', (event) => {
    isdraw = false;
    clear();
});

canvas.addEventListener('touchmove', (event) => {
    if (isdraw){
        clear();
        var html = document.getElementsByTagName('html')[0];
        var width = html.clientWidth;
        var height =  html.clientHeight;

        var isresize = width > height ? 0:1;
        console.log(isresize);
        const rect = canvas.getBoundingClientRect();
        var x,y;
        console.log(event.targetTouches[0].clientX);
        if (isresize){
            y =  2*(width  -  event.targetTouches[0].clientX) - width/2;
            x =  2*event.targetTouches[0].clientY - height/2  ;
        } else {
            x = event.targetTouches[0].clientX - rect.left;
            y = event.targetTouches[0].clientY - rect.top;
        }

        drawonphone(event,x,y);
    }
});


function clear(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    texti.textContent = `入射角: `;
    textr.textContent = `反射角:`;
    textt.textContent = `折射角:`;
    text_tao1.innerHTML = `<p id="tao1">τ <sub>⊥</sub>:</p>`;
    text_ga1.innerHTML = `<p id="ga1">Γ <sub>⊥</sub>: </p>`;
    text_tao2.innerHTML = `<p id="tao2">τ <sub>//</sub>: </p>`;
    text_ga2.innerHTML = `<p id="ga2">Γ <sub>//</sub>:</p>`;
}

function incostheta(x,y){
    var b = Math.sqrt((400-x)**2+(300-y)**2);
    var c = 400;
    var a = Math.sqrt(x**2+(y-300)**2)
    return (b**2 + c**2 - a**2)/(2*b*c)
}

function cal_rxy(thetai){
    var a = new Array();
    var c = 400/thetai;
    var y = 300-(c**2-400**2)**(1/2)
    a[0] = 0;
    a[1] = y;
    return a;
}

function draw(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    var thetai = incostheta(x,y);
    var mu1 = 1;
    var mu2 = document.getElementById("mu2").value;
    var e1 = 1;
    var e2 = document.getElementById("epsilon2").value;
    var linw = 10;
    mousex = x;
    mousey = y;
    console.log(`Clicked at: (${x}, ${y})`);
    console.log(thetai);
    ctx.beginPath();
    ctx.setLineDash([1,0])
    ctx.moveTo(x, y);
    ctx.lineTo(400, 300);
    ctx.closePath();
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = linw;
    ctx.stroke();

    if ((mu1 != '') && (mu2 != '') && (e1 != '') && (e2 != '')){
        console.log(`(${mu1},${mu2},${e1},${e2})`)
        var mu1value = mu1;
        var mu2value = Number(mu2);
        var e1value = e1;
        var e2value = Number(e2);
        var sint = Math.sqrt(1-thetai**2)/Math.sqrt(e2value*mu2value);
        var cosi = thetai;
        var sini = Math.sqrt(1-cosi**2);
        var cost = Math.sqrt(1-sint**2);
        var mu0 = 4*Math.PI*10e-7;
        var e0 = 1/(36*Math.PI)*10e-9;
        var eta1 = Math.sqrt((e0*e2value)/(mu0*mu2value));
        var eta2 = Math.sqrt((e0*e1value)/(mu0*mu1value));
        // 垂直极化波
        //反射系数
        var gamma1 = (eta2*cosi-eta1*cost)/(eta2*cosi+eta1*cost);
        //透射系数
        var tao1 = (2*eta2*cosi)/(eta2*cosi + eta1*cost);
        // 水平极化波
        var gamma2 = (eta1*cosi-eta2*cost)/(eta1*cosi+eta2*cost);
        var tao2 = (2*eta2*cosi)/(eta1*cosi + eta2*cost);

        var tani = sini/cosi;
        var thei = Math.atan(tani);
        var thet = Math.asin(sint);


        if (x < 400){
            if (e2value * mu2value != 1 && e2value*mu2value >0){
                texti.textContent = `入射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textr.textContent = `反射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textt.textContent = `折射角: ${(thet/(Math.PI)*180).toFixed(1)}°`;
            } else if(e2value*mu2value < 0) {
                texti.textContent = `入射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textr.textContent = `反射角: NaN`;
                textt.textContent = `折射角: NaN`;       
            } else {
                texti.textContent = `入射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textr.textContent = `反射角: NaN`;
                textt.textContent = `折射角: ${(thet/(Math.PI)*180).toFixed(1)}°`; 
            }
    
    
            text_tao1.innerHTML = `<p id="tao1">τ <sub>⊥</sub>: ${tao1.toFixed(3)}</p>`;
            text_ga1.innerHTML = `<p id="ga1">Γ <sub>⊥</sub>: ${gamma1.toFixed(3)}</p>`;
            text_tao2.innerHTML = `<p id="tao2">τ <sub>//</sub>: ${tao2.toFixed(3)}</p>`;
            text_ga2.innerHTML = `<p id="ga2">Γ <sub>//</sub>: ${gamma2.toFixed(3)}</p>`;
        }


        console.log(`${gamma1},${tao1}`)

        // 介电常数和磁导率均为正值
        if (e2value * mu2value > 0){
            
            var rx,ry,tx,ty; 
            // 媒质从介质1入射
            if (x < 400){
                // 第一象限
                if (e2value > 0){
                    if (y>=300){
                        // 反射波
                        rx = cal_rxy(thetai)[0];
                        ry = cal_rxy(thetai)[1];
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(rx, ry);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                        //折射波
                        
                        tx = 800;
                        ty = 300 - 400/Math.sqrt(1/sint**2-1);
                        console.log(ty);
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(tx, ty);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                    } else{
                        // 反射波
                        rx = cal_rxy(thetai)[0];
                        ry = 600 - cal_rxy(thetai)[1];
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(rx, ry);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                        //折射波
                        
                        tx = 800;
                        ty = 300 + 400/Math.sqrt(1/sint**2-1);
                        console.log(ty);
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(tx, ty);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                    }
                } else {
                // 第三象限介质
                if (y>=300){
                    // 反射波
                    rx = cal_rxy(thetai)[0];
                    ry = cal_rxy(thetai)[1];
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(rx, ry);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                    //折射波
                    
                    tx = 800;
                    ty = 300 + 400/Math.sqrt(1/sint**2-1);

                    console.log(ty);
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(tx, ty);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                } else{
                    // 反射波
                    rx = cal_rxy(thetai)[0];
                    ry = 600 - cal_rxy(thetai)[1];
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(rx, ry);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                    //折射波
                    
                    tx = 800;
                    ty = 300 - 400/Math.sqrt(1/sint**2-1);
                    console.log(ty);
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(tx, ty);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                }
                }
            }

        }
    }
}


function drawonphone(event,x,y){
    var thetai = incostheta(x,y);
    var mu1 = 1;
    var mu2 = document.getElementById("mu2").value;
    var e1 = 1;
    var e2 = document.getElementById("epsilon2").value;
    var linw = 10;
    mousex = x;
    mousey = y;
    console.log(`touched at: (${x}, ${y})`);
    console.log(thetai);
    ctx.beginPath();
    ctx.setLineDash([1,0])
    ctx.moveTo(x, y);
    ctx.lineTo(400, 300);
    ctx.closePath();
    ctx.strokeStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = linw;
    ctx.stroke();

    if ((mu1 != '') && (mu2 != '') && (e1 != '') && (e2 != '')){
        console.log(`(${mu1},${mu2},${e1},${e2})`)
        var mu1value = mu1;
        var mu2value = Number(mu2);
        var e1value = e1;
        var e2value = Number(e2);
        var sint = Math.sqrt(1-thetai**2)/Math.sqrt(e2value*mu2value);
        var cosi = thetai;
        var sini = Math.sqrt(1-cosi**2);
        var cost = Math.sqrt(1-sint**2);
        var mu0 = 4*Math.PI*10e-7;
        var e0 = 1/(36*Math.PI)*10e-9;
        var eta1 = Math.sqrt((e0*e2value)/(mu0*mu2value));
        var eta2 = Math.sqrt((e0*e1value)/(mu0*mu1value));
        // 垂直极化波
        //反射系数
        var gamma1 = (eta2*cosi-eta1*cost)/(eta2*cosi+eta1*cost);
        //透射系数
        var tao1 = (2*eta2*cosi)/(eta2*cosi + eta1*cost);
        // 水平极化波
        var gamma2 = (eta1*cosi-eta2*cost)/(eta1*cosi+eta2*cost);
        var tao2 = (2*eta2*cosi)/(eta1*cosi + eta2*cost);

        var tani = sini/cosi;
        var thei = Math.atan(tani);
        var thet = Math.asin(sint);


        if (x < 400){
            if (e2value * mu2value != 1 && e1value*e2value >0){
                texti.textContent = `入射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textr.textContent = `反射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textt.textContent = `折射角: ${(thet/(Math.PI)*180).toFixed(1)}°`;
            } else if(e2value*mu2value < 0) {
                texti.textContent = `入射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textr.textContent = `反射角: NaN`;
                textt.textContent = `折射角: NaN`;       
            } else {
                texti.textContent = `入射角: ${(thei/(Math.PI)*180).toFixed(1)}°`;
                textr.textContent = `反射角: NaN`;
                textt.textContent = `折射角: ${(thet/(Math.PI)*180).toFixed(1)}°`; 
            }
    
    
            text_tao1.innerHTML = `<p id="tao1">τ <sub>⊥</sub>: ${tao1.toFixed(3)}</p>`;
            text_ga1.innerHTML = `<p id="ga1">Γ <sub>⊥</sub>: ${gamma1.toFixed(3)}</p>`;
            text_tao2.innerHTML = `<p id="tao2">τ <sub>//</sub>: ${tao2.toFixed(3)}</p>`;
            text_ga2.innerHTML = `<p id="ga2">Γ <sub>//</sub>: ${gamma2.toFixed(3)}</p>`;
        }


        console.log(`${gamma1},${tao1}`)

        // 介电常数和磁导率均为正值
        if (e2value * mu2value > 0){
            
            var rx,ry,tx,ty; 
            // 媒质从介质1入射
            if (x < 400){
                // 第一象限
                if (e2value > 0){
                    if (y>=300){
                        // 反射波
                        rx = cal_rxy(thetai)[0];
                        ry = cal_rxy(thetai)[1];
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(rx, ry);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                        //折射波
                        
                        tx = 800;
                        ty = 300 - 400/Math.sqrt(1/sint**2-1);
                        console.log(ty);
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(tx, ty);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                    } else{
                        // 反射波
                        rx = cal_rxy(thetai)[0];
                        ry = 600 - cal_rxy(thetai)[1];
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(rx, ry);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                        //折射波
                        
                        tx = 800;
                        ty = 300 + 400/Math.sqrt(1/sint**2-1);
                        console.log(ty);
                        ctx.beginPath();
                        ctx.moveTo(400, 300);
                        ctx.lineTo(tx, ty);
                        ctx.closePath();
                        ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                        ctx.lineWidth = linw;
                        ctx.stroke();
                    }
                } else {
                // 第三象限介质
                if (y>=300){
                    // 反射波
                    rx = cal_rxy(thetai)[0];
                    ry = cal_rxy(thetai)[1];
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(rx, ry);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                    //折射波
                    
                    tx = 800;
                    ty = 300 + 400/Math.sqrt(1/sint**2-1);

                    console.log(ty);
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(tx, ty);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                } else{
                    // 反射波
                    rx = cal_rxy(thetai)[0];
                    ry = 600 - cal_rxy(thetai)[1];
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(rx, ry);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(255,0,0,${Math.abs(gamma1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                    //折射波
                    
                    tx = 800;
                    ty = 300 - 400/Math.sqrt(1/sint**2-1);
                    console.log(ty);
                    ctx.beginPath();
                    ctx.moveTo(400, 300);
                    ctx.lineTo(tx, ty);
                    ctx.closePath();
                    ctx.strokeStyle = `rgba(0,0,255,${Math.abs(tao1)})`;
                    ctx.lineWidth = linw;
                    ctx.stroke();
                }
                }
            }

        }
    }
}