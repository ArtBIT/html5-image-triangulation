var ConvolutionFilter = require('./convolution');

function BlurFilter(radius) {
    ConvolutionFilter.apply(this, Array.prototype.slice.call(arguments));
}
BlurFilter.prototype = Object.create(ConvolutionFilter.prototype);
BlurFilter.prototype.constructor = BlurFilter;
BlurFilter.prototype.initKernel = function(radius) {
    this.kernel = [];
    var size = (2*radius + 1)*(2*radius + 1);
    for (var i=0; i<size; i++) {
        this.kernel[i] = 1;
    }
    this.divisor = size;
};

module.exports = BlurFilter;
