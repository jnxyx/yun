(function() {

    function Tree(container, wordArray) {
        if (this instanceof Tree) {
            return this.init(container, wordArray);
        } else {
            return new Tree(container, wordArray);
        }
    }

    Tree.prototype = {
        treeHeight: 7 / 8,
        bezierH: 1 / 8,
        leafWidth: 1 / 5,
        leafColor: '#6d9c3e', //'#6d9c3e',
        color: {
            r: '6d',
            g: '9c',
            b: '3e'
        },

        init: function(container, wordArray) {
            var element = document.querySelector(container);
            var canvas = document.createElement('canvas');
            var self = this;
            self.height = 50 * wordArray.length / 2 + 100; //element.clientHeight;
            self.width = element.clientWidth;
            canvas.setAttribute('height', self.height);
            canvas.setAttribute('width', self.width);
            element.innerHTML = '';
            element.appendChild(canvas);
            self.ctx = canvas.getContext("2d");
            self.wordArray = wordArray;
            self.drawTree();
            return self;
        },
        drawTree: function() {
            var self = this,
                ctx = self.ctx,
                treeHeight = self.treeHeight,
                bezierH = self.bezierH,
                width = self.width,
                height = self.height,
                wordArray = self.wordArray;
            ctx.translate(width / 2, height);
            ctx.strokeStyle = "#eee";
            ctx.fillStyle = "#eee";
            ctx.beginPath();
            ctx.moveTo(-width / 2, 0);
            ctx.bezierCurveTo(0, 0, -width * bezierH, -treeHeight * treeHeight * height, 0, -treeHeight * height);
            ctx.lineTo(0, 0);
            ctx.lineTo(-width / 2, 0);
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(width / 2, 0);
            ctx.bezierCurveTo(0, 0, width * bezierH, -treeHeight * treeHeight * height, 0, -treeHeight * height);
            ctx.lineTo(0, 0);
            ctx.lineTo(width / 2, 0);
            ctx.stroke();
            ctx.fill();

            for (var i = 0; i < wordArray.length; i++) {
                var item = wordArray[i],
                    angle;
                if (i % 2 == 0) {
                    angle = 30 * Math.random();
                    self.drawLeaf({ x: self.width * (1 - self.treeHeight) - (i / 2) * 5, y: -100 - ((i - 1) / 2) * 60 }, angle, item);
                } else {
                    angle = 180 - 30 * Math.random();
                    self.drawLeaf({ x: -self.width * (1 - self.treeHeight) + ((i - 1) / 2) * 5, y: -100 - (i / 2) * 60 }, angle, item);
                }
            }
        },
        drawLeaf: function(root, angle, word) {
            var self = this,
                leafWidth = self.leafWidth * self.width,
                ctx = self.ctx;
            ctx.strokeStyle = self.growColor() || self.leafColor;
            ctx.fillStyle = self.growColor() || self.leafColor;
            ctx.translate(root.x, root.y);
            ctx.rotate(angle * Math.PI / 180);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(leafWidth / 4, leafWidth / 2, leafWidth, 0);
            ctx.quadraticCurveTo(leafWidth / 4, -leafWidth / 2, 0, 0);
            ctx.stroke();
            ctx.fill();
            ctx.fillStyle = "#fff";
            ctx.fillText(word, 10, 2);
            ctx.rotate(-angle * Math.PI / 180);
            ctx.translate(-root.x, -root.y);
        },
        growColor: function() {
            var color = this.color;
            color.r = (parseInt(color.r, 16) + 0x3).toString(16).substring(0, 2);
            color.g = (parseInt(color.g, 16) + 0x2).toString(16).substring(0, 2);
            color.b = (parseInt(color.b, 16) + 0x1).toString(16).substring(0, 2);

            return '#' + color.r + color.g + color.b;
        }
    }

    window.twTree = Tree;

}())