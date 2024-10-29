
uniform sampler2D uTexture;
varying vec2 vUv;
uniform vec2 uMouse;
uniform float uHover;
void main() {
    float block = 20.0;
    vec2 blockUv=floor(vUv*block) / block;
    vec2 mouse = vec2(0.5,0.5);
    float distance = length(blockUv-uMouse);
    float effect = smoothstep(0.4,0.0,distance);
    vec2 distortion=  vec2(0.1)*effect;
    vec4 color =texture2D(uTexture,vUv+(distortion*uHover));
    gl_FragColor = color; // Red color
}

