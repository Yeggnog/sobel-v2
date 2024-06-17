const detectionVShaderSrc = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec2 texPosition;
    attribute vec3 vertColor;

    varying vec2 texCoord;
    varying vec3 fragColor;

    void main(){
        fragColor = vertColor;
        texCoord = texPosition;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;

const detectionFShaderSrc = `
    precision mediump float;

    uniform sampler2D image;
    uniform vec2 textureSize;
    uniform vec2 minMaxThresholds;
    uniform float modifiers[5];
    uniform vec3 lineColor;
    uniform vec3 BGColor;

    varying vec2 texCoord;
    varying vec3 fragColor;

    void main(){
        mat3 sobelX = mat3(
            1.0, 0.0, -1.0,
            2.0, 0.0, -2.0,
            1.0, 0.0, -1.0
        );
        mat3 sobelY = mat3(
            1.0, 2.0, 1.0,
            0.0, 0.0, 0.0,
            -1.0, -2.0, -1.0
        );
        
        mat3 inputSample;
        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                vec3 colorSample = texture2D(image, (texCoord + (vec2(i-1, j-1)/textureSize.xy) )).rgb;
                
                float val = max(colorSample.r, max(colorSample.g, colorSample.b));
                float alpha = ((2.0*colorSample.r) - colorSample.g - colorSample.b) / 2.0;
                float beta = (sqrt(3.0) / 2.0) * float(colorSample.g - colorSample.b);

                float hue = atan(beta, alpha) / (3.14159) + 1.0;
                float chroma = sqrt(pow(alpha, 2.0) + pow(beta, 2.0));
                float sat = (chroma / max(val, 0.0001));

                inputSample[i][j] = ((hue*modifiers[0]) + (sat*modifiers[1]) + (val*modifiers[2]) + (chroma*modifiers[3]) + (length(colorSample)/1.5*modifiers[4])) / 5.0;
            }
        }
        
        float gradX = dot(sobelX[0], inputSample[0]) + dot(sobelX[1], inputSample[1]) + dot(sobelX[2], inputSample[2]);
        float gradY = dot(sobelY[0], inputSample[0]) + dot(sobelY[1], inputSample[1]) + dot(sobelY[2], inputSample[2]);
        float gradient = sqrt(pow(gradX, 2.0) + pow(gradY, 2.0));

        gradient *= 5.0;
        gradient = max(gradient, minMaxThresholds[0]);
        gradient -= minMaxThresholds[0];
        gradient /= (minMaxThresholds[1] - minMaxThresholds[0]);

        gl_FragColor = vec4( ((1.0-gradient) * BGColor) + (gradient * lineColor), 1.0 );
    }
`;

export { detectionVShaderSrc, detectionFShaderSrc };
