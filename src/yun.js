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

    var Point = myDrawType.Point = function(x, y) {
            return new myPoint(x, y);
        },

        Line = myDrawType.Line = function(start, len, angle) {
            return new myLine(start, len, angle);
        },

        Pen = myDrawType.Pen = function(context) {
            return new myPen(context);
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

    function myPen(context) {
        this.canvas = context.canvas;
        this.context = context;
        this.point = {
            x: 0,
            y: 0
        };

        return this;
    }

    var proto = myPen.prototype = {

        constructor: {},

        setPoint: function(point) {
            if (isPoint(point)) {
                this.point = point;
            }
        },

        getPoint: function() {
            return this.point;
        },

        setFillColor: function(color) {
            this.fillStyle = color;
            this.context.fillStyle = this.fillStyle;
        },

        getFillColor: function() {
            return this.fillStyle;
        },

        setColor: function(color) {
            this.strokeStyle = color;
            this.context.strokeStyle = this.strokeStyle;
        },

        getColor: function() {
            return this.strokeStyle;
        },

        setLineWidth: function(width) {
            this.lineWidth = width;
            this.context.lineWidth = this.lineWidth;
        },

        getLineWidth: function() {
            return this.lineWidth;
        },

        setLineCap: function(dis) {
            this.lineCap = dis;
            this.context.lineCap = this.lineCap;
        },

        getLineCap: function() {
            return this.lineCap;
        },

        setCenter: function(point) {
            if (isPoint(point)) {
                this.context.translate(point.x, point.y);
                var point = new myPoint({
                    x: 0,
                    y: 0
                });
                this.setPoint(point);
            }
        },

        setCoordinate: function(description) {
            this.context.transform();
        },

        clean: function(point, width, height) {
            if (isPoint(point) && isNumber(width) && isNumber(height)) {
                var ctx = this.context;
                ctx.clearRect(point.x, point.y, width, height);
            } else {
                return;
            }
        }

    }

    // pen.extend(ctx.__proto__)

    // ---   图形绘制    --- 

    // 圆心 ，半径
    proto.drawCircle = function(point, r) {

        var ctx = this.context;
        point = this.point;

        if (arguments.length == 1 && isNumber(arguments[0])) {
            r = arguments[0];
        } else if (arguments.length == 2 && isPoint(arguments[0]) && isNumber(arguments[1])) {
            point = arguments[0];
            r = arguments[1];
        } else {
            return;
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y, r, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // 重构
    // 线
    // 起点 ，终点
    proto.drawLine = function(pointStart, pointEnd) {

        if (arguments.length == 1) {

            if (arguments[0] instanceof myPoint) {
                pointStart = this.point;
                pointEnd = arguments[0];
            } else if (arguments[0] instanceof myLine) {
                pointStart = arguments[0].pointStart;
                pointEnd = arguments[0].pointEnd;
            } else {
                Error('drawline fail');
            }

        } else if (arguments.length == 2) {

            pointStart = arguments[0];
            pointEnd = arguments[1];
        } else {

            Error('drawline fail');
        }

        if (isPoint(pointStart) && isPoint(pointEnd)) {

            var ctx = this.context;
            ctx.beginPath();
            ctx.moveTo(pointStart.x, pointStart.y);
            ctx.lineTo(pointEnd.x, pointEnd.y);
            ctx.stroke();
            this.setPoint(pointEnd);
        }
    }

    // 起点 ，对角点
    proto.drawRec = function(start, end) {
        var len = arguments.length;
        var ctx = this.context;

        if (len == 1 && isPoint(start)) {
            end = start;
            start = this.point;
        } else if (len == 2) {
            if (isPoint(start) && isPoint(end)) {
                start = start;
                end = end;
            } else if (isNumber(start), isNumber(end)) {
                var endN = {};
                endN.x = start;
                endN.y = end;
                end = endN;
                start = this.point;
            } else {
                return;
            }
        } else {
            return;
        }

        ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
    }

    // 二次贝塞尔曲线 
    // 控制点、起点、终点
    proto.quadraticCurveTo = function(controlPoint, startPoint, endPoint) {
        var ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, endPoint.x, endPoint.y);
        ctx.stroke();
    }

    // 三次贝塞尔曲线 
    // 控制点1、控制点2、起点、终点
    proto.bezierCurveTo = function(controlPoint1, controlPoint2, startPoint, endPoint) {
        var ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.quadraticCurveTo(controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, endPoint.x, endPoint.y);
        ctx.stroke();
    }

    // 画图
    // 图片地址 ， 位置点 ， 宽度 ， 高度
    proto.drawImg = function(options) {
        var self = this;
        var myImg = new Image();
        // var img = document.createElement('img');
        myImg.src = options.src;

        options = {
            src: options.src || '',
            cutStart: options.cutStart || { x: 0, y: 0 },
            cutWidth: options.cutWidth || myImg.width,
            curHeight: options.curHeight || myImg.height,
            setStart: options.setStart || { x: 0, y: 0 },
            imgWidth: options.imgWidth || myImg.width,
            imgHeight: options.imgHeight || myImg.height,
        };

        console.log(myImg);

        myImg.onload = function() {
            console.log(myImg);
            var ctx = self.context;
            ctx.drawImage(
                myImg,
                options.cutStart.x,
                options.cutStart.y,
                options.cutWidth,
                options.curHeight,
                options.setStart.x,
                options.setStart.y,
                options.imgWidth,
                options.imgHeight
            );
            ctx.stroke();
            ctx.restore();
        };
    }

    global.Yun = yun;


}).call(this);
