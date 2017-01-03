var Filter = require('./filter');

function GrayscaleFilter(strength) {
    Filter.apply(this, Array.prototype.slice.call(arguments));
    this.strength = Math.min(1, Math.max(0, strength || 0));
}
GrayscaleFilter.prototype = Object.create(Filter.prototype);
GrayscaleFilter.prototype.constructor = GrayscaleFilter;
GrayscaleFilter.prototype.run = function(imageData, options) {
    var data = imageData.data;
    var w = imageData.width;
    var h = imageData.height;

    var a = this.strength;
    var b = 1 - a;
    for (var i=0, ii=data.length; i<ii; i+=4) {
        var value = (0.34 * data[i]
            + 0.5  * data[i + 1]
            + 0.16 * data[i + 2]) | 0;
        data[i + 0] += (value - data[i + 0])* a;
        data[i + 1] += (value - data[i + 1])* a;
        data[i + 2] += (value - data[i + 2])* a;
    }
    return imageData;
};

module.exports = GrayscaleFilter;
