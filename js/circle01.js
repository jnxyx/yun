window.onload = $;

function $() {
    var pen = new Yun.Pen('canvas_d');
    var pointA = new Yun.Point(0, 0);
    var len = 100 * Math.sqrt(2);
    var angle_m = Math.PI / 180;

    var origin = new Yun.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

    drawCircle(pen, pointA, len, angle_m, 0);
}



function drawCircle(pen, start, len, angle_m, share) {
    clean.call(pen);
    var line = new Yun.Line(start, len, share * angle_m);
    if (share < 3600000) {
        pen.drawLine(line);
        share += 5;
        window.draw = function() {
            drawCircle(pen, start, len, angle_m, share);
        };

        var a = setTimeout('draw();', 10);
    } else {
        return;
    }
}

function clean() {
    //	this.clean({
    //		x: -500,
    //		y: -300
    //	}, 1000, 600);
    this.clean({
        x: 0,
        y: 0
    }, 1000, 600);
}


