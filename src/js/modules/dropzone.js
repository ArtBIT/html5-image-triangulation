var $ = require('jquery');
function DropZone(callback, options) {
    var self = this;
    options = options || {};
    var $node = $('<div><h2 class="center">Drop Image Here</h2></div>').css({
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        background: '#333',
        zIndex: 100,
        textAlign: 'center'
    });
    var node = self.node = $node.get(0);

    var captureDrag = function(e) {
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy'; // Show the copy icon when dragging over. 
    };
    var handleDrop = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var files = e.dataTransfer.files;
        for (var i = 0, ii = files.length; i < ii; i++) {
            var file = files[i];
            if (file.type.match(/image.*/)) {
                var reader = new FileReader();
                reader.onload = function(ev) { // finished reading file data.
                    if (callback) {
                        var img = new Image();
                        img.onload = function() {
                            callback(this, e);
                        };
                        img.src = ev.target.result;
                    }
                };
                reader.readAsDataURL(file);
            }
        }
        self.hide();
    };
    var onWindowDragEnter = function(e) {
        self.show();
    };
    this.bindEvents = function() {
        node.addEventListener('dragenter', captureDrag);
        node.addEventListener('dragover', captureDrag);
        node.addEventListener('drop', handleDrop);
        window.addEventListener('dragenter', onWindowDragEnter);
    };
    this.unbindEvents = function() {
        node.removeEventListener('dragenter', captureDrag);
        node.removeEventListener('dragover', captureDrag);
        node.removeEventListener('drop', handleDrop);
        window.removeEventListener('dragenter', onWindowDragEnter);
    };
    this.init = this.bindEvents;
    this.destroy = this.unbindEvents;
    this.show = function() { node.style.visibility = "visible"; };
    this.hide = function() { node.style.visibility = "hidden"; };
    this.init();
}

module.exports = DropZone;
