var leaf = {
    $: function() {
        var ctx = document.getElementById("canvas_d").getContext("2d");
        var pen = Yun.types.Pen(ctx);
        var origin = Yun.types.Point(500, 300);
        pen.setCenter(origin);
        pen.setColor('grey');

        leaf.drawLeaf(pen, 0);
    },
    drawLeaf: function(pen, offset) {
        var cos = Math.cos,
            sin = Math.sin,
            PI = Math.PI;
        var controlPoint = { x: 80 * cos(offset), y: -80 * sin(offset + PI / 4) },
            startPoint = { x: 0 * cos(offset), y: 0 * sin(offset + PI / 4) },
            endPoint = { x: 200 * cos(offset), y: -20 * sin(offset + PI / 4) };

        for (var i = 0; i <= 0; i++) {
            pen.quadraticCurveTo(controlPoint, startPoint, endPoint);
        }

        offset += PI / 180;
        if (offset < 2 * PI) {
            setTimeout(function() {
                leaf.clean.call(pen);
                leaf.drawLeaf(pen, offset);
            }, 1000 / 24);
        }
    },
    clean: function() {
        this.clean({
            x: -500,
            y: -300
        }, 1000, 600);

    },
    getStart: (function() {
        // 变量还未赋值
        console.log(window.leaf);
        return 1;
    })()
};
window.onload = window.leaf.$;
