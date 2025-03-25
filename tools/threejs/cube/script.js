import * as THREE from "../js/three/three.module.js";
import { OrbitControls } from "../js/controls/OrbitControls.js";


// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 4;
camera.position.x = 3;
camera.position.y = 3;
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true,
});


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({
        color: 0xffffff,
        wireframe: true,
    })
)
cube.position.set(0, 0, 0);

const edges = new THREE.EdgesGeometry(cube.geometry);
const wireframe = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ 
        color: 0xffffff,  
        linewidth: 4      // 线宽设置
    })
);

scene.add(wireframe);


function animate() {
    requestAnimationFrame(animate);
    

    controls.update();
    renderer.render(scene, camera);
}

animate();

// 窗口大小调整时更新相机和渲染器
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});