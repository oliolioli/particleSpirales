import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

// Declare scene, camera, renderer, and instanced meshes
let scene, camera, renderer, labelRenderer;
let spheres;
let sphereCount = 0; // Keep track of how many spheres have been added

// Time delay for the spiral growth (in milliseconds)
const timeDelay = 50; // Faster time delay for smoother growth

// Spiral parameters
const maxRadius = 1; // Smaller maximum radius for the spiral
const zoomStartThreshold = 0.3; // Start zooming out when the radius exceeds 0.3
const zoomSpeed = 0.05; // Speed of zoom out (FOV decrease)
const cameraZBase = 10; // Base camera position (before zoom out starts)

// Create an HTML element to display the number of points
let pointCountText = document.createElement('div');
pointCountText.style.position = 'absolute';
pointCountText.style.top = '10px';
pointCountText.style.left = '10px';
pointCountText.style.color = 'white';
pointCountText.style.fontSize = '16px';
document.body.appendChild(pointCountText);

// Function to initialize the scene
function initializeScene() {
    // Scene, Camera, Renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000); // Increased far plane to 10000
    renderer = new THREE.WebGLRenderer({ antialias: true });
    labelRenderer = new CSS2DRenderer(); // CSS2DRenderer for the text

    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 10);
    scene.add(directionalLight);

    // Camera Position
    camera.position.set(0, 0, cameraZBase); // Base camera position
    camera.lookAt(0, 0, 0);

    // Create instanced sphere geometry
    const sphereGeometry = new THREE.SphereGeometry(0.025, 16, 16); // Smaller spheres
    const material = new THREE.MeshStandardMaterial({
        color: 0x0077ff,
        roughness: 0.4,
        metalness: 0.3,
    });

    // Create an instanced mesh for the spheres
    spheres = new THREE.InstancedMesh(sphereGeometry, material, 10000); // Increased max spheres
    spheres.instanceMatrix.setUsage(THREE.DynamicDrawUsage); // To allow for updates to the matrix
    scene.add(spheres);

    // Start Animation Loop
    animate();
}

// Function to add a sphere at specific coordinates
function addSphere(x, y, z = 0) {
    const matrix = new THREE.Matrix4();
    matrix.setPosition(x, y, z);

    // Set the transformation matrix for the new sphere
    spheres.setMatrixAt(sphereCount, matrix);
    sphereCount++; // Increment the sphere count

    // Optionally, you can update the material or other properties of specific instances here
    spheres.instanceMatrix.needsUpdate = true;

    // Update the point count text
    pointCountText.innerText = `Points: ${sphereCount}`;
}

// Function to create a growing spiral with time delay
let angle = 0;
let radius = 0;
let height = 0;
let lastUpdateTime = 0;

function growSpiral() {
    const currentTime = Date.now();
    if (currentTime - lastUpdateTime > timeDelay) {
        // Spiral parameters (can tweak these to adjust the speed)
        const angleIncrement = Math.PI / 20; // Controls the spiral's angular increment
        const heightIncrement = 0.02; // Controls how fast the spiral grows vertically
        const radiusIncrement = 0.005; // Slower radius growth for a tighter spiral

        // Calculate the x, y, z coordinates for the next point in the spiral
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const z = height;

        // Add the sphere at the calculated position
        addSphere(x, y, z);

        // Update the spiral parameters
        angle += angleIncrement;
        radius += radiusIncrement; // Slower radius growth
        height += heightIncrement; // Gradually increases the height to create the spiral effect

        // Update the last time the spiral was updated
        lastUpdateTime = currentTime;
    }

    // Start zoom-out when the radius exceeds a certain threshold
    if (radius > zoomStartThreshold) {
        // Zoom out by adjusting the camera's position and field of view
        const zoomFactor = (radius - zoomStartThreshold) * 10; // Controls how fast the zoom-out happens
        camera.position.z = Math.max(cameraZBase, cameraZBase + zoomFactor); // Increase Z position for zoom-out
        camera.fov = Math.max(25, camera.fov - zoomSpeed); // Decrease FOV for zoom-out
        camera.updateProjectionMatrix(); // Apply the updated camera FOV

        // Dynamically adjust the far plane of the camera to ensure the furthest points are visible
        const farPlaneDistance = Math.max(camera.position.z * 2, radius + 50); // Ensure it's at least 50 units larger than radius
        camera.far = farPlaneDistance;
        camera.near = Math.max(camera.position.z * 0.1, 0.1);
        camera.updateProjectionMatrix(); // Recompute projection matrix
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Gradually grow the spiral with a delay
    growSpiral();

    // Update the renderer and the text renderer
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

// Initialize the scene
initializeScene();
