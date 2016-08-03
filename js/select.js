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

    initSelect(pen);
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

function initSelect(pen) {
    var center = new Yun.Point(-500, -300);
    pen.setCenter(center);
    var start,
        end;
    document.onmousedown = function(e) {
        clean.call(pen);
        start = {};
        console.log(e);
        start.x = e.pageX;
        start.y = e.pageY;
        document.getElementsByTagName('p')[0].innerHTML = e.pageX + ',' + e.pageY;
    }
    document.onmousemove = function(e) {
        clean.call(pen);
        end = {};
        end.x = e.pageX;
        end.y = e.pageY;
        document.getElementsByTagName('p')[1].innerHTML = e.pageX + ',' + e.pageY;
        if (start) {
            pen.drawRec(start, end);
        }
    }
    document.onmouseup = function(e) {
        start = null;
        clean.call(pen);
    }

}
