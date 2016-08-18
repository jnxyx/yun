window.onload = $;

function $() {
    var ctx = document.getElementById("canvas_d").getContext("2d");
    var pen = Yun.types.Pen(ctx);
    var pointB = Yun.types.Point(0, 80);
    var len = 100 * Math.sqrt(2);
    var angle_m = Math.PI / 180;

    var lineArgs = {
        point: pointB,
        len: len,
        angle: 270 * angle_m
    };
    var origin = Yun.types.Point(500, 300);
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
    var line = Yun.types.Line(point, len, angle);
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
    setTimeout(function() {
        drawTree(pen, upLineArgs);
        drawTree(pen, downLineArgs);
    }, 500);

    // drawTree(pen, upLineArgs);
    // drawTree(pen, downLineArgs);
}
