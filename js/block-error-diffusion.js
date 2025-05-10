(function(imageproc) {
    "use strict";

    const blockMatrices = {
        "Damera-Venkata-Evans2":{
            weights: [[1, 1,] ,
                        [1 ,1]
            ],
            divisor  : 4,
            xsize : 2,
            ysize : 2,

            choices: [
                [   [255, 255],
                    [255, 255]],

                [   [255, 0 ], 
                    [255, 0]],

                [   [0, 0],
                    [255, 255]],

                [   [0 , 255],
                    [0, 255]],

                [   [255, 255],
                    [0, 0]],
                
                [   [0, 0],
                    [0, 0]]
            ],

            numChoices : 6

        },
        "Weighted":{
            weights: [   [6 , 5],
                            [3 , 2]
            ],
            divisor : 16,
            xsize : 2,
            ysize : 2,

            choices: [
                [   [255, 255],
                    [255, 255]],

                [   [255, 0 ], 
                    [255, 0]],

                [   [0, 0],
                    [255, 255]],

                [   [0 , 255],
                    [0, 255]],

                [   [255, 255],
                    [0, 0]],
                
                [   [0, 0],
                    [0, 0]]
            ],

            numChoices : 6

        },"3dimension":{
            weights: [   [1 , 1, 1],
                         [1 , 1, 1],
                         [1 , 1, 1]
            ],
            divisor : 9,
            xsize : 3,
            ysize : 3,

            choices: [
                [   [255, 255, 255],
                    [255, 255, 255],
                    [255, 255, 255]],

                [   [0, 255, 255],
                    [255, 255, 255],
                    [255, 255, 255]],

                [   [255, 0, 255],
                    [255, 255, 255],
                    [255, 255, 255]],

                [   [255, 255, 0],
                    [255, 255, 255],
                    [255, 255, 255]],

                [   [255, 255, 255],
                    [0, 255, 255],
                    [255, 255, 255]],
                
                [   [255, 255, 255],
                    [255, 0, 255],
                    [255, 255, 255]],
                
                [   [255, 255, 255],
                    [255, 255, 0],
                    [255, 255, 255]],

                [   [255, 255, 255],
                    [255, 255, 255],
                    [0, 255, 255]],

                [   [255, 255, 255],
                    [255, 255, 255],
                    [255, 0, 255]],

                [   [255, 255, 255],
                    [255, 255, 255],
                    [255, 255, 0]],

                [   [0, 0, 255],
                    [0, 0, 255],
                    [255, 255, 255]],

                [   [255, 0, 0],
                    [255, 0, 0],
                    [255, 255, 255]],

                [   [255, 255, 255],
                    [0, 0, 255],
                    [0, 0, 255]],

                [   [255, 255, 255],
                    [255, 0, 0],
                    [255, 0, 0]],

                [   [0, 0, 0],
                    [0, 0, 0],
                    [0, 0, 0]],
            ],

            numChoices : 15

        }
    }

    // Error diffusion matrices
    const diffusionMatrices = {
        "Floyd-Steinberg": {
            offsets: [
                {x: 1, y: 0, weight: 7},
                {x: -1, y: 1, weight: 3},
                {x: 0, y: 1, weight: 5},
                {x: 1, y: 1, weight: 1}
            ],
            divisor: 16
        },"Fan" : {
            offsets: [
                {x: 1, y: 0, weight: 7},
                {x: -2, y: 1, weight: 1},
                {x: -1, y: 1, weight: 3},
                {x: 0, y: 1, weight: 5}
            ],
            divisor: 16
        },
        "Jarvis-Judice-Ninke": {
            offsets: [
                {x: 1, y: 0, weight: 7},
                {x: 2, y: 0, weight: 5},
                {x: -2, y: 1, weight: 3},
                {x: -1, y: 1, weight: 5},
                {x: 0, y: 1, weight: 7},
                {x: 1, y: 1, weight: 5},
                {x: 2, y: 1, weight: 3},
                {x: -2, y: 2, weight: 1},
                {x: -1, y: 2, weight: 3},
                {x: 0, y: 2, weight: 5},
                {x: 1, y: 2, weight: 3},
                {x: 2, y: 2, weight: 1}
            ],
            divisor: 48
        },
        "Stucki": {
            offsets: [
                {x: 1, y: 0, weight: 8},
                {x: 2, y: 0, weight: 4},
                {x: -2, y: 1, weight: 2},
                {x: -1, y: 1, weight: 4},
                {x: 0, y: 1, weight: 8},
                {x: 1, y: 1, weight: 4},
                {x: 2, y: 1, weight: 2},
                {x: -2, y: 2, weight: 1},
                {x: -1, y: 2, weight: 2},
                {x: 0, y: 2, weight: 4},
                {x: 1, y: 2, weight: 2},
                {x: 2, y: 2, weight: 1}
            ],
            divisor: 42
        },
        "Atkinson": {
            offsets: [
                {x: 1, y: 0, weight: 1},
                {x: 2, y: 0, weight: 1},
                {x: -1, y: 1, weight: 1},
                {x: 0, y: 1, weight: 1},
                {x: 1, y: 1, weight: 1},
                {x: 0, y: 2, weight: 1},
            ],
            divisor: 8
        },
        "dizzy": {
            offsets: [
                // First ring
                {x: 1, y: 0, weight: 8},
                {x: 1, y: 1, weight: 4},
                {x: 0, y: 1, weight: 6},
                {x: -1, y: 1, weight: 4},
                {x: -1, y: 0, weight: 8},
                {x: -1, y: -1, weight: 4},
                {x: 0, y: -1, weight: 6},
                {x: 1, y: -1, weight: 4},
                // Second ring
                {x: 2, y: 0, weight: 4},
                {x: 2, y: 1, weight: 2},
                {x: 2, y: 2, weight: 1},
                {x: 1, y: 2, weight: 2},
                {x: 0, y: 2, weight: 3},
                {x: -1, y: 2, weight: 2},
                {x: -2, y: 2, weight: 1},
                {x: -2, y: 1, weight: 2},
                {x: -2, y: 0, weight: 4},
                {x: -2, y: -1, weight: 2},
                {x: -2, y: -2, weight: 1},
                {x: -1, y: -2, weight: 2},
                {x: 0, y: -2, weight: 3},
                {x: 1, y: -2, weight: 2},
                {x: 2, y: -2, weight: 1},
                {x: 2, y: -1, weight: 2}
            ],
            divisor: 64
        },
        "variable-coefficient": {
            getPattern: function(x, y) {
                // Implementation based on Ostromoukhov's paper
                const patterns = [
                    {offsets: [{x:1,y:0,w:11}, {x:-1,y:1,w:5}], divisor: 16},
                    {offsets: [{x:1,y:0,w:9}, {x:0,y:1,w:5}, {x:1,y:1,w:2}], divisor: 16},
                    {offsets: [{x:1,y:0,w:7}, {x:-1,y:1,w:13}], divisor: 20},
                    {offsets: [{x:1,y:0,w:15}, {x:-1,y:1,w:1}], divisor: 16}
                ];
                return patterns[(x + y * 3) % 4];
            }
        }
    };

    imageproc.blockErrorDither = function(inputData, outputData, blockMatrixType, errorMatrixType, colorMode) {
        console.log("Applying block error diffusion dithering (" + colorMode + ")...");
        //console.log("Hello");
        const blockMatrixInfo = blockMatrices[blockMatrixType];
        if(!blockMatrixInfo) return;

        //console.log("Hello");

        const errorMatrixInfo = diffusionMatrices[errorMatrixType];
        if (!errorMatrixInfo) return;

        //console.log("Hello");

        let xsize, ysize;
        xsize = blockMatrixInfo.xsize;
        ysize = blockMatrixInfo.ysize;
        const blockMatrix = blockMatrixInfo.weights;
        //console.log("Hello");
    

        // Create working buffer using existing method
        const buffer = imageproc.createBuffer(outputData);
        imageproc.copyImageData(inputData, buffer);

        // Convert to grayscale if needed
        const useGrayscale = colorMode === "original";
        if (useGrayscale) {
            const grayscaleBuffer = imageproc.createBuffer(outputData);
            imageproc.grayscale(buffer, grayscaleBuffer);
            imageproc.copyImageData(grayscaleBuffer, buffer);
        }
        //console.log("Hello");
        for (let y = 0; y < inputData.height; y+=ysize) {
            for (let x = 0; x < inputData.width; x+=xsize) {
                const i = (y * inputData.width + x) * 4;
                let offsets, divisor;

                if (errorMatrixType === "variable-coefficient") {
                    // Handle variable coefficient separately
                    const pattern = errorMatrixInfo.getPattern(x, y);
                    offsets = pattern.offsets;
                    divisor = pattern.divisor;
                } else {
                    // Original handling for other methods
                    offsets = errorMatrixInfo.offsets;
                    divisor = errorMatrixInfo.divisor;
                }
            

                // Process channels
                if (useGrayscale) {
                    // Grayscale processing
                    
                    var totalError = 0;
                    var minError = 256*4;
                    var choose = 0;

                    for(var choice = 0; choice < blockMatrixInfo.numChoices; ++choice){
                        var curTotal = 0;
                        var minVal = 0;
                        for(var y1 = 0; y1 < ysize; ++y1){
                            for(var x1 = 0; x1 < xsize; ++x1){
                                const oldValue = buffer.data[i];
                                const newValue = blockMatrixInfo.choices[choice][y1][x1];
                                const error = oldValue - newValue;
                                curTotal += error;
                                minVal += Math.abs(error);
                            }
                        }
                        if(minVal < minError){
                            minError = minVal;
                            totalError = curTotal;
                            choose = choice;
                            
                        }
                    }
                    //console.log(choose);

                    for(var y1 = 0; y1 < ysize; ++y1){
                        for(var x1 = 0; x1 < xsize; ++x1){
                            var j = i + (y1 * inputData.width + x1) * 4;
                            // Set output pixel
                            outputData.data[j] = outputData.data[j+1] = outputData.data[j+2] = blockMatrixInfo.choices[choose][y1][x1];
                        }
                    }

                    //processing the table
                    
                
                    

                    // Diffuse error to neighbors
                    offsets.forEach(offset => {
                        const nx = x + xsize - 1 + offset.x;
                        const ny = y + ysize - 1 +  offset.y;

                        for(var y1 = 0; y1 < ysize; ++y1){
                            for(var x1 = 0; x1 < xsize; ++x1){
                                
                                var x2 = nx + x1;
                                var y2 = ny + y1;

                                if (x2 >= 0 && x2 < inputData.width && y2 >= 0 && y2 < inputData.height) {
                                    const ni = (y2 * inputData.width + x2) * 4;
                                    var num = blockMatrixInfo.weights[y1][x1];
                                    const delta = num *  totalError * (offset.w || offset.weight) / (divisor * blockMatrixInfo.divisor);
                                    buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
                                }
                            }
                        }  
                    });

                } else {
                    // RGB channel processing
                    for (let c = 0; c < 3; c++) {

                        var totalError = 0;
                        var minError = 256*4;
                        var choose = 0;

                        for(var choice = 0; choice < blockMatrixInfo.numChoices; ++choice){
                            var curTotal = 0;
                            var minVal = 0;
                            for(var y1 = 0; y1 < ysize; ++y1){
                                for(var x1 = 0; x1 < xsize; ++x1){
                                    const oldValue = buffer.data[i + c];
                                    const newValue = blockMatrixInfo.choices[choice][y1][x1];
                                    const error = oldValue - newValue;
                                    curTotal += error;
                                    minVal += Math.abs(error);
                                }
                            }
                            if(minVal < minError){
                                minError = minVal;
                                totalError = curTotal;
                                choose = choice;
                                
                            }
                        }
                        //console.log(choose);

                        for(var y1 = 0; y1 < ysize; ++y1){
                            for(var x1 = 0; x1 < xsize; ++x1){
                                var j = i + (y1 * inputData.width + x1) * 4;
                                // Set output pixel
                                outputData.data[j+c] =  blockMatrixInfo.choices[choose][y1][x1];
                            }
                        }

                        

                        // Diffuse error to neighbors
                        offsets.forEach(offset => {
                            const nx = x + offset.x;
                            const ny = y + offset.y;

                             for(var y1 = 0; y1 < ysize; ++y1){
                                for(var x1 = 0; x1 < xsize; ++x1){
                                    
                                    var x2 = nx + x1;
                                    var y2 = ny + y1;

                                    if (x2 >= 0 && x2 < inputData.width && y2 >= 0 && y2 < inputData.height) {
                                        const ni = (y2 * inputData.width + x2) * 4 + c;
                                        var num = blockMatrixInfo.weights[y1][x1];
                                        const delta = num *  totalError * (offset.w || offset.weight) / (divisor * blockMatrixInfo.divisor);
                                        buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
                                    }
                                }
                            }  
                    
                        });
                    }
                }
                
                outputData.data[i+3] = 255; // Preserve alpha
            }
        }
        console.log("Hello");
    };
}(window.imageproc = window.imageproc || {}));