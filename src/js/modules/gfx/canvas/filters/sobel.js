var GrayscaleFilter = require('./grayscale');
var ConvolutionFilter = require('./convolution');
var Filter = require('./filter');

function SobelFilter(radius) {
    Filter.apply(this, Array.prototype.slice.call(arguments));
    this.grayscale = new GrayscaleFilter(1);
}
SobelFilter.prototype = Object.create(Filter.prototype);
SobelFilter.prototype.constructor = SobelFilter;
SobelFilter.prototype.run = function(pixels, options) {
    var grayscale = this.grayscale.run(pixels);
    var vertical = ConvolutionFilter.convoluteFloat32(grayscale, 
            [ -1, 0, 1,
              -2, 0, 2,
              -1, 0, 1 ], 1);
    var horizontal = ConvolutionFilter.convoluteFloat32(grayscale, 
            [ -1, -2, -1,
               0,  0,  0,
               1,  2,  1 ], 1);

    var id = new ImageData(pixels.width, pixels.height);
    var data = id.data;
    for (var i=0, ii=data.length; i<ii; i+=4) {
        var v = Math.abs(vertical[i])|0;
        data[i] = v;
        var h = Math.abs(horizontal[i])|0;
        data[i+1] = h;
        data[i+2] = (v+h)>>2;
        data[i+3] = 255;
    }
    return id;
};

module.exports = SobelFilter;
