var gfx = require('gfx');
var DropZone = require('~/js/modules/dropzone.js');
var MorphologicalOperators = require('~/js/modules/gfx/operators/morphological');
var StructuringElement = require('~/js/modules/gfx/operators/morphological/structuring.element');
var Delaunay = require('faster-delaunay');
var tinycolor = require('tinycolor2');

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
        this.triangulate();
    },


    triangulate: function() {
        var source = this.layers.get('image');
        var imageData = source.ctx.getImageData(source.rect.x, source.rect.y, source.rect.w, source.rect.h);
        var sobel = new gfx.Filters.SobelFilter();
        imageData = sobel.run(imageData);
        var morph = new MorphologicalOperators(imageData);
        morph.hitmiss();
        morph.openning(StructuringElement.CROSS);
        //morph.render(layer.ctx, 0, 0);
        var delaunay = new Delaunay(morph.binary.toPoints());
        this.renderTriangles(delaunay.triangulate());
    },

    renderTriangles: function(triangles) {
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
    },

    toSVG: function(triangles) {
        var container = document.createElement('div');
        var svgns = "http://www.w3.org/2000/svg";
        var mySvg = document.createElementNS(svgns, "svg");
        mySvg.setAttribute("version", "1.2");
        mySvg.setAttribute("baseProfile", "tiny");
        var svgcontainer = document.createElement('div');
        container.appendChild(svgcontainer);
        svgcontainer.appendChild(mySvg);
        var text = document.createElement('textarea');
        container.appendChild(text);

        for(var i in triangles ) {
            var t = triangles[i];
            var a = t.v0;
            var b = t.v1;
            var c = t.v2;
            var col = stage.getPixel(median_pd.getImageData(), ((a.x + b.x + c.x)/3)|0, ((a.y + b.y + c.y)/3)|0);
            col = 'rgb('+col[0]+','+col[1]+','+col[2]+')';
            var shape = document.createElementNS(svgns, "polygon");
            shape.setAttributeNS(null, "points", a.x + ',' + a.y + ' ' + b.x + ',' + b.y + ' ' + c.x + ',' + c.y + ' ');
            shape.setAttributeNS(null, "fill", col);
            //shape.setAttributeNS(null, "stroke", col);

            mySvg.appendChild(shape);
        }
        text.value = svgcontainer.innerHTML;
        var win = window.open("","SVG Triangulation","resizable=yes");
        win.document.body.appendChild(container);
    }
};

module.exports = TriangulationApp;
