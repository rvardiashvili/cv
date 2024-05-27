//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let object;
let controls;
scene.fog = new THREE.FogExp2( 0x000000, 0.025);
scene.background = new THREE.Color( 0x020202 );

let moveCam = false;

const loader = new GLTFLoader();
loader.load("models/cvmodels.glb",
function(glb){
        object = glb.scene;
        scene.add(object);
        object.traverse(function(node){
            console.log(node);
            if(node.isMesh && (node.name == "MonitorMesh" || node.name=="Stand" || node.name=="Table"))
                node.castShadow = true;
            if(node.isMesh && (node.name == "Table"  || node.name=="Stand" || node.name=="Plane"))
                node.receiveShadow = true;
        });
    },
    function (xhr){
        console.log((xhr.loaded/xhr.total * 100) + "% loaded");
    },
    function(error){
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.getElementById("container3D").appendChild(renderer.domElement);
camera.position.z = 30;
camera.position.y = 15;
camera.position.x = 15;
camera.lookAt(0, 5, 0);

const light = new THREE.PointLight(0x55ddff, 5);
light.position.set(0, 5, 1)
light.castShadow = true;
light.distance = 5;
light.decay = 2.88;

const lightSpot = new THREE.SpotLight(0xffffff,0.3);
lightSpot.position.set(6, 20, -5)
lightSpot.castShadow = true;
lightSpot.angle = 0.2;
lightSpot.penumbra = 1;
const ambientlight = new THREE.AmbientLight(0xffffff, 0.1);


scene.add(light, lightSpot, ambientlight);

window.addEventListener("click", function(){
    moveCam=true;
});
function moveCameraToPos2(){
    if(camera.position.x >= 0)
    camera.position.set(camera.position.x-0.1, camera.position.y-0.065, camera.position.z-0.18);
    camera.lookAt(0, 5, 0);
}

function animate(){
    requestAnimationFrame(animate);
    if(moveCam)
        moveCameraToPos2();
    renderer.render(scene, camera);
}

window.addEventListener("resize", function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectMatrix();
    renderer.setSize(window.innerWidth, window/innerHeight);
});

animate();