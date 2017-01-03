var Filter = require('./filter');

function MedianFilter(diameter) {
    Filter.apply(this, Array.prototype.slice.call(arguments));
    this.diameter = diameter || 3;
}
MedianFilter.prototype = Object.create(Filter.prototype);
MedianFilter.prototype.constructor = MedianFilter;
MedianFilter.prototype.run = function(pixels, options) {
    return MedianFilter.convolute(pixels, this.diameter, options);
};
// @static
MedianFilter.convolute = function(pixels, diameter, options) {
    options = options || {};
    var src = pixels;
    var sd = src.data;
    var w = src.width;
    var h = src.height;

    var kd = diameter;
    var kl = kd * kd;
    var neighbours = [
        new Array(kl),
        new Array(kl),
        new Array(kl)
    ];
    var kr = (kd - 1) >> 1;

    // you can process a portion of the imagedata, but the width of the destination imagedata must be the same as the source, which means that you can pass in an option how many rows to skip, and how many rows to process
    var rs = isNaN(options.rowStart) ? 0 : options.rowStart;
    var re = isNaN(options.rowEnd) ? h : options.rowEnd;
    var rows = re - rs;
    var dst = new ImageData(w, rows);
    var dd = dst.data;

    var numericSort = function(a,b) {
        return a - b;
    };

    var i, di, x, y, ik, xk, yk, kf;
    var yo = (rs * w) << 2;

    for (y = rs; y < re; y++) {
        for (x = 0; x < w; x++) {
            sr = sg = sb = sa = 0;
            for (ik = 0; ik < kl; ik++) {
                px = x - kr + (ik % kd);
                py = y - kr + (ik / kd) | 0;
                px = px < 0 ? (w + px) : px > w ? (px - w) : px;
                py = py < 0 ? (h + py) : py > h ? (py - h) : py;
                i = (py * w + px) << 2;
                neighbours[0][ik] = sd[i];
                neighbours[1][ik] = sd[i+1];
                neighbours[2][ik] = sd[i+2];
            }
            neighbours[0].sort(numericSort);
            neighbours[1].sort(numericSort);
            neighbours[2].sort(numericSort);

            i = (y * w + x) << 2;
            di = i - yo;
            var mid = kl >> 1;
            if (kl % 2 === 0) {
                dd[di + 0] = (neighbours[0][mid-1] + neighbours[0][mid1])>>1;
                dd[di + 1] = (neighbours[1][mid-1] + neighbours[1][mid1])>>1;
                dd[di + 2] = (neighbours[2][mid-1] + neighbours[2][mid1])>>1;
            } else {
                dd[di + 0] = neighbours[0][mid];
                dd[di + 1] = neighbours[1][mid];
                dd[di + 2] = neighbours[2][mid];
            }

            dd[di + 3] = sd[i + 3];
        }
    }
    return dst;
};

module.exports = MedianFilter;
