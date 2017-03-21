;
(function() {
    "use strict";

    var global = this,
        previous = global.yun;

    var yun = previous || function(context) {

        var yun = this;
        this.canvas = context.canvas;
        this.ctx = context;

        return this;
    };

    var myDrawType = yun.types = {};

    var tools = yun.tools = {};

    var point = tools.point = {
            x: 0,
            y: 0
        },

        isNull = tools.isNull = function(obj) {
            if (typeof obj === 'undefined') {
                return true;
            } else if (obj == null) {
                return true;
            } else if (typeof obj === 'string' && obj == '') {
                return true;
            }
            return false;
        },

        isNumber = tools.isNumber = function(num) {
            return 'number' === typeof num;
        },

        isPoint = tools.isPoint = function(point) {
            if (isNull(point)) {
                Error('the argument is not a point');
                return false;
            } else {
                if (!isNumber(point.x) || !isNumber(point.y)) {
                    Error('the argument is not a point');
                    return false;
                }
            }
            return true;
        },

        Error = tools.Error = function(ex) {
            throw (ex);
        };

    myDrawType.Point = function(x, y) {
        return new myPoint(x, y);
    };

    function myPoint(x, y) {

        var args_len = arguments.length;

        if (args_len == 1 && !isNull(arguments[0]) && isPoint(arguments[0])) {
            x = arguments[0].x;
            y = arguments[0].y;
        } else if (args_len == 2 && isNumber(x) && isNumber(y)) {

        } else if (args_len == 0) {
            x = point.x;
            y = point.y;
        } else {
            Error('arguments error');
        }

        this.x = x;
        this.y = y;

        return this;
    }

    global.Yun = yun;


}).call(this);
