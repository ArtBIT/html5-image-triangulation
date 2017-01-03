var Filters = require('./filters');
var histogram = require('./histogram');

function Canvas(width, height, bg) {
    this.canvas = 
    this.node = document.createElement('canvas');
    this.node.width = width;
    this.node.height = height;
    this.rect = {x:0,y:0,w:width,h:height};
    this.node.style.width = width + 'px';
    this.node.style.height = height + 'px';
    this.ctx = this.node.getContext('2d');
    this.filters = new Filters(this);
}

Canvas.prototype = {
    clear: function(color, alpha) {
        if (arguments.length === 0) {
            color = 'black';
            alpha = 0;
        }
        else if (arguments.length == 1) {
            alpha = 1;
        }
        var ctx = this.ctx;
        if (color && alpha > 0) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, this.node.width, this.node.height);
            ctx.restore();
        }
        else {
            ctx.clearRect(0, 0, this.node.width, this.node.height);
        }
    },
    destroy: function() {
        delete (this.ctx);
        if (this.node && this.node.parentNode) {
            this.node.parentNode.removeChild(this.node);
        }
        delete (this.node);
    },
    clone: function() {
        var canvas = new Canvas(this.node.width, this.node.height);
        canvas.ctx.drawImage(this.node, 0, 0, this.node.width, this.node.height);
        return canvas;
    },
    resize: function(width, height) {
        var tmp = this.clone();
        this.node.width = width;
        this.node.height = height;
        this.node.style.width = width + 'px';
        this.node.style.height = height + 'px';
        this.ctx.drawImage(tmp.node, 0, 0, width, height);
        this.rect = {x:0,y:0,w:width,h:height};
    },
    draw: function(src, mode) {
        if (src instanceof Canvas) {
            src = src.node;
        }
        if (!src.height) {
            return;
        }
        var dest = this.node;
        var srcRatio = src.width / src.height;
        var dx, dy;
        switch (mode) {
            case Canvas.MODE.STRETCH:
                this.ctx.drawImage(src, 0, 0, src.width, src.height, 0, 0, dest.width, dest.height);
                this.rect = {x:0,y:0,w:dest.width,h:dest.height};
                break;
            case Canvas.MODE.CENTER:
                dx = (dest.width - src.width) / 2;
                dy = (dest.height - src.height) / 2;
                this.ctx.drawImage(src, 0, 0, src.width, src.height, dx, dy, src.width, src.height);
                this.rect = {x:dx,y:dy,w:src.width,h:src.height};
                break;
            case Canvas.MODE.FIT:
                var nw = dest.width,
                    nh = nw / srcRatio;
                if (nh > dest.height) {
                    nh = dest.height;
                    nw = nh * srcRatio;
                }
                dx = (dest.width - nw) / 2;
                dy = (dest.height - nh) / 2;
                this.ctx.drawImage(src, 0, 0, src.width, src.height, dx, dy, nw, nh);
                this.rect = {x:dx,y:dy,w:nw,h:nh};
                break;
            default:
                this.ctx.drawImage(src, 0, 0, src.width, src.height);
                this.rect = {x:0,y:0,w:src.width,h:src.height};
        }
        this.update();
    },
    update: function() {
        this.filters.redraw();
    },
    hide: function() {
        this.node.style.visibility = 'hidden';
    },
    show: function() {
        this.node.style.visibility = 'visible';
    },
    histogram: function() {
        var x = this.rect.x;
        var y = this.rect.y;
        var w = this.rect.w;
        var h = this.rect.h;
        var imageData = this.ctx.getImageData(x, y, w, h);
        return histogram(imageData, 0, 0, w, h);
    }
};
Canvas.MODE = {
    STRETCH: 'stretch',
    FIT: 'fit',
    CENTER: 'center'
};

module.exports = Canvas;
