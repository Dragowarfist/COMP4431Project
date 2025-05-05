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
        var rows = inputData.height;
        var cols = inputData.width;
        var error = [];
        for(var i = 0; i < rows; ++i){
            error[i] = [];
            for(var j = 0; j < cols; ++j){
                error[i].push(parseFloat(0));
            }
        }
        var size = 0;
        var matrixWidth = 0;
        var matrixRow = 0;

        // The following code uses Bayer's 2x2 matrix to create the
        // dithering effect. You need to extend it to work for different
        // matrix types
        
        
        switch(matrixType){ 
            case "Floyd-Steinberg":
                matrix = [  [0, 0, 7], 
                            [3, 5, 1] ];
                levels = 16;
                size = 1;
                matrixWidth = 3;
                matrixRow = 2;
                break;
            case "Jarvis-Judice-Ninke":
                matrix = [  [0, 0, 0, 8, 4],
                            [2, 4, 8, 4, 2],
                            [1, 2, 4, 2, 1]];
                levels = 42;
                size = 2;
                matrixWidth = 5;
                matrixRow = 3;
                break;
            case "Fan":
                matrix = [  [0, 0, 0, 7],
                            [1, 3, 5, 0]];
                levels = 16;
                size = 2;
                matrixWidth = 4;
                matrixRow = 3;
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
        
        console.log(inputData.width, inputData.width);

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                var pixel = imageproc.getPixel(inputData, x, y);
                

                var grayscale = (pixel.r + pixel.b + pixel.g)/3;
                //console.log(error[y][x], x, y);
                //console.log(grayscale);
                grayscale += error[y][x];
                //console.log(grayscale);
                

                var result;

                if(grayscale < 128){
                    result = 0;
                }else{
                    result = 255
                }
                
                //console.log("Start Loop");
                for(var i = 0; i < matrixRow; ++i){
                    //console.log(i);
                    for(var j = -size ; j+size < matrixWidth; ++j){
                        //console.log(i, j);
                        if(x+j < 0 || x+j >= inputData.width || y + i >= inputData.height){
                            continue;
                        }
                        // if(j == 0 || i == 0 || (x - j < 0)){
                        //     continue;
                        // }
                        //console.log(i , j + size);
                        error[y+i][x+j] -= matrix[i][j + size] * (result - grayscale) / levels;
                        //console.log(matrix[i][j + size] * (result - grayscale) / levels);
                    }
                    
                }

                
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = 
                outputData.data[i + 1] = 
                outputData.data[i + 2] = result;

                
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
