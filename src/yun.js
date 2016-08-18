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
        },
        each = tools.each = function(loopable, callback, self) {
            var additionalArgs = Array.prototype.slice.call(arguments, 3);
            // Check to see if null or undefined firstly.
            if (loopable) {
                if (loopable.length === +loopable.length) {
                    var i;
                    for (i = 0; i < loopable.length; i++) {
                        callback.apply(self, [loopable[i], i].concat(additionalArgs));
                    }
                } else {
                    for (var item in loopable) {
                        callback.apply(self, [loopable[item], item].concat(additionalArgs));
                    }
                }
            }
        },
        clone = tools.clone = function(obj) {
            var objClone = {};
            each(obj, function(value, key) {
                if (obj.hasOwnProperty(key)) {
                    objClone[key] = value;
                }
            });
            return objClone;
        },
        extend = tools.extend = function(base) {
            each(Array.prototype.slice.call(arguments, 1), function(extensionObject) {
                each(extensionObject, function(value, key) {
                    if (extensionObject.hasOwnProperty(key)) {
                        base[key] = value;
                    }
                });
            });
            return base;
        },
        merge = tools.merge = function(base, master) {
            //Merge properties in left object over to a shallow clone of object right.
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift({});
            return extend.apply(null, args);
        },
        indexOf = tools.indexOf = function(arrayToSearch, item) {
            if (Array.prototype.indexOf) {
                return arrayToSearch.indexOf(item);
            } else {
                for (var i = 0; i < arrayToSearch.length; i++) {
                    if (arrayToSearch[i] === item) return i;
                }
                return -1;
            }
        },
        where = tools.where = function(collection, filterCallback) {
            var filtered = [];

            tools.each(collection, function(item) {
                if (filterCallback(item)) {
                    filtered.push(item);
                }
            });

            return filtered;
        },
        findNextWhere = tools.findNextWhere = function(arrayToSearch, filterCallback, startIndex) {
            // Default to start of the array
            if (!startIndex) {
                startIndex = -1;
            }
            for (var i = startIndex + 1; i < arrayToSearch.length; i++) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        },
        findPreviousWhere = tools.findPreviousWhere = function(arrayToSearch, filterCallback, startIndex) {
            // Default to end of the array
            if (!startIndex) {
                startIndex = arrayToSearch.length;
            }
            for (var i = startIndex - 1; i >= 0; i--) {
                var currentItem = arrayToSearch[i];
                if (filterCallback(currentItem)) {
                    return currentItem;
                }
            }
        },
        inherits = tools.inherits = function(extensions) {
            //Basic javascript inheritance based on the model created in Backbone.js
            var parent = this;
            var ChartElement = (extensions && extensions.hasOwnProperty("constructor")) ? extensions.constructor : function() {
                return parent.apply(this, arguments);
            };

            var Surrogate = function() { this.constructor = ChartElement; };
            Surrogate.prototype = parent.prototype;
            ChartElement.prototype = new Surrogate();

            ChartElement.extend = inherits;

            if (extensions) extend(ChartElement.prototype, extensions);

            ChartElement.__super__ = parent.prototype;

            return ChartElement;
        },
        noop = tools.noop = function() {},
        uid = tools.uid = (function() {
            var id = 0;
            return function() {
                return "chart-" + id++;
            };
        })(),
        warn = tools.warn = function(str) {
            //Method for warning of errors
            if (window.console && typeof window.console.warn === "function") console.warn(str);
        },
        amd = tools.amd = (typeof define === 'function' && define.amd),
        //-- Math methods
        isNumber = tools.isNumber = function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        max = tools.max = function(array) {
            return Math.max.apply(Math, array);
        },
        min = tools.min = function(array) {
            return Math.min.apply(Math, array);
        },
        cap = tools.cap = function(valueToCap, maxValue, minValue) {
            if (isNumber(maxValue)) {
                if (valueToCap > maxValue) {
                    return maxValue;
                }
            } else if (isNumber(minValue)) {
                if (valueToCap < minValue) {
                    return minValue;
                }
            }
            return valueToCap;
        },
        getDecimalPlaces = tools.getDecimalPlaces = function(num) {
            if (num % 1 !== 0 && isNumber(num)) {
                var s = num.toString();
                if (s.indexOf("e-") < 0) {
                    // no exponent, e.g. 0.01
                    return s.split(".")[1].length;
                } else if (s.indexOf(".") < 0) {
                    // no decimal point, e.g. 1e-9
                    return parseInt(s.split("e-")[1]);
                } else {
                    // exponent and decimal point, e.g. 1.23e-9
                    var parts = s.split(".")[1].split("e-");
                    return parts[0].length + parseInt(parts[1]);
                }
            } else {
                return 0;
            }
        },
        toRadians = tools.radians = function(degrees) {
            return degrees * (Math.PI / 180);
        },
        // Gets the angle from vertical upright to the point about a centre.
        getAngleFromPoint = tools.getAngleFromPoint = function(centrePoint, anglePoint) {
            var distanceFromXCenter = anglePoint.x - centrePoint.x,
                distanceFromYCenter = anglePoint.y - centrePoint.y,
                radialDistanceFromCenter = Math.sqrt(distanceFromXCenter * distanceFromXCenter + distanceFromYCenter * distanceFromYCenter);


            var angle = Math.PI * 2 + Math.atan2(distanceFromYCenter, distanceFromXCenter);

            //If the segment is in the top left quadrant, we need to add another rotation to the angle
            if (distanceFromXCenter < 0 && distanceFromYCenter < 0) {
                angle += Math.PI * 2;
            }

            return {
                angle: angle,
                distance: radialDistanceFromCenter
            };
        },
        aliasPixel = tools.aliasPixel = function(pixelWidth) {
            return (pixelWidth % 2 === 0) ? 0 : 0.5;
        },
        splineCurve = tools.splineCurve = function(FirstPoint, MiddlePoint, AfterPoint, t) {
            //Props to Rob Spencer at scaled innovation for his post on splining between points
            //http://scaledinnovation.com/analytics/splines/aboutSplines.html
            var d01 = Math.sqrt(Math.pow(MiddlePoint.x - FirstPoint.x, 2) + Math.pow(MiddlePoint.y - FirstPoint.y, 2)),
                d12 = Math.sqrt(Math.pow(AfterPoint.x - MiddlePoint.x, 2) + Math.pow(AfterPoint.y - MiddlePoint.y, 2)),
                fa = t * d01 / (d01 + d12), // scaling factor for triangle Ta
                fb = t * d12 / (d01 + d12);
            return {
                inner: {
                    x: MiddlePoint.x - fa * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y - fa * (AfterPoint.y - FirstPoint.y)
                },
                outer: {
                    x: MiddlePoint.x + fb * (AfterPoint.x - FirstPoint.x),
                    y: MiddlePoint.y + fb * (AfterPoint.y - FirstPoint.y)
                }
            };
        },
        calculateOrderOfMagnitude = tools.calculateOrderOfMagnitude = function(val) {
            return Math.floor(Math.log(val) / Math.LN10);
        },
        calculateScaleRange = tools.calculateScaleRange = function(valuesArray, drawingSize, textSize, startFromZero, integersOnly) {

            //Set a minimum step of two - a point at the top of the graph, and a point at the base
            var minSteps = 2,
                maxSteps = Math.floor(drawingSize / (textSize * 1.5)),
                skipFitting = (minSteps >= maxSteps);

            var maxValue = max(valuesArray),
                minValue = min(valuesArray);

            // We need some degree of separation here to calculate the scales if all the values are the same
            // Adding/minusing 0.5 will give us a range of 1.
            if (maxValue === minValue) {
                maxValue += 0.5;
                // So we don't end up with a graph with a negative start value if we've said always start from zero
                if (minValue >= 0.5 && !startFromZero) {
                    minValue -= 0.5;
                } else {
                    // Make up a whole number above the values
                    maxValue += 0.5;
                }
            }

            var valueRange = Math.abs(maxValue - minValue),
                rangeOrderOfMagnitude = calculateOrderOfMagnitude(valueRange),
                graphMax = Math.ceil(maxValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
                graphMin = (startFromZero) ? 0 : Math.floor(minValue / (1 * Math.pow(10, rangeOrderOfMagnitude))) * Math.pow(10, rangeOrderOfMagnitude),
                graphRange = graphMax - graphMin,
                stepValue = Math.pow(10, rangeOrderOfMagnitude),
                numberOfSteps = Math.round(graphRange / stepValue);

            //If we have more space on the graph we'll use it to give more definition to the data
            while ((numberOfSteps > maxSteps || (numberOfSteps * 2) < maxSteps) && !skipFitting) {
                if (numberOfSteps > maxSteps) {
                    stepValue *= 2;
                    numberOfSteps = Math.round(graphRange / stepValue);
                    // Don't ever deal with a decimal number of steps - cancel fitting and just use the minimum number of steps.
                    if (numberOfSteps % 1 !== 0) {
                        skipFitting = true;
                    }
                }
                //We can fit in double the amount of scale points on the scale
                else {
                    //If user has declared ints only, and the step value isn't a decimal
                    if (integersOnly && rangeOrderOfMagnitude >= 0) {
                        //If the user has said integers only, we need to check that making the scale more granular wouldn't make it a float
                        if (stepValue / 2 % 1 === 0) {
                            stepValue /= 2;
                            numberOfSteps = Math.round(graphRange / stepValue);
                        }
                        //If it would make it a float break out of the loop
                        else {
                            break;
                        }
                    }
                    //If the scale doesn't have to be an int, make the scale more granular anyway.
                    else {
                        stepValue /= 2;
                        numberOfSteps = Math.round(graphRange / stepValue);
                    }

                }
            }

            if (skipFitting) {
                numberOfSteps = minSteps;
                stepValue = graphRange / numberOfSteps;
            }

            return {
                steps: numberOfSteps,
                stepValue: stepValue,
                min: graphMin,
                max: graphMin + (numberOfSteps * stepValue)
            };

        },
        /* jshint ignore:start */
        // Blows up jshint errors based on the new Function constructor
        //Templating methods
        //Javascript micro templating by John Resig - source at http://ejohn.org/blog/javascript-micro-templating/
        template = tools.template = function(templateString, valuesObject) {

            // If templateString is function rather than string-template - call the function for valuesObject

            if (templateString instanceof Function) {
                return templateString(valuesObject);
            }

            var cache = {};

            function tmpl(str, data) {
                // Figure out if we're getting a template, or if we need to
                // load the template - and be sure to cache the result.
                var fn = !/\W/.test(str) ?
                    cache[str] = cache[str] :

                    // Generate a reusable function that will serve as a template
                    // generator (and which will be cached).
                    new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +

                        // Introduce the data as local variables using with(){}
                        "with(obj){p.push('" +

                        // Convert the template into pure JavaScript
                        str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'") +
                        "');}return p.join('');"
                    );

                // Provide some basic currying to the user
                return data ? fn(data) : fn;
            }
            return tmpl(templateString, valuesObject);
        },
        /* jshint ignore:end */
        generateLabels = tools.generateLabels = function(templateString, numberOfSteps, graphMin, stepValue) {
            var labelsArray = new Array(numberOfSteps);
            if (templateString) {
                each(labelsArray, function(val, index) {
                    labelsArray[index] = template(templateString, { value: (graphMin + (stepValue * (index + 1))) });
                });
            }
            return labelsArray;
        },
        //--Animation methods
        //Easing functions adapted from Robert Penner's easing equations
        //http://www.robertpenner.com/easing/
        easingEffects = tools.easingEffects = {
            linear: function(t) {
                return t;
            },
            easeInQuad: function(t) {
                return t * t;
            },
            easeOutQuad: function(t) {
                return -1 * t * (t - 2);
            },
            easeInOutQuad: function(t) {
                if ((t /= 1 / 2) < 1) {
                    return 1 / 2 * t * t;
                }
                return -1 / 2 * ((--t) * (t - 2) - 1);
            },
            easeInCubic: function(t) {
                return t * t * t;
            },
            easeOutCubic: function(t) {
                return 1 * ((t = t / 1 - 1) * t * t + 1);
            },
            easeInOutCubic: function(t) {
                if ((t /= 1 / 2) < 1) {
                    return 1 / 2 * t * t * t;
                }
                return 1 / 2 * ((t -= 2) * t * t + 2);
            },
            easeInQuart: function(t) {
                return t * t * t * t;
            },
            easeOutQuart: function(t) {
                return -1 * ((t = t / 1 - 1) * t * t * t - 1);
            },
            easeInOutQuart: function(t) {
                if ((t /= 1 / 2) < 1) {
                    return 1 / 2 * t * t * t * t;
                }
                return -1 / 2 * ((t -= 2) * t * t * t - 2);
            },
            easeInQuint: function(t) {
                return 1 * (t /= 1) * t * t * t * t;
            },
            easeOutQuint: function(t) {
                return 1 * ((t = t / 1 - 1) * t * t * t * t + 1);
            },
            easeInOutQuint: function(t) {
                if ((t /= 1 / 2) < 1) {
                    return 1 / 2 * t * t * t * t * t;
                }
                return 1 / 2 * ((t -= 2) * t * t * t * t + 2);
            },
            easeInSine: function(t) {
                return -1 * Math.cos(t / 1 * (Math.PI / 2)) + 1;
            },
            easeOutSine: function(t) {
                return 1 * Math.sin(t / 1 * (Math.PI / 2));
            },
            easeInOutSine: function(t) {
                return -1 / 2 * (Math.cos(Math.PI * t / 1) - 1);
            },
            easeInExpo: function(t) {
                return (t === 0) ? 1 : 1 * Math.pow(2, 10 * (t / 1 - 1));
            },
            easeOutExpo: function(t) {
                return (t === 1) ? 1 : 1 * (-Math.pow(2, -10 * t / 1) + 1);
            },
            easeInOutExpo: function(t) {
                if (t === 0) {
                    return 0;
                }
                if (t === 1) {
                    return 1;
                }
                if ((t /= 1 / 2) < 1) {
                    return 1 / 2 * Math.pow(2, 10 * (t - 1));
                }
                return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
            },
            easeInCirc: function(t) {
                if (t >= 1) {
                    return t;
                }
                return -1 * (Math.sqrt(1 - (t /= 1) * t) - 1);
            },
            easeOutCirc: function(t) {
                return 1 * Math.sqrt(1 - (t = t / 1 - 1) * t);
            },
            easeInOutCirc: function(t) {
                if ((t /= 1 / 2) < 1) {
                    return -1 / 2 * (Math.sqrt(1 - t * t) - 1);
                }
                return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1);
            },
            easeInElastic: function(t) {
                var s = 1.70158;
                var p = 0;
                var a = 1;
                if (t === 0) {
                    return 0;
                }
                if ((t /= 1) == 1) {
                    return 1;
                }
                if (!p) {
                    p = 1 * 0.3;
                }
                if (a < Math.abs(1)) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(1 / a);
                }
                return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
            },
            easeOutElastic: function(t) {
                var s = 1.70158;
                var p = 0;
                var a = 1;
                if (t === 0) {
                    return 0;
                }
                if ((t /= 1) == 1) {
                    return 1;
                }
                if (!p) {
                    p = 1 * 0.3;
                }
                if (a < Math.abs(1)) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(1 / a);
                }
                return a * Math.pow(2, -10 * t) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) + 1;
            },
            easeInOutElastic: function(t) {
                var s = 1.70158;
                var p = 0;
                var a = 1;
                if (t === 0) {
                    return 0;
                }
                if ((t /= 1 / 2) == 2) {
                    return 1;
                }
                if (!p) {
                    p = 1 * (0.3 * 1.5);
                }
                if (a < Math.abs(1)) {
                    a = 1;
                    s = p / 4;
                } else {
                    s = p / (2 * Math.PI) * Math.asin(1 / a);
                }
                if (t < 1) {
                    return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p));
                }
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * 1 - s) * (2 * Math.PI) / p) * 0.5 + 1;
            },
            easeInBack: function(t) {
                var s = 1.70158;
                return 1 * (t /= 1) * t * ((s + 1) * t - s);
            },
            easeOutBack: function(t) {
                var s = 1.70158;
                return 1 * ((t = t / 1 - 1) * t * ((s + 1) * t + s) + 1);
            },
            easeInOutBack: function(t) {
                var s = 1.70158;
                if ((t /= 1 / 2) < 1) {
                    return 1 / 2 * (t * t * (((s *= (1.525)) + 1) * t - s));
                }
                return 1 / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2);
            },
            easeInBounce: function(t) {
                return 1 - easingEffects.easeOutBounce(1 - t);
            },
            easeOutBounce: function(t) {
                if ((t /= 1) < (1 / 2.75)) {
                    return 1 * (7.5625 * t * t);
                } else if (t < (2 / 2.75)) {
                    return 1 * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
                } else if (t < (2.5 / 2.75)) {
                    return 1 * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
                } else {
                    return 1 * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
                }
            },
            easeInOutBounce: function(t) {
                if (t < 1 / 2) {
                    return easingEffects.easeInBounce(t * 2) * 0.5;
                }
                return easingEffects.easeOutBounce(t * 2 - 1) * 0.5 + 1 * 0.5;
            }
        },
        //Request animation polyfill - http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
        requestAnimFrame = tools.requestAnimFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    return window.setTimeout(callback, 1000 / 60);
                };
        })(),
        cancelAnimFrame = tools.cancelAnimFrame = (function() {
            return window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.msCancelAnimationFrame ||
                function(callback) {
                    return window.clearTimeout(callback, 1000 / 60);
                };
        })(),
        animationLoop = tools.animationLoop = function(callback, totalSteps, easingString, onProgress, onComplete, chartInstance) {

            var currentStep = 0,
                easingFunction = easingEffects[easingString] || easingEffects.linear;

            var animationFrame = function() {
                currentStep++;
                var stepDecimal = currentStep / totalSteps;
                var easeDecimal = easingFunction(stepDecimal);

                callback.call(chartInstance, easeDecimal, stepDecimal, currentStep);
                onProgress.call(chartInstance, easeDecimal, stepDecimal);
                if (currentStep < totalSteps) {
                    chartInstance.animationFrame = requestAnimFrame(animationFrame);
                } else {
                    onComplete.apply(chartInstance);
                }
            };
            requestAnimFrame(animationFrame);
        },
        //-- DOM methods
        getRelativePosition = tools.getRelativePosition = function(evt) {
            var mouseX, mouseY;
            var e = evt.originalEvent || evt,
                canvas = evt.currentTarget || evt.srcElement,
                boundingRect = canvas.getBoundingClientRect();

            if (e.touches) {
                mouseX = e.touches[0].clientX - boundingRect.left;
                mouseY = e.touches[0].clientY - boundingRect.top;

            } else {
                mouseX = e.clientX - boundingRect.left;
                mouseY = e.clientY - boundingRect.top;
            }

            return {
                x: mouseX,
                y: mouseY
            };

        },
        addEvent = tools.addEvent = function(node, eventType, method) {
            if (node.addEventListener) {
                node.addEventListener(eventType, method);
            } else if (node.attachEvent) {
                node.attachEvent("on" + eventType, method);
            } else {
                node["on" + eventType] = method;
            }
        },
        removeEvent = tools.removeEvent = function(node, eventType, handler) {
            if (node.removeEventListener) {
                node.removeEventListener(eventType, handler, false);
            } else if (node.detachEvent) {
                node.detachEvent("on" + eventType, handler);
            } else {
                node["on" + eventType] = noop;
            }
        },
        bindEvents = tools.bindEvents = function(chartInstance, arrayOfEvents, handler) {
            // Create the events object if it's not already present
            if (!chartInstance.events) chartInstance.events = {};

            each(arrayOfEvents, function(eventName) {
                chartInstance.events[eventName] = function() {
                    handler.apply(chartInstance, arguments);
                };
                addEvent(chartInstance.chart.canvas, eventName, chartInstance.events[eventName]);
            });
        },
        unbindEvents = tools.unbindEvents = function(chartInstance, arrayOfEvents) {
            each(arrayOfEvents, function(handler, eventName) {
                removeEvent(chartInstance.chart.canvas, eventName, handler);
            });
        },
        getMaximumWidth = tools.getMaximumWidth = function(domNode) {
            var container = domNode.parentNode,
                padding = parseInt(getStyle(container, 'padding-left')) + parseInt(getStyle(container, 'padding-right'));
            // TODO = check cross browser stuff with this.
            return container.clientWidth - padding;
        },
        getMaximumHeight = tools.getMaximumHeight = function(domNode) {
            var container = domNode.parentNode,
                padding = parseInt(getStyle(container, 'padding-bottom')) + parseInt(getStyle(container, 'padding-top'));
            // TODO = check cross browser stuff with this.
            return container.clientHeight - padding;
        },
        getStyle = tools.getStyle = function(el, property) {
            return el.currentStyle ?
                el.currentStyle[property] :
                document.defaultView.getComputedStyle(el, null).getPropertyValue(property);
        },
        getMaximumSize = tools.getMaximumSize = tools.getMaximumWidth, // legacy support
        retinaScale = tools.retinaScale = function(chart) {
            var ctx = chart.ctx,
                width = chart.canvas.width,
                height = chart.canvas.height;

            if (window.devicePixelRatio) {
                ctx.canvas.style.width = width + "px";
                ctx.canvas.style.height = height + "px";
                ctx.canvas.height = height * window.devicePixelRatio;
                ctx.canvas.width = width * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        },
        //-- Canvas methods
        clear = tools.clear = function(chart) {
            chart.ctx.clearRect(0, 0, chart.width, chart.height);
        },
        fontString = tools.fontString = function(pixelSize, fontStyle, fontFamily) {
            return fontStyle + " " + pixelSize + "px " + fontFamily;
        },
        longestText = tools.longestText = function(ctx, font, arrayOfStrings) {
            ctx.font = font;
            var longest = 0;
            each(arrayOfStrings, function(string) {
                var textWidth = ctx.measureText(string).width;
                longest = (textWidth > longest) ? textWidth : longest;
            });
            return longest;
        },
        drawRoundedRectangle = tools.drawRoundedRectangle = function(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
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
