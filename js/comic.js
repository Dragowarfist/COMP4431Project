(function(imageproc) {
    "use strict";

    /* Comic palette colour list */
    var palette = [
        [254, 251, 198],
        [255, 247, 149],
        [255, 240,   1],
        [189, 223, 198],
        [120, 201, 195],
        [  0, 166, 192],
        [190, 219, 152],
        [128, 197, 152],
        [  0, 163, 154],
        [251, 194, 174],
        [244, 148, 150],
        [234,  31, 112],
        [253, 193, 133],
        [246, 146, 120],
        [235,  38,  91],
        [184, 229, 250],
        [109, 207, 246],
        [  0, 173, 239],
        [249, 200, 221],
        [244, 149, 189],
        [233,   3, 137],
        [183, 179, 216],
        [122, 162, 213],
        [  0, 140, 209],
        [184, 137, 189],
        [132, 127, 185],
        [  0, 111, 182],
        [183,  42, 138],
        [143,  50, 141],
        [ 56,  58, 141],
        [187, 176, 174],
        [132, 160, 172],
        [  0, 137, 169],
        [188, 135, 151],
        [139, 126, 152],
        [  1, 110, 151],
        [198, 216,  54],
        [138, 192,  68],
        [  0, 160,  84],
        [190, 175, 136],
        [135, 159, 137],
        [  0, 137, 139],
        [189, 136, 120],
        [140, 126, 123],
        [  0, 110, 125],
        [255, 189,  33],
        [247, 145,  44],
        [236,  42,  50],
        [186,  45, 114],
        [144,  52, 115],
        [ 59,  59, 121],
        [194, 171,  57],
        [142, 156,  68],
        [  0, 135,  79],
        [189,  50,  55],
        [147,  56,  62],
        [ 61,  60,  65],
        [188,  48,  93],
        [145,  54,  97],
        [ 61,  60, 102],
        [191, 134,  57],
        [145, 125,  66],
        [  0, 108,  72],
        [  0,   0,   0],
        [255, 255, 255],
    ];

    /*
     * Convert the colours in the input data to comic colours
     */
    imageproc.comicColor = function(inputData, outputData, saturation) {
        console.log("Applying comic color...");

        /*
         * TODO: You need to complete the comic colour function so that
         * the pixels are mapped to one of the comic colours
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            var r = inputData.data[i];
            var g = inputData.data[i + 1];
            var b = inputData.data[i + 2];
            
            // First, you convert the colour to HSL
            var hsv = imageproc.fromRGBToHSV(r,g,b);
            
            // then, increase the saturation by the saturation factor
            hsv["s"] = hsv["s"] * saturation;
            if(hsv["s"] > 1){
                hsv["s"] = 1;
            }else if(hsv["s"] < 0){
                hsv["s"] = 0;
            }

            // ***** beware of the final range of the saturation *****
            // after that, convert it back to RGB

            var rgb = imageproc.fromHSVToRGB(hsv["h"], hsv["s"], hsv["v"]);
            r = rgb["r"];
            g = rgb["g"];
            b = rgb["b"];

            // Second, based on the saturated colour, find the matching colour
            // from the comic colour palette
            // This is done by finding the minimum distance between the colours

            var curPallete = palette[0];
            var curDistance = Math.hypot(r - curPallete[0], g - curPallete[1], b - curPallete[2]);
            for(var j = 1; j < palette.length; ++j){
                var tempPallete = palette[j];
                var tempDistance = Math.hypot(r - tempPallete[0], g - tempPallete[1], b - tempPallete[2]);
                if(tempDistance < curDistance){
                    curPallete = tempPallete;
                    curDistance = tempDistance;
                }
            }
            r = curPallete[0];
            g = curPallete[1];
            b = curPallete[2];

            outputData.data[i]     = r;
            outputData.data[i + 1] = g;
            outputData.data[i + 2] = b;
        }
    }
 
}(window.imageproc = window.imageproc || {}));
