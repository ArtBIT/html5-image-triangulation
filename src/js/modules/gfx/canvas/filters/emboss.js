var ConvolutionFilter = require('./convolution');

function EmbossFilter(radius) {
    ConvolutionFilter.apply(this, Array.prototype.slice.call(arguments));
}
EmbossFilter.prototype = Object.create(ConvolutionFilter.prototype);
EmbossFilter.prototype.constructor = EmbossFilter;
EmbossFilter.prototype.initKernel = function() {
    this.kernel = [-2, -1, 0,
    -1,  1, 1,
    0,  1, 2];
    this.divisor = 1;
};

module.exports = EmbossFilter;
