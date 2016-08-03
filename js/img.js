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
    var origin = new Yun.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');
    pen.setFillColor('grey');
    pen.setLineWidth(1);
    pen.setLineCap('round');

    getId('btn').onclick = function(){
        pen.drawImg({
            src:'../img/ditun.png'
            // ,
            // src:'../img/ditu.jpg',
            // imgWidth:300,
            // imgHeight:300
        });
    };
    setTimeout(function(){

        getId('btn').click();
    },1000);
}

function getId(id){
    return document.getElementById(id);
}
