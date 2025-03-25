import * as THREE from "../js/three/three.module.js";
import { OrbitControls } from "../js/controls/OrbitControls.js";

// 创建加载管理器
const loadingManager = new THREE.LoadingManager();

// 加载器
const loader = new THREE.TextureLoader(loadingManager);

// 创建场景
const scene = new THREE.Scene();
// 创建相机
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.z = 15;
camera.position.x = 15;
camera.position.y = 15;
camera.lookAt(0, 0, 0);

// 渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;



// 创建加载提示
const loadingElement = document.createElement('div');
loadingElement.style.position = 'absolute';
loadingElement.style.top = '50%';
loadingElement.style.left = '50%';
// loadingElement.style.transform = 'translate(-50%, -50%)';
loadingElement.style.color = 'white';
loadingElement.style.fontSize = '24px';
loadingElement.innerText = 'Loading...';
document.body.appendChild(loadingElement);

// 加载管理器的事件监听
loadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
};

loadingManager.onLoad = function () {
    console.log('Loading complete!');
    // 加载完成后隐藏加载提示
    document.body.removeChild(loadingElement);
};

loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    // 更新加载提示
    loadingElement.innerText = `Loading... ${itemsLoaded}/${itemsTotal}`;
};

loadingManager.onError = function (url) {
    console.log('There was an error loading ' + url);
};

// 贴图
const cubeColorMap = loader.load("../assets/texture/SeasideRocks02_1K_BaseColor.png")
const cubeNormalMap = loader.load("../assets/texture/SeasideRocks02_1K_Normal.png")
const cubeRoughnessMap = loader.load("../assets/texture/SeasideRocks02_1K_Roughness.png")
const cubeAOMap = loader.load("../assets/texture/SeasideRocks02_1K_AO.png")

const planeColorMap = loader.load("../assets/texture/Marble07_1K_BaseColor.png")
const planeNormalMap = loader.load("../assets/texture/Marble07_1K_Normal.png")
const planeRoughnessMap = loader.load("../assets/texture/Marble07_1K_Roughness.png")


const firplaceMap = loader.load("../assets/hdri/space.jpg", () => {
    firplaceMap.mapping = THREE.EquirectangularReflectionMapping;
    firplaceMap.colorSpace = THREE.SRGBColorSpace;
    scene.background = firplaceMap;
    
})



const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: planeColorMap,
        normalMap: planeNormalMap,
        roughnessMap: planeRoughnessMap,
        side: THREE.DoubleSide,
    })
);

plane.rotation.x = -Math.PI / 2;

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial({
        map: cubeColorMap,
        normalMap: cubeNormalMap,
        roughnessMap: cubeRoughnessMap,
        aoMap: cubeAOMap,
    })
)

cube.position.set(0, 1.5, 0);
cube.castShadow = true;
plane.receiveShadow = true;
scene.add(cube, plane);

// 光源
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 20);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
pointLight.position.set(5, 6, -5);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
directionalLight.position.set(-6, 6, 0);
directionalLight.castShadow = true;
directionalLight.target = cube;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5);
scene.add( directionalLight , directionalLightHelper);
scene.add(pointLight, pointLightHelper);

let angle = 0;

function animate() {
    requestAnimationFrame(animate);
    
    angle += 0.001;
    pointLight.position.x = Math.sin(angle) * 5;
    pointLight.position.z = Math.cos(angle) * 5;

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