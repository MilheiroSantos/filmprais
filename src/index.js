import * as THREE from 'three';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

const container = document.getElementById("logo");
renderer.setSize(container.clientWidth, container.clientWidth);
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const cameraAspect = container.clientWidth / container.clientHeight;
const camera = new THREE.PerspectiveCamera( 45, cameraAspect, 1, 1000 );

const ambientLight = new THREE.AmbientLight(0xffffff, 4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 2);
pointLight.position.set(2, -2, 5);
pointLight.lookAt(0, 0, 0)
scene.add(pointLight);

const geometryP = new THREE.PlaneGeometry(10, 10);
const materialP = new THREE.MeshPhongMaterial({color:0xffffff})

const plane = new THREE.Mesh(geometryP, materialP);
plane.position.setZ(-2);

camera.position.setZ(10)
scene.add(plane);

const mouse = new THREE.Vector2()
document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = ((event.clientX / window.innerWidth) * 2 - 1)/2.0;
    mouse.y = (-(event.clientY / window.innerHeight) * 2 + 1)/2.0;
}
window.addEventListener( 'resize', onWindowResize );

const loader = new ColladaLoader();
loader.load('./assets/LogoFilm.dae', function(gltf) {
    gltf.scene.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = new THREE.MeshPhysicalMaterial({
                clearcoat: 1.0,
                reflectivity: 1.0,
				clearcoatRoughness: 0.1,
				metalness: 0.35,
				roughness: 0.2,
				color: 0xffffff,
            })
        }
    });
    const model = gltf.scene
    scene.add(gltf.scene);
    renderer.render(scene, camera);

    function animate() {
        requestAnimationFrame(animate);
        model.rotation.y = mouse.x
        model.rotation.x = mouse.y
        renderer.render(scene, camera);
    }
    animate();

}, undefined, function(error) {
    console.error(error);
});

function onWindowResize() {
    const container = document.getElementById("logo");
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientWidth);
}
