window.onload = $;

function $() {
    var ctx = document.getElementById("canvas_d").getContext("2d");
    var pen = Yun.types.Pen(ctx);
    var origin = Yun.types.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

    drawLeaf(pen, 0);
}

function drawLeaf(pen, offset) {
    var cos = Math.cos,
        sin = Math.sin,
        PI = Math.PI;
    var controlPoint = { x: 80 * cos(offset), y: -80 * sin(offset + PI / 4) },
        startPoint = { x: 0 * cos(offset), y: 0 * sin(offset + PI / 4) },
        endPoint = { x: 200 * cos(offset), y: -20 * sin(offset + PI / 4) };

    for (var i = 0; i <= 0; i++) {
        pen.quadraticCurveTo(controlPoint, startPoint, endPoint);
    }

    offset += PI / 180;
    if (offset < 2 * PI) {
        setTimeout(function() {
            clean.call(pen);
            drawLeaf(pen, offset);
        }, 1000 / 24);
    }
}

function clean() {
     this.clean({
         x: -500,
         y: -300
     }, 1000, 600);
   
}
