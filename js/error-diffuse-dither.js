(function(imageproc) {
    "use strict";

    /*
     * Apply ordered dithering to the input data
     */
    imageproc.errorDiffuseDither = function(inputData, outputData, matrixType) {
        console.log("Applying error diffusion dithering...");

        /*
         * TODO: You need to extend the dithering processing technique
         * to include multiple matrix types
         */

        // At the moment, the code works only for the Bayer's 2x2 matrix
        // You need to include other matrix types

        // Set up the matrix
        var matrix = [ ];
        var levels = 0;

        // The following code uses Bayer's 2x2 matrix to create the
        // dithering effect. You need to extend it to work for different
        // matrix types
        
        switch(matrixType){ 
            case "Floyd-Steinberg":
                matrix = [  [0, 0, 7], 
                            [3, 5, 1] ];
                levels = 16;
                break;
            case "Jarvis-Judice-Ninke":
                matrix = [  [0, 0, 0, 8, 4],
                            [2, 4, 8, 4, 2],
                            [1, 2, 4, 2, 1]];
                levels = 42;
                break;
            case "line":
                matrix = [  [2.55,   2.55,    2.55,    4.25], 
                            [2.55,   2.55,    4.25,  2.55],
                            [2.55,   4.25,  2.55,    2.55],
                            [4.25, 2.55,    2.55,    2.55]];
                levels = 17;
                break;
            case "diamond":
                matrix = [  [   2.55,    2.55,    4.25  , 2.55], 
                            [   2.55,    4.25,      2.55, 4.25 ],
                            [   4.25,      2.55,    2.55, 2.55],
                            [   2.55,    4.25,      2.55, 4.25 ]];
                levels = 17;
                break;
        }
        //console.log("Done Switch");

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                var pixel = imageproc.getPixel(inputData, x, y);

                // Change the colour to grayscale and normalize it
                var value = (pixel.r + pixel.g + pixel.b) / 3;
                value = value / 255 * levels;

                //This is the RGB version
                //var rvalue = pixel.r / 255 * levels;
                //var gvalue = pixel.g / 255 * levels;
                //var bvalue = pixel.b / 255 * levels;

                // Get the corresponding threshold of the pixel
                var num = parseInt(Math.sqrt(levels-1));
                var threshold = matrix[y % num][x % num];
                //console.log("Done Find");

                // Set the colour to black or white based on threshold
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = 
                outputData.data[i + 1] = 
                outputData.data[i + 2] = (value < threshold)? 0 : 255;

                //RGB version
                // outputData.data[i]     = (rvalue < threshold)? 0 : 255;
                // outputData.data[i + 1] = (gvalue < threshold)? 0 : 255;
                // outputData.data[i + 2] = (bvalue < threshold)? 0 : 255;
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
