(function(imageproc) {
    "use strict";

    /*
     * Apply ordered dithering to the input data
     */
    imageproc.dither = function(inputData, outputData, matrixType, colorMode) {
        console.log("Applying dithering...");

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
            case "bayer2":
                matrix = [  [1, 3], 
                            [4, 2] ];
                levels = 5;
                break;
            case "bayer4":
                matrix = [  [1, 9, 3, 11], 
                            [13, 5, 15, 7], 
                            [4, 12, 2, 10], 
                            [16, 8, 14, 6] ];
                levels = 17;
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

                var num = parseInt(Math.sqrt(levels-1));
                var threshold = matrix[y % num][x % num];
                var i = (x + y * outputData.width) * 4;

                if(colorMode === "original"){
                    //console.log("Hello");
                    // Change the colour to grayscale and normalize it
                    var value = (pixel.r + pixel.g + pixel.b) / 3;
                    value = value / 255 * levels;

                    
                    outputData.data[i]     = 
                    outputData.data[i + 1] = 
                    outputData.data[i + 2] = (value < threshold)? 0 : 255;
                    



                }else{
                    //console.log("RGB");
                    //This is the RGB version
                    var rvalue = pixel.r / 255 * levels;
                    var gvalue = pixel.g / 255 * levels;
                    var bvalue = pixel.b / 255 * levels;

                    outputData.data[i]     = (rvalue < threshold)? 0 : 255;
                    outputData.data[i + 1] = (gvalue < threshold)? 0 : 255;
                    outputData.data[i + 2] = (bvalue < threshold)? 0 : 255;

                }

            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
