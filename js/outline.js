(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        console.log("Applying Sobel edge detection...");

        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * TODO: You need to write the code to apply
         * the two edge kernels appropriately
         */
        
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                //Gx
                var rGx =0;
                var gGx = 0;
                var bGx = 0;
                var ValGx = 0;
                for(var i = -1; i <=1; ++i){
                    for(var j = -1; j <=1; ++j){
                        var data = imageproc.getPixel(inputData, x + j, y+i, "wrap");
                        var coef = Gx[i+1][j+1];
                        rGx += data["r"] * coef;
                        gGx += data["g"] * coef;
                        bGx += data["b"] * coef;
                        
                    }
                }
                ValGx += (rGx + gGx + bGx)/3;

                //Gy
                var rGy =0;
                var gGy = 0;
                var bGy = 0;
                var ValGy = 0;
                for(var i = -1; i <=1; ++i){
                    for(var j = -1; j <=1; ++j){
                        var data = imageproc.getPixel(inputData, x + j, y+i, "wrap");
                        var coef = Gy[i+1][j+1];
                        rGy += data["r"] * coef;
                        gGy += data["g"] * coef;
                        bGy += data["b"] * coef;
                        
                    }
                }
                ValGy += (rGy + gGy + bGy)/3;


                var i = (x + y * outputData.width) * 4;
                var outVal = (Math.hypot(ValGx, ValGy)> threshold)? 255 : 0;
                outputData.data[i]     = 
                outputData.data[i + 1] = 
                outputData.data[i + 2] = outVal;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
