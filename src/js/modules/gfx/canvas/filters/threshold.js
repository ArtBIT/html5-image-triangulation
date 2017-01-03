var Filter = require('./filter');

function ThresholdFilter(strength) {
    Filter.apply(this, Array.prototype.slice.call(arguments));
    this.strength = Math.min(255, Math.max(0, strength || 0));
}
ThresholdFilter.prototype = Object.create(Filter.prototype);
ThresholdFilter.prototype.constructor = ThresholdFilter;
ThresholdFilter.prototype.run = function(pixels, options) {
    var data = pixels.data;
    var w = pixels.width;
    var h = pixels.height;

    var a = this.strength;
    var b = 1 - a;
    for (var i=0, ii=data.length; i<ii; i+=4) {
        data[i + 0] = 
        data[i + 1] = 
        data[i + 2] = (
              0.21 * data[i]
            + 0.71 * data[i + 1]
            + 0.08 * data[i + 2]
        ) > this.strength ? 255 : 0;
    }
    return pixels;
};

module.exports = ThresholdFilter;
