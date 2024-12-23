import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

window.addEventListener('load', async () => {
    console.log('Script started');

    const container = document.getElementById('threeDContainer');
    if (!container) {
        console.error('Container not found!');
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Debug helpers
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Model loading from a URL (using CORS proxy for testing)
    const loader = new GLTFLoader();
    const modelUrl = 'https://cors-anywhere.herokuapp.com/https://github.com/HiveMynd148/3DApp1/raw/refs/heads/master/3DApp1/wwwroot/Models/model.glb'; // Use CORS proxy for testing

    try {
        // First, try to fetch the file directly to check if it's accessible
        const response = await fetch(modelUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // If fetch succeeds, load the model
        loader.load(
            modelUrl,
            (gltf) => {
                const model = gltf.scene;
                scene.add(model);

                // Center the model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);

                console.log('Model loaded successfully');
            },
            (xhr) => {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log(`${Math.round(percentComplete)}% loaded`);
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );
    } catch (error) {
        console.error('Error fetching model:', error);
    }

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
});
