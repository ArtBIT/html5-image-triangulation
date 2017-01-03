var ConvolutionFilter = require('./convolution');

function SharpenFilter(radius) {
    ConvolutionFilter.apply(this, Array.prototype.slice.call(arguments));
}
SharpenFilter.prototype = Object.create(ConvolutionFilter.prototype);
SharpenFilter.prototype.constructor = SharpenFilter;
SharpenFilter.prototype.initKernel = function() {
    this.kernel = [-1, -1, -1,
    -1,  9, -1,
    -1, -1, -1];
    this.divisor = 1;
};

module.exports = SharpenFilter;
