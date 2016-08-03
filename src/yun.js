;
(function(win, doc) {
	"use strict";

	var point = {
		x: 0,
		y: 0
	}

	function getCanvasElement(canvasId) {
		return doc.getElementById(canvasId);
	}

	function isNull(obj) {
		if (typeof obj === 'undefined') {
			return true;
		} else if (obj == null) {
			return true;
		} else if (typeof obj === 'string' && obj == '') {
			return true;
		}
		return false;
	}

	function isNumber(num) {
		return 'number' === typeof num;
	}

	function Error(ex) {
		throw (ex);
	}

	function isPoint(point) {
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
	}

	//重载
	//无参时默认零点
	//参数只有一个时，采取点判断
	//参数个数两个时，前一个参数读取x值，后一个参数读取y值
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

	//重载
	//起点、终点
	//起点、长度，角度
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

	var myDrawType = {
		Point: function(x, y) {
			return new myPoint(x, y);
		},
		Line: function(start, len, angle) {
			return new myLine(start, len, angle);
		},
		Pen: function(canvasId) {
			return new myPen(canvasId);
		}
	}

	function myPen(canvasId) {
		canvasId = canvasId || 'canvas_d';
		this.canvas = getCanvasElement(canvasId);
		this.context = this.canvas.getContext("2d");
		this.point = {
			x: 0,
			y: 0
		};

		//		this.fillStyle = '#000000';
		//		this.strokeStyle = '#000000';

		return this;
	}

	var pro = myPen.prototype;
	pro.constructor = {};
	pro.setPoint = function(point) {
		if (isPoint(point)) {
			this.point = point;
		}
	}
	pro.getPoint = function() {
		return this.point;
	}
	pro.setFillColor = function(color) {
		this.fillStyle = color;
		this.context.fillStyle = this.fillStyle;
	}
	pro.getFillColor = function() {
		return this.fillStyle;
	}
	pro.setColor = function(color) {
		this.strokeStyle = color;
		this.context.strokeStyle = this.strokeStyle;
	}
	pro.getColor = function() {
		return this.strokeStyle;
	}
	pro.setLineWidth = function(width) {
		this.lineWidth = width;
		this.context.lineWidth = this.lineWidth;
	}
	pro.getLineWidth = function() {
		return this.lineWidth;
	}
	pro.setLineCap = function(dis) {
		this.lineCap = dis;
		this.context.lineCap = this.lineCap;
	}
	pro.getLineCap = function() {
		return this.lineCap;
	}
	pro.drawCircle = function(point, r) {
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
	pro.drawLine = function(pointStart, pointEnd) {
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
	pro.clean = function(point, width, height) {
		if (isPoint(point) && isNumber(width) && isNumber(height)) {
			var ctx = this.context;
			ctx.clearRect(point.x, point.y, width, height);
		} else {
			return;
		}
	}
	pro.setCenter = function(point) {
		if (isPoint(point)) {
			this.context.translate(point.x, point.y);
			var point = new myPoint({
				x: 0,
				y: 0
			});
			this.setPoint(point);
		}
	}
	pro.setCoordinate = function(description) {
		this.context.transform();
	}
	pro.drawRec = function(start, end) {
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
	win.Yun = myDrawType;
})(window, document)