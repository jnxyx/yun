window.onload = $;

function $() {
    var ctx = document.getElementById("canvas_d").getContext("2d");
    var pen = Yun.types.Pen(ctx);
    var origin = Yun.types.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

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

