window.onload = $;

function $() {
    var pen = new Yun.Pen('canvas_d');
    var point = new Yun.Point(100, 100);
    var pointA = new Yun.Point(0, 0);
    var pointB = new Yun.Point(0, 80);
    var len = 100 * Math.sqrt(2);
    var angle_m = Math.PI / 180;
    var line = new Yun.Line(pointB, len, 90 * angle_m);

    var lineArgs = {
        point: pointB,
        len: len,
        angle: 270 * angle_m
    };
    pen.setColor('#000000');
    //		pen.drawLine(point);
    var origin = new Yun.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');
    pen.setFillColor('grey');
    pen.setLineWidth(1);
    pen.setLineCap('round');

    _drawCircle(pen, 80, 1);

}

function _drawCircle(pen, r, direction) {
    if (r == 100) {
        direction = 0;
    } else if (r == 8) {
        direction = 1;
    }
    if (!!direction) {
        r++;
    } else {
        r--;
    }
    setTimeout(function() {
        clean.call(pen);
        pen.drawCircle(r);
        _drawCircle(pen, r, direction);
    }, 4);
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

