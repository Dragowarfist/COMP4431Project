(function(imageproc) {
    "use strict";

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

    imageproc.errorDiffuseDither = function(inputData, outputData, matrixType, colorMode) {
        console.log("Applying error diffusion dithering (" + colorMode + ")...");

        const matrixInfo = diffusionMatrices[matrixType];
        if (!matrixInfo) return;

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

        let corList = []
        for(let i = 0; i < inputData.height; ++i){
            for(let j = 0; j < inputData.width; ++j){
                corList.push([i, j]);
            }
                
        }
        
        if(matrixType === "dizzy"){
            corList.sort(() => Math.random() - 0.5);
            
        }

        for (let yp = 0; yp< inputData.height; yp++) {
            for (let xp = 0; xp < inputData.width; xp++) {
                let cor = corList[yp * inputData.width + xp];
                let y = cor[0];
                let x = cor[1];
                const i = (y * inputData.width + x) * 4;
                let offsets, divisor;

                if (matrixType === "variable-coefficient") {
                    // Handle variable coefficient separately
                    const pattern = matrixInfo.getPattern(x, y);
                    offsets = pattern.offsets;
                    divisor = pattern.divisor;
                } else {
                    // Original handling for other methods
                    offsets = matrixInfo.offsets;
                    divisor = matrixInfo.divisor;
                }

                // Process channels
                if (useGrayscale) {
                    // Grayscale processing
                    const oldValue = buffer.data[i];
                    const newValue = oldValue > 128 ? 255 : 0;
                    const error = oldValue - newValue;

                    // Set output pixel
                    outputData.data[i] = outputData.data[i+1] = outputData.data[i+2] = newValue;
                    

                    let value = 0;
                    let neighbors = 0;
                    //find num of errors to not propogate
                    if(matrixType === "dizzy"){
                        offsets.forEach(offset => {
                            const nx = x + offset.x;
                            const ny = y + offset.y;
                            
                            if (nx >= 0 && nx < inputData.width && ny >= 0 && ny < inputData.height) {
                                const ni = (ny * inputData.width + nx) * 4;
                                const delta = error * (offset.w || offset.weight) / divisor;
                                if(buffer.data[ni] == 0 || buffer.data[ni] == 255){
                                    value += delta;
                                    neighbors++;
                                }
                            }
                        });
                    }
                    if(neighbors == 0) neighbors = 1;

                    // Diffuse error to neighbors
                    offsets.forEach(offset => {
                        const nx = x + offset.x;
                        const ny = y + offset.y;
                        
                        if (nx >= 0 && nx < inputData.width && ny >= 0 && ny < inputData.height) {
                            const ni = (ny * inputData.width + nx) * 4;
                            const delta = error * (offset.w || offset.weight) / divisor + (value/ neighbors);
                            
                            if(matrixType === "dizzy"){
                                if(buffer.data[ni] != 0 && buffer.data[ni] != 255){
                                    buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
                                }
                            }else{
                                buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
                            }
                        }
                    });
                } else {
                    // RGB channel processing
                    for (let c = 0; c < 3; c++) {
                        const oldValue = buffer.data[i + c];
                        const newValue = oldValue > 128 ? 255 : 0;
                        const error = oldValue - newValue;

                        // Set output channel
                        outputData.data[i + c] = newValue;

                        let value = 0;
                        let neighbors = 0;
                        //find num of errors to not propogate
                        if(matrixType === "dizzy"){
                            offsets.forEach(offset => {
                                const nx = x + offset.x;
                                const ny = y + offset.y;
                                
                                if (nx >= 0 && nx < inputData.width && ny >= 0 && ny < inputData.height) {
                                    const ni = (ny * inputData.width + nx) * 4 + c;
                                    const delta = error * (offset.w || offset.weight) / divisor;
                                    if(buffer.data[ni] == 0 || buffer.data[ni] == 255){
                                        value += delta;
                                        neighbors++;
                                    }
                                }
                            });
                        }
                        if(neighbors == 0) neighbors = 1;

                        // Diffuse error to neighbors
                        offsets.forEach(offset => {
                            const nx = x + offset.x;
                            const ny = y + offset.y;
                            
                            if (nx >= 0 && nx < inputData.width && ny >= 0 && ny < inputData.height) {
                                const ni = (ny * inputData.width + nx) * 4 + c;
                                const delta = error * (offset.w || offset.weight) / divisor;
                                
                                if(matrixType === "dizzy"){
                                    if(buffer.data[ni] != 0 && buffer.data[ni] != 255){
                                        buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
                                    }
                                }else{
                                    buffer.data[ni] = Math.min(255, Math.max(0, buffer.data[ni] + delta));
                                }
                            }
                        });
                    }
                }
                
                outputData.data[i+3] = 255; // Preserve alpha
            }
        }
    };
}(window.imageproc = window.imageproc || {}));