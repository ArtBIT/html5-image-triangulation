var ConvolutionFilter = require('./convolution');

function FindEdgesFilter(radius) {
    ConvolutionFilter.apply(this, Array.prototype.slice.call(arguments));
}
FindEdgesFilter.prototype = Object.create(ConvolutionFilter.prototype);
FindEdgesFilter.prototype.constructor = FindEdgesFilter;
FindEdgesFilter.prototype.initKernel = function() {
    this.kernel = [-1, -1, -1,
    -1,  8, -1,
    -1, -1, -1];
    this.divisor = 1;
};

module.exports = FindEdgesFilter;
