var Canvas = require('./index.js');

function CanvasLayers(width, height) {

    this.create = function(name) {
        var layer = new Canvas(width, height);
        layer.clear();
        layer.node.style.position = 'absolute';
        layer.node.style.zIndex = this.zIndex++;
        this.node.appendChild(layer.node);
        this.layers[name] = layer;
        return layer;
    };
    this.get = function(name) {
        if (this.layers.hasOwnProperty(name)) {
            return this.layers[name];
        }
    };
    this.remove = function(name) {
        var layer = this.get(name);
        if (layer) {
            layer.destroy();
            delete(this.layers[name]);
        }
    };
    this.each = function(callback) {
        for (var name in this.layers) if (this.layers.hasOwnProperty(name)) {
            callback(name, this.layers[name]);
        }
    };
    this.resize = function(width, height) {
        this.node.style.position = 'relative';
        this.node.style.width = width + 'px';
        this.node.style.height = height + 'px';
        this.each(function(name, layer) {
            layer.resize(width, height);
        });
    };

    this.node = document.createElement('div');
    this.zIndex = 0;
    this.layers = {};
    this.resize(width, height);
}

module.exports = CanvasLayers;
