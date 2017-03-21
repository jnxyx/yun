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

    myDrawType.Line = function(start, len, angle) {
        return new myLine(start, len, angle);
    };



    function myLine(start, len, angle) {

        var pointStart = start,
            pointEnd;

        var arg_len = arguments.length;

        if (!isPoint(arguments[0])) {
            Error(arguments[0].toString() + 'is not a point');
        }

        if (arg_len == 2 && isPoint(arguments[1])) {
            pointEnd = arguments[1];
        } else if (arg_len == 3 && isNumber(len) && isNumber(angle)) {
            pointEnd = new myPoint();
            pointEnd.x = pointStart.x + len * Math.cos(angle);
            pointEnd.y = pointStart.y + len * Math.sin(angle);
        } else {
            Error('arguments error');
        }

        this.pointStart = pointStart;
        this.pointEnd = pointEnd;

        return this;
    }



    global.Yun = yun;


}).call(this);
