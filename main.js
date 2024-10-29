import LocomotiveScroll from 'locomotive-scroll';
import * as THREE from 'three'
const locomotiveScroll = new LocomotiveScroll();
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'
//import gsap
import { gsap } from "gsap";

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();



// Create the scene
const scene = new THREE.Scene();

const distance = 20;
const fov = 2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI)

// Create a camera
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = distance;

// Create a renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("canvas"),
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);


// Create a images
const planes = []
const imgs = document.querySelectorAll("#img")
imgs.forEach(img => {
  const imagePropertis = img.getBoundingClientRect();
  const geometry = new THREE.PlaneGeometry(imagePropertis.width, imagePropertis.height)
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: {
        value: new THREE.TextureLoader().load(img.src)
      },
      uMouse: {
        value: new THREE.Vector2(0.5, 0.5)
      },
      uHover: {
        value: 0
      }
    },
    vertexShader,
    fragmentShader
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(imagePropertis.left - window.innerWidth / 2 + imagePropertis.width / 2, -imagePropertis.top + window.innerHeight / 2 - imagePropertis.height / 2, 0)
  scene.add(plane);
  planes.push(plane);
})

function setImagePosition() {
  planes.forEach((plane, index) => {
    const imagePropertis = imgs[index].getBoundingClientRect();
    plane.position.set(imagePropertis.left - window.innerWidth / 2 + imagePropertis.width / 2, -imagePropertis.top + window.innerHeight / 2 - imagePropertis.height / 2, 0);
  }
  )
}


// Animation loop
function animate() {
  requestAnimationFrame(animate);
  setImagePosition();
  // render();
  // Render the scene
  renderer.render(scene, camera);
}

// Start the animation
animate();

// Handle window resize
window.addEventListener('resize', () => {
  const newFov = 2 * Math.atan((window.innerHeight / 2) / distance) * (180 / Math.PI);
  camera.fov = newFov;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  setImagePosition();
});

// let isMoving {=} 0;
let inactivityTimer;

function onPointerMove(event) {
  // Reset inactivity timer
  // clearTimeout(inactivityTimer);



  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // Set a timer to detect inactivity (e.g., 200 ms)
  inactivityTimer = setTimeout(() => {
    planes.forEach(plane => {
      gsap.to(plane.material.uniforms.uHover, {
        value: 0,
        duration: 1
      })
    })
  }, 10);


  render();
}



function render() {
  // window.requestAnimationFrame(render);
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(pointer, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(planes);
  // clearTimeout(inactivityTimer);

  if (intersects.length > 0) {

    const uv = intersects[0].uv
    // const tl = gsap.timeline()
    gsap.to(intersects[0].object.material.uniforms.uHover, {
      value: 1,
      duration: 1
    })
    gsap.to(intersects[0].object.material.uniforms.uMouse.value, {
      x: uv.x,
      y: uv.y,
      duration: 1
    })

    // else {
    //   gsap.to(intersects[0].object.material.uniforms.uHover, {
    //     value: 0,
    //     duration: 5,
    //     ease: "power2.inOut"
    //   })
    // }


  }



  renderer.render(scene, camera);

}

window.addEventListener('pointermove', onPointerMove);

