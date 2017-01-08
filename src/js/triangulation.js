var gfx = require('gfx');
var Nanobar = require('nanobar');
var DropZone = require('~/js/modules/dropzone.js');
var MorphologicalOperators = require('~/js/modules/gfx/operators/morphological');
var StructuringElement = require('~/js/modules/gfx/operators/morphological/structuring.element');
var Delaunay = require('faster-delaunay');
var tinycolor = require('tinycolor2');
var Queue = require('queue'); 

function Progress() {
    this.bar = new Nanobar({
        id: 'nanobar',
        classname: 'nanobar'
    });
    this.queue = new Queue({
        concurrency: 1
    });
}

function Triangulate(layers) {
    this.layers = layers;

    this.progress = new Progress();

    var source = this.layers.get('median');
    this.imageData = source.ctx.getImageData(source.rect.x, source.rect.y, source.rect.w, source.rect.h);

    var that = this;
    var step = function(percentage, cb) {
        that.progress.bar.go(percentage);
        console.log(percentage);
        setTimeout(cb, 1);
    };

    // Apply Sobel filter
    this.progress.queue.push(function(cb) {
        var sobel = new gfx.Filters.SobelFilter();
        that.imageData = sobel.run(that.imageData);
        step(45, cb);
    });
    var morph = new MorphologicalOperators(that.imageData);
    this.progress.queue.push(function(cb) {
        morph.hitmiss();
        step(50, cb);
    });
    this.progress.queue.push(function(cb) {
        morph.openning(StructuringElement.CROSS);
        step(65, cb);
    });
    var triangles;
    this.progress.queue.push(function(cb) {
        var delaunay = new Delaunay(morph.binary.toPoints());
        triangles = delaunay.triangulate();
        step(85, cb);
    });
    this.progress.queue.push(function(cb) {
        that.renderTriangles(triangles);
        step(95, cb);
    });
    this.progress.queue.start(function(err) {
        step(100, function() {console.log('done');});
    });
}

Triangulate.prototype.renderTriangles = function(triangles) {
    var dest = this.layers.get('triangles');
    var ctx = dest.ctx;
    var rect = this.layers.get('image').rect;
    var xo = rect.x;
    var yo = rect.y;
    var id = this.layers.get('median').ctx.getImageData(xo, yo, rect.w, rect.h);
    var w = id.width;
    var h = id.height;
    var idd = id.data;
    ctx.save();
    ctx.translate(xo, yo);
    for(var i=0; i<triangles.length; i+=3) {
        var t = triangles;
        ctx.beginPath();
        ctx.moveTo(t[i+0][0], t[i+0][1]);
        ctx.lineTo(t[i+1][0], t[i+1][1]);
        ctx.lineTo(t[i+2][0], t[i+2][1]);
        ctx.closePath();

        var cx = ((t[i+0][0]+t[i+1][0]+t[i+2][0])/3)|0;
        var cy = ((t[i+0][1]+t[i+1][1]+t[i+2][1])/3)|0;
        var idx = (cy * w + cx) << 2;
        ctx.strokeStyle = 
        ctx.fillStyle = tinycolor({r:idd[idx+0],g:idd[idx+1],b:idd[idx+2]}).toHexString();
        ctx.fill();
        ctx.stroke();
    }
    ctx.restore();
};


function TriangulationApp(width, height) {
    this.layers = new gfx.CanvasLayers(width, height);
    this.layers.create('median').filters.push(new gfx.Filters.MedianFilter(5));
    this.layers.create('image');
    this.layers.create('triangles');
    this.node = this.layers.node;
    var dz = new DropZone(this.onDropImage.bind(this));
    this.node.appendChild(dz.node);
}
TriangulationApp.prototype = {
    onDropImage: function(img, e) { 
        this.layers.get('image').draw(img, gfx.Canvas.MODE.FIT);
        this.layers.get('median').draw(img, gfx.Canvas.MODE.FIT);
        var t = new Triangulate(this.layers);
    }
};

module.exports = TriangulationApp;
