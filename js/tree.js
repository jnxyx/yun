window.onload = $;

function $() {
    var pen = new Yun.Pen('canvas_d');
    var pointB = new Yun.Point(0, 80);
    var len = 100 * Math.sqrt(2);
    var angle_m = Math.PI / 180;

    var lineArgs = {
        point: pointB,
        len: len,
        angle: 270 * angle_m
    };
    var origin = new Yun.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

    drawTree(pen, lineArgs);
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
    setTimeout(function(){
	    drawTree(pen, upLineArgs);
	    drawTree(pen, downLineArgs);
    },500);

    // drawTree(pen, upLineArgs);
    // drawTree(pen, downLineArgs);
}


