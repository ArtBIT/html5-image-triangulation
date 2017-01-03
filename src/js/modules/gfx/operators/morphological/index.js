var BinaryImageChannel = require('~/js/modules/gfx/binary.image.channel');
var StructuringElement = require('./structuring.element');

function MorphologicalOperators(pixels) {
    this.pixels = pixels;
    this.binary = new BinaryImageChannel(pixels, 60);
    this.idx = 0;
}
MorphologicalOperators.prototype = {
    dilate: function(element) {
        // This kernel is actually "structuring element" containing binary pixels for the current index
        var kernel = element.clone();
        var r = kernel.radius;
        var d = kernel.diameter;

        var w = this.binary.width;
        var h = this.binary.height;
        var bd = this.binary.data;
        var len = bd.length;

        var result = new Uint8ClampedArray(w * h);
        for (var idx=0; idx<len; idx++) {
            // populate kernel for the current pixel
            for (var i = 0; i < kernel.length; i++) {
                var y = -r + (i / d)|0;
                var x = -r + i % d;
                var kidx = ((idx + y * w + x) + len) % len;
                kernel.data[i] = bd[kidx];
            }
            result[idx] = element.dilate(kernel);
        }
        this.binary.data = result;
    },
    erode: function(element) {
        // This kernel is actually "structuring element" containing binary pixels for the current index
        var kernel = element.clone();
        var r = kernel.radius;
        var d = kernel.diameter;

        var w = this.binary.width;
        var h = this.binary.height;
        var bd = this.binary.data;
        var len = bd.length;

        var result = new Uint8ClampedArray(w * h);
        for (var idx=0; idx<len; idx++) {
            // populate kernel for the current pixel
            for (var i = 0; i < kernel.length; i++) {
                var y = -r + (i / d)|0;
                var x = -r + i % d;
                var kidx = ((idx + y * w + x) + len) % len;
                kernel.data[i] = bd[kidx];
            }
            result[idx] = element.erode(kernel);
        }
        this.binary.data = result;
    },
    openning: function(element) {
        this.dilate(element);
        this.erode(element);
    },
    closing: function(element) {
        this.erode(element);
        this.dilate(element);
    },
    hitmiss: function() {
        // This kernel is actually "structuring element" containing binary pixels for the current index
        var kernel = StructuringElement.RECT.clone();
        var r = kernel.radius;
        var d = kernel.diameter;

        var w = this.binary.width;
        var h = this.binary.height;
        var bd = this.binary.data;
        var len = bd.length;

        var result = new Uint8ClampedArray(w * h);
        for (var idx=0; idx<len; idx++) {
            // populate kernel for the current pixel
            for (var i = 0; i < kernel.length; i++) {
                var y = -r + (i / d)|0;
                var x = -r + i % d;
                var kidx = ((idx + y * w + x) + len) % len;
                kernel.data[i] = bd[kidx];
            }
            result[idx] = kernel.equivalence(StructuringElement.BOTTOM_LEFT_CORNER) || kernel.equivalence(StructuringElement.BOTTOM_RIGHT_CORNER) || kernel.equivalence(StructuringElement.TOP_LEFT_CORNER) || kernel.equivalence(StructuringElement.TOP_RIGHT_CORNER);
        }
        this.binary.data = result;
    },
    render: function(ctx, x, y) {
        this.binary.render(ctx, x, y);
    }
};

module.exports = MorphologicalOperators;
