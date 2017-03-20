window.onload = $;

function $() {
    var ctx = document.getElementById("canvas_d").getContext("2d");
    var pen = Yun.types.Pen(ctx);
    var origin = Yun.types.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

    var controlPoint = { x: 200, y: 0 },
        controlPoint2 = { x: 20, y: 20 },
        startPoint = { x: 0, y: 0 },
        endPoint = { x: 20, y: 200 };
    // pen.quadraticCurveTo(controlPoint, startPoint, endPoint);
    // pen.bezierCurveTo(controlPoint, controlPoint2, startPoint, endPoint);

    drawBesier(pen);
}

function drawBesier(pen) {
    var controlPoint = { x: 0, y: 20 },
        startPoint = { x: 0, y: 0 },
        endPoint = { x: 20, y: 0 };

    for (var i = 0; i <= 10; i++) {
        pen.quadraticCurveTo(controlPoint, startPoint, endPoint);
        startPoint.x = endPoint.x;
        startPoint.y = endPoint.y;
        endPoint.x += 20;
        controlPoint.x += 20;
        controlPoint.y = -controlPoint.y;
    }
}

function clean() {
    //  this.clean({
    //      x: -500,
    //      y: -300
    //  }, 1000, 600);
    this.clean({
        x: 0,
        y: 0
    }, 1000, 600);
}
