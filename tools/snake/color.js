export default function createRainbow(num){
    var colors = [];
    for(var i = 0; i < num; i++){
        var h = i / num * (330/360);
        var s = 1;
        var l = 0.5;
        var rgb = hslToRgb(h, s, l);
        colors.push(rgb);
    }
    return colors;
}


function hslToRgb(h, s, l) {
    var r, g, b;

    if(s == 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}