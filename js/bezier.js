window.onload = $;

function $() {
    var ctx = document.getElementById("canvas_d").getContext("2d");
    var pen = Yun.types.Pen(ctx);
    var pointA = Yun.types.Point(0, 0);
    var len = 100 * Math.sqrt(2);
    var angle_m = Math.PI / 180;

    var origin = Yun.types.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

    var controlPoint = { x: 20, y: 0 },
        startPoint = { x: 0, y: 0 },
        endPoint = { x: 20, y: 200 };
    pen.quadraticCurveTo(controlPoint, startPoint, endPoint);
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
