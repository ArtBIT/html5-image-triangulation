function StructuringElement(data) {
    this.data = data;
    this.diameter = Math.sqrt(data.length);
    this.radius = (this.diameter - 1) >> 1; 
    this.length = data.length;
}
StructuringElement.prototype = {
    dilate: function(el) {
        for (var i = 0; i < this.length; i++) {
            if (el.data[i] == -1) {
                continue;
            }
            if (el.data[i] == 1 && this.data[i] == 1) {
                return 1;
            }
        }
        return 0;
    },
    erode: function(el) {
        for (var i = 0; i < this.length; i++) {
            if (el.data[i] == -1) {
                continue;
            }
            if (el.data[i] != this.data[i] && el.data[i] != 1) {
                return 0;
            }
        }
        return 1;
    },
    equivalence: function(el) {
        for (var i = 0; i < this.length; i++) {
            if (el.data[i] == -1) {
                continue;
            }
            if (el.data[i] != this.data[i]) {
                return 0;
            }
        }
        return 1;
    },
    clone: function() {
        return new StructuringElement(this.data.slice(0));
    }
};
StructuringElement.CROSS = new StructuringElement([
    0, 1, 0,
    1, 1, 1,
    0, 1, 0
]);

StructuringElement.RECT = new StructuringElement([
    1, 1, 1,
    1, 1, 1,
    1, 1, 1
]);

StructuringElement.TOP_RIGHT_CORNER = new StructuringElement([
    -1, 1,-1,
     0, 1, 1,
     0, 0,-1
]);

StructuringElement.TOP_LEFT_CORNER = new StructuringElement([
    -1, 1,-1,
     1, 1, 0,
    -1, 0, 0
]);

StructuringElement.BOTTOM_RIGHT_CORNER = new StructuringElement([
     0, 0,-1,
     0, 1, 1,
    -1, 1,-1
]);

StructuringElement.BOTTOM_LEFT_CORNER = new StructuringElement([
    -1, 0, 0,
     1, 1, 0,
    -1, 1,-1
]);

module.exports = StructuringElement;
