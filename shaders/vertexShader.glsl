varying vec2 vUv;
void main() {
    vUv=uv;
    // Apply the model, view, and projection transformations
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * worldPosition;
    gl_Position = projectionMatrix * viewPosition;
}