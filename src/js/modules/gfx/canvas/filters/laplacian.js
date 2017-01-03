var ConvolutionFilter = require('./convolution');

function LaplacianFilter(radius) {
    ConvolutionFilter.apply(this, Array.prototype.slice.call(arguments));
}
LaplacianFilter.prototype = Object.create(ConvolutionFilter.prototype);
LaplacianFilter.prototype.constructor = LaplacianFilter;
LaplacianFilter.prototype.initKernel = function(radius) {
    this.divisor = 1;
    if (radius == 5) {
        this.kernel = 
            [ 0,  0, -1,  0,  0,  
             0, -1, -2, -1,  0,  
            -1, -2, 16, -2, -1, 
             0, -1, -2, -1,  0, 
             0,  0, -1,  0,  0];
    } else {
        this.kernel = 
            [ -1, -1, -1,
              -1,  8, -1,
              -1, -1, -1];
    }
};

module.exports = LaplacianFilter;
