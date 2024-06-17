import { detectionVShaderSrc, detectionFShaderSrc } from './DetectionPassShaders.js';

let allShadersCompiled = false;
let shaderProgram = null;

export function initPreview(modifiers, minMaxValues, colors){
    const canvas = document.getElementById('GLCanvas');
    const gl = canvas.getContext('webgl');

    // if webgl isn't supported, quit
    if(gl === null){
        console.log('Your browser does not support WebGL. Sobel needs WebGL to function.');
        return;
    }

    // set clearing
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(!allShadersCompiled){
        shaderProgram = compileAndLinkShaders(gl, detectionVShaderSrc, detectionFShaderSrc);
        allShadersCompiled = true;
    }
    gl.useProgram(shaderProgram);


    // initialize buffers for the draw call
    initBuffers(gl, shaderProgram);

    // load texture
    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // bind to texture 0
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE0);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    var textureSrc = document.getElementById('PreviewImg');
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
        textureSrc
    );

    // set image size uniform
    var imgSizeUniformLocation = gl.getUniformLocation(shaderProgram, 'textureSize');
    gl.uniform2f(imgSizeUniformLocation, textureSrc.naturalWidth, textureSrc.naturalHeight);

    // set min-max uniform
    var minmaxUniformLocation = gl.getUniformLocation(shaderProgram, 'minMaxThresholds');
    gl.uniform2f(minmaxUniformLocation, minMaxValues[0], minMaxValues[1]);

    // set modifiers uniform
    var modifiersUniformLocation = gl.getUniformLocation(shaderProgram, 'modifiers');
    gl.uniform1fv(modifiersUniformLocation, modifiers);

    // set color uniforms
    var lineColorUniformLocation = gl.getUniformLocation(shaderProgram, 'lineColor');
    gl.uniform3f(lineColorUniformLocation, colors[0][0], colors[0][1], colors[0][2]);
    var BGColorUniformLocation = gl.getUniformLocation(shaderProgram, 'BGColor');
    gl.uniform3f(BGColorUniformLocation, colors[1][0], colors[1][1], colors[1][2]);


    // draw call
    const verticesToSkip = 0;
    const verticesToDraw = 6;
    gl.drawArrays(gl.TRIANGLES, verticesToSkip, verticesToDraw);
}


function initBuffers(gl, program){
    setPositionAttribute(gl, program);
    setTextureCoordAttribute(gl, program);
}

function compileAndLinkShaders(gl, vShaderSrc, fShaderSrc){
    // declare shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    // compile shaders
    gl.shaderSource(vertexShader, vShaderSrc);
    gl.compileShader(vertexShader);
    gl.shaderSource(fragmentShader, fShaderSrc);
    gl.compileShader(fragmentShader);

    // check for errors
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error("[!] The vertex shader has compilation errors. [!]\n", gl.getShaderInfoLog(vertexShader));
        return null;
    }
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error("[!] The fragment shader has compilation errors. [!]\n", gl.getShaderInfoLog(fragmentShader));
        return null;
    }

    // combine shaders into a program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // check for post-compiling linker errors
    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        console.error("[!] The program has linking errors. [!]\n", gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    // check that it's all valid (remove this outside of debug releases / shader development)
    /*gl.validateProgram(shaderProgram);
    if(!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)){
        console.error("[!] The program has validation errors. [!]\n", gl.getProgramInfoLog(shaderProgram));
        return null;
    }*/

    return shaderProgram;
}

function setPositionAttribute(gl, program){
    var triangleVertices = [
    //  X,   Y
        1.0, -1.0,
        1.0, 1.0,
        -1.0, 1.0,
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0
    ];
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW); // not going to change the geometry once sent

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
        positionAttribLocation,
        2, // data points per buffer read
        gl.FLOAT, // type of data points
        false, // don't normalize
        0, // stride (don't use)
        0 // offset (don't use)
    );
    gl.enableVertexAttribArray(positionAttribLocation);
}

function setTextureCoordAttribute(gl, program){
    var textureCoords = [
        //  X,   Y
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
            0.0, 1.0,
            0.0, 0.0,
            1.0, 0.0
        ];
        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    
        var positionAttribLocation = gl.getAttribLocation(program, 'texPosition');
        gl.vertexAttribPointer(
            positionAttribLocation,
            2, // data points per buffer read
            gl.FLOAT, // type of data points
            false, // don't normalize
            0, // stride (don't use)
            0 // offset (don't use)
        );
        gl.enableVertexAttribArray(positionAttribLocation);
}
