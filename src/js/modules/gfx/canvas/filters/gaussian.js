var ConvolutionFilter = require('./convolution');

function GaussianFilter(radius) {
    ConvolutionFilter.apply(this, Array.prototype.slice.call(arguments));
}
GaussianFilter.prototype = Object.create(ConvolutionFilter.prototype);
GaussianFilter.prototype.constructor = GaussianFilter;
GaussianFilter.prototype.initKernel = function(radius) {
    var kernel = [],
    size = (2 * radius + 1) * (2 * radius + 1),
    sigma = 0.849321800288,
    sigma2x2 = 2 * sigma * sigma,
    k = 1.0 / Math.sqrt(2.0 * Math.PI) / sigma,
    f = 0;
    for (var y =- radius; y <= radius; y++) {
        for (var x =- radius; x <= radius; x++) {
            f = k * Math.exp(-(x * x + y * y) / sigma2x2);
            kernel.push(f);
        }
    }
    this.kernel = kernel;
    this.divisor = size;
};

module.exports = GaussianFilter;
