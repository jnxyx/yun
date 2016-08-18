window.onload = $;

function $() {
    var ctx = document.getElementById("canvas_d").getContext("2d");
    var pen = Yun.types.Pen(ctx);

    var origin = Yun.types.Point(500, 300);
    pen.setCenter(origin);
    pen.setColor('grey');

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
