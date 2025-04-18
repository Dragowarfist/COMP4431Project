(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        console.log("Applying blur...");

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel = [ [1, 1, 1], [1, 1, 1], [1, 1, 1] ];

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */
        switch(kernelSize){
            case 3:
                kernel = [ [1, 1, 1], [1, 1, 1], [1, 1, 1] ];
                break;
            case 5:
                kernel = [  [1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1], 
                            [1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1] ];
                break;
            case 7:
                kernel = [  [1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1], 
                            [1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1] ];
                break;
            case 9:
                kernel = [  [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1],
                            [1, 1, 1, 1, 1, 1, 1, 1, 1] ];
                break;
        }

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel

                // Then set the blurred result to the output data
                var sum_r =0;
                var sum_g = 0;
                var sum_b = 0;
                var divisor = 0;
                var loopVal = parseInt(kernelSize/2)
                for(var j = -loopVal; j <= loopVal; ++j){
                    for(var k = -loopVal; k <= loopVal; ++k){
                        var data = imageproc.getPixel(inputData, x + k, y+j, "wrap");
                        var coef = kernel[j+loopVal][k+loopVal];
                        sum_r += data["r"] * coef;
                        sum_g += data["g"] * coef;
                        sum_b += data["b"] * coef;
                        divisor += coef;
                    }
                }
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = sum_r/divisor;
                outputData.data[i + 1] = sum_g / divisor;
                outputData.data[i + 2] = sum_b /divisor;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
