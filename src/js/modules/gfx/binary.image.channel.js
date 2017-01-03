/**
 * A single channel binary image, with pixel values of 0 or 1.
 * @param ImageData imageData
 * @param Number threshold 0-255
 */
function BinaryImageChannel(imageData, threshold) {
    threshold = threshold || 100;
    this.width = imageData.width;
    this.height = imageData.height;
    var id = imageData.data;
    this.data = new Uint8ClampedArray(this.width * this.height);
    for (var i=0, ii=this.data.length; i<ii; i++) {
        var j = i << 2;
        // if a grayscale values is greater than threshold return 1 otherwise 0
        this.data[i] = (0.34 * id[j]
            + 0.5  * id[j + 1]
            + 0.16 * id[j + 2]) > threshold ? 1 : 0;
    }
}
BinaryImageChannel.prototype = {
    /**
     * @param BinaryImageChannel bin
     */
    add: function(bin) {
        for (var i = 0; i < this.data.length && i < bin.data.length; i++) {
            if (bin.data[i] == 1) {
                this.data[i] = 1;
            }
        }
    },
    /**
     * @param BinaryImageChannel bin
     */
    subtract: function(bin) {
        for (var i = 0; i < this.data.length && i < bin.data.length; i++) {
            if (bin.data[i] === 0 && this.data[i] == 1) {
                continue;
            }
            this.data[i] = 0;
        }
    },
    render: function(ctx, x, y) {
        var id = new ImageData(this.width, this.height);
        for (var i = 0; i < this.data.length; i++) {
            var j = i << 2;
            id.data[j] =
            id.data[j+1] =
            id.data[j+2] = this.data[i] * 255;
            id.data[j+3] = 255;
        }
        ctx.putImageData(id, x, y);

    },
    toPoints: function() {
        var points = [];
        var w = this.width;
        var h = this.height;
        // add corners
        points.push([0,0]);
        points.push([w,0]);
        points.push([w,h]);
        points.push([0,h]);

        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i]) {
                var x = i % w;
                var y = (i / w)|0;
                points.push([x,y]);
            }
        }

        return points;
    }
};
module.exports = BinaryImageChannel;
