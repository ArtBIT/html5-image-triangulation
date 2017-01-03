var Filter = require('./filter');
function ConvolutionFilter() {
    var args = Array.prototype.slice.call(arguments);
    Filter.apply(this, args);
    this.initKernel.apply(this, args);
}
ConvolutionFilter.prototype = Object.create(Filter.prototype);
ConvolutionFilter.prototype.constructor = ConvolutionFilter;
ConvolutionFilter.prototype.initKernel = function() {
    this.kernel = [1];
    this.divisor = 1;
};
ConvolutionFilter.prototype.run = function(pixels, options) {
    return ConvolutionFilter.convolute(pixels, this.kernel, this.divisor, options);
};
// @static
ConvolutionFilter.convolute = function(pixels, kernel, divisor, options) {
    options = options || {};
    var src = pixels;
    var sd = src.data;
    var w = src.width;
    var h = src.height;

    var k = kernel;
    var kd = Math.sqrt(k.length); // kernel diameter
    var kr = (kd - 1) >> 1;       // kernel radius
    var f = divisor ? 1/divisor : 1;
    // you can process a portion of the imagedata, but the width of the destination imagedata must be the same as the source, which means that you can pass in an option how many rows to skip, and how many rows to process
    var rs = isNaN(options.rowStart) ? 0 : options.rowStart;
    var re = isNaN(options.rowEnd) ? h : options.rowEnd;
    var rows = re - rs;
    var dst = new ImageData(w, rows);
    var dd = dst.data;

    // rgba channel sums
    var sr, sg, sb, sa;
    var i, di, x, y, ik, xk, yk, kf;
    var yo = (rs * w) << 2;

    for (y = rs; y < re; y++) {
        for (x = 0; x < w; x++) {
            sr = sg = sb = sa = 0;
            for (ik = 0; ik < k.length; ik++) {
                kf = k[ik];
                px = x - kr + (ik % kd);
                py = y - kr + (ik / kd) | 0;
                px = px < 0 ? (w + px) : px > w ? (px - w) : px;
                py = py < 0 ? (h + py) : py > h ? (py - h) : py;
                i = (py * w + px) << 2;
                sr += sd[i + 0] * kf;
                sg += sd[i + 1] * kf;
                sb += sd[i + 2] * kf;
                sa += sd[i + 3] * kf;
            }

            sr = (sr * f)|0;
            sg = (sg * f)|0; 
            sb = (sb * f)|0; 
            sa = (sa * f)|0; 

            i = (y * w + x) << 2;
            di = i - yo;
            dd[di + 0] = sr < 0 ? 0 : sr > 255 ? 255 : sr;
            dd[di + 1] = sg < 0 ? 0 : sg > 255 ? 255 : sg;
            dd[di + 2] = sb < 0 ? 0 : sb > 255 ? 255 : sb;

            if (options.preserveAlpha) {
                dd[di + 3] = sd[i + 3];
            } else {
                dd[di + 3] = sa < 0 ? 0 : sa > 255 ? 255 : sa;
            }
        }
    }
    return dst;
};

// @static
ConvolutionFilter.convoluteFloat32 = function(pixels, kernel, divisor, options) {
    options = options || {};
    var src = pixels;
    var sd = src.data;
    var w = src.width;
    var h = src.height;

    var k = kernel;
    var kd = Math.sqrt(k.length); // kernel diameter
    var kr = (kd - 1) >> 1;       // kernel radius
    var f = divisor ? 1/divisor : 1;
    // you can process a portion of the imagedata, but the width of the destination imagedata must be the same as the source, which means that you can pass in an option how many rows to skip, and how many rows to process
    var rs = isNaN(options.rowStart) ? 0 : options.rowStart;
    var re = isNaN(options.rowEnd) ? h : options.rowEnd;
    var rows = re - rs;
    var dd = new Float32Array(w * rows << 2);

    // rgba channel sums
    var sr, sg, sb, sa;
    var i, di, x, y, ik, xk, yk, kf;
    var yo = (rs * w) << 2;

    for (y = rs; y < re; y++) {
        for (x = 0; x < w; x++) {
            sr = sg = sb = sa = 0;
            for (ik = 0; ik < k.length; ik++) {
                kf = k[ik];
                px = x - kr + (ik % kd);
                py = y - kr + (ik / kd) | 0;
                px = px < 0 ? (w + px) : px > w ? (px - w) : px;
                py = py < 0 ? (h + py) : py > h ? (py - h) : py;
                i = (py * w + px) << 2;
                sr += sd[i + 0] * kf;
                sg += sd[i + 1] * kf;
                sb += sd[i + 2] * kf;
                sa += sd[i + 3] * kf;
            }

            sr = (sr * f)|0;
            sg = (sg * f)|0; 
            sb = (sb * f)|0; 
            sa = (sa * f)|0; 

            i = (y * w + x) << 2;
            di = i - yo;
            dd[di + 0] = sr < -255 ? -255 : sr > 255 ? 255 : sr;
            dd[di + 1] = sg < -255 ? -255 : sg > 255 ? 255 : sg;
            dd[di + 2] = sb < -255 ? -255 : sb > 255 ? 255 : sb;
            dd[di + 3] = sa < -255 ? -255 : sa > 255 ? 255 : sa;
        }
    }
    return dd;
};
module.exports = ConvolutionFilter;
