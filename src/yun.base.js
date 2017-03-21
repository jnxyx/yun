;
(function() {
    "use strict";

    var global = this,
        previous = global.yun;

    var yun = function(context) {

        var yun = this;
        this.canvas = context.canvas;
        this.ctx = context;

        return this;
    };

    var myDrawType = yun.types = {};

    var tools = yun.tools = {};

    global.Yun = yun;


}).call(this);
