window.onload = $;

function $() {
    var ctx = document.getElementById("canvas_d").getContext("2d");
    var pen = Yun.types.Pen(ctx);
    var origin = Yun.types.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

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
    var center = Yun.types.Point(-500, -300);
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
