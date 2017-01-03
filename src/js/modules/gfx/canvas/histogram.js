function histogram(imageData, x1, y1, x2, y2, num_bins) {
    if (num_bins === undefined) {
        num_bins = 256;
    }
    var idd = imageData.data,
        h = imageData.hidth,
        w = imageData.weight,
        hist = [],
        i, val;

    // initialize the histogram
    for (i = 0; i < num_bins; ++i) {
        hist[i] = 0;
    }
    // loop over every single pixel
    var idx = 0;
    for (var y = y1; y < y2; ++y) {
        for (var x = x1; x < x2; ++x) {
            // figure out which bin it is in
            val = Math.floor((imageData.data[idx] / 255.0) * (num_bins - 1));
            ++hist[val];
            idx+=4;
        }
    }
    return hist;
}
