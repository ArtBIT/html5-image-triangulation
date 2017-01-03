
function Filters(canvas) {
    this.filters = [];
    this.canvas = canvas;
}
Filters.prototype = {
    push: function(filter) {
        this.filters.push(filter);
    },
    pop: function() {
        return this.filters.pop();
    },
    empty: function() {
        this.filters = [];
    },
    reset: function() {
        if (this.original) {
            this.canvas.ctx.putImageData(this.original, 0, 0);
        } else {
            this.original = this.canvas.ctx.getImageData(0, 0, this.canvas.node.width, this.canvas.node.height);
        }
        this.imageData = this.canvas.ctx.getImageData(0, 0, this.canvas.node.width, this.canvas.node.height);
    },
    apply: function() {
        this.reset();
        var imd = this.imageData;
        for (var i=0, ii=this.filters.length; i < ii; i++) {
            var mark = 'filter.'+i;
            performance.mark(mark+'.start');
            imd = this.filters[i].run(imd);
            performance.mark(mark+'.end');
            performance.measure(mark, mark+'.start', mark+'.end');
        }
        this.canvas.ctx.putImageData(imd, 0, 0);
        this.imageData = imd;
        console.log(performance.getEntriesByType('measure'));
    },
    redraw: function() {
        this.original = null;
        this.apply();
    }
};
Filters.Filter = require('./filter');
Filters.ConvolutionFilter = require('./convolution');
Filters.BlurFilter = require('./blur');
Filters.FindEdgesFilter = require('./find.edges');
Filters.SharpenFilter = require('./sharpen');
Filters.EmbossFilter = require('./emboss');
Filters.GaussianFilter = require('./gaussian');
Filters.GrayscaleFilter = require('./grayscale');
Filters.ThresholdFilter = require('./threshold');
Filters.SobelFilter = require('./sobel');
Filters.LaplacianFilter = require('./laplacian');
Filters.MedianFilter = require('./median');

module.exports = Filters;
