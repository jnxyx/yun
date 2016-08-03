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

    // _drawCircle(pen, 80, 1);
    drawTree(pen, lineArgs);
    // pen.drawLine(pointB);
    // drawCircle(pen, pointA, len, angle_m, 0);
    // pen.drawLine(line);

    // initSelect(pen);
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

function drawTree(pen, lineArgs) {
    var args = lineArgs;
    if (args.len < 4) {
        return;
    }
    var point = args.point;
    var len = args.len;
    var angle = args.angle;
    var line = new Yun.Line(point, len, angle);
    pen.drawLine(line);

    var _len = 3 * len / 4;
    var upPoint = {},
        downPoint = {},
        upShare = 3 / 4,
        downShare = 1 / 2,
        upAngle = angle + Math.PI / 6,
        downAngle = angle - Math.PI / 6;
    upPoint.x = point.x + upShare * len * Math.cos(angle);
    upPoint.y = point.y + upShare * len * Math.sin(angle);
    downPoint.x = point.x + downShare * len * Math.cos(angle);
    downPoint.y = point.y + downShare * len * Math.sin(angle);

    var upLineArgs = {
        point: upPoint,
        len: _len,
        angle: upAngle
    };
    var downLineArgs = {
        point: downPoint,
        len: _len,
        angle: downAngle
    };
    drawTree(pen, upLineArgs);
    drawTree(pen, downLineArgs);
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
