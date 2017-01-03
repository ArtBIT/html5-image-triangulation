var norm = function(value, min, max) {
    return (value - min) / (max - min);
};
var lerp = function(norm, min, max) {
    return (max - min) * norm + min;
};
var map = function(value, sourceMin, sourceMax, destMin, destMax) {
    return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
};
var clamp = function(value, min, max) {
    return Math.max(Math.min(min,max), Math.min(Math.max(min, max), value));
};
module.exports = {
    norm: norm,
    lerp: lerp,
    map: map,
    clamp: clamp
};
