(function(imageproc) {
    "use strict";

    const orderedMatrices = {
        "bayer2":{
            thresholds: [   [1 , 3],
                            [4, 2]
            ],
            levels : 5,
            xsize : 2,
            ysize : 2
        },
        "bayer4":{
            thresholds:  [  [1, 9, 3, 11], 
                            [13, 5, 15, 7], 
                            [4, 12, 2, 10], 
                            [16, 8, 14, 6] ],
            levels : 17,
            xsize : 4,
            ysize : 4,
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

    imageproc.mixedDither = function(inputData, outputData, ditherMatrixType, errorMatrixType, colorMode) {
        console.log("Applying mixed dithering (" + colorMode + ")...");
        console.log("Hello");
        const ditherMatrixInfo = orderedMatrices[ditherMatrixType];
        if(!ditherMatrixInfo) return;

        console.log("Hello");

        const errorMatrixInfo = diffusionMatrices[errorMatrixType];
        if (!errorMatrixInfo) return;

        console.log("Hello");

        let xsize, ysize;
        xsize = ditherMatrixInfo.xsize;
        ysize = ditherMatrixInfo.ysize;
        const thresholdMatrix = ditherMatrixInfo.thresholds;
        console.log("Hello");
    

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
        console.log("Hello");
        for (let y = 0; y < inputData.height; y++) {
            for (let x = 0; x < inputData.width; x++) {
                const i = (y * inputData.width + x) * 4;
                let offsets, divisor;
                
                var threshold = thresholdMatrix[x % xsize][y % ysize] / ditherMatrixInfo.levels * 255;

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
                    const oldValue = buffer.data[i];
                    const newValue = oldValue > threshold ? 255 : 0;
                    const error = oldValue - newValue;

                    // Set output pixel
                    outputData.data[i] = outputData.data[i+1] = outputData.data[i+2] = newValue;

                    // Diffuse error to neighbors
                    offsets.forEach(offset => {
                        const nx = x + offset.x;
                        const ny = y + offset.y;
                        
                        if (nx >= 0 && nx < inputData.width && ny >= 0 && ny < inputData.height) {
                            const ni = (ny * inputData.width + nx) * 4;
                            const delta = error * (offset.w || offset.weight) / divisor;
                            buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
                        }
                    });
                } else {
                    // RGB channel processing
                    for (let c = 0; c < 3; c++) {
                        const oldValue = buffer.data[i + c];
                        const newValue = oldValue > threshold ? 255 : 0;
                        const error = oldValue - newValue;

                        // Set output channel
                        outputData.data[i + c] = newValue;

                        // Diffuse error to neighbors
                        offsets.forEach(offset => {
                            const nx = x + offset.x;
                            const ny = y + offset.y;
                            
                            if (nx >= 0 && nx < inputData.width && ny >= 0 && ny < inputData.height) {
                                const ni = (ny * inputData.width + nx) * 4 + c;
                                const delta = error * (offset.w || offset.weight) / divisor;
                                buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
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