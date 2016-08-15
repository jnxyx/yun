window.onload = $;

function $() {
    var pen = new Yun.Pen('canvas_d');

    var origin = new Yun.Point(500, 300);
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
