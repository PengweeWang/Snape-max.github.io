import * as THREE from "../js/three/three.module.js";
import { PointerLockControls } from "../js/controls/PointerLockControls.js";

// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 纹理加载器
const textureLoader = new THREE.TextureLoader();

// 迷宫地图
const Maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// 加载纹理
const brickTexture = textureLoader.load('../assets/texture/long_white_tiles_diff_1k.jpg');
const floorTexture = textureLoader.load('../assets/texture/asphalt_06_diff_1k.jpg');
const ceilingTexture = textureLoader.load('../assets/texture/marble_01_diff_1k.jpg');

// 创建几何体和材质
const wallGeometry = new THREE.BoxGeometry(10, 10, 10);
const wallMaterial = new THREE.MeshBasicMaterial({ map: brickTexture });

const floorGeometry = new THREE.BoxGeometry(10, 0.1, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ map: floorTexture });

const ceilingGeometry = new THREE.BoxGeometry(10, 0.1, 10);
const ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture });

// 创建迷宫
function createMaze() {
    for (let i = 0; i < Maze.length; i++) {
        for (let j = 0; j < Maze[i].length; j++) {
            if (Maze[i][j] === 1) {
                const wall = new THREE.Mesh(wallGeometry, wallMaterial);
                wall.position.set(j * 10 + 5, 5, i * 10 + 5);
                scene.add(wall);
            } else {
                const floor = new THREE.Mesh(floorGeometry, floorMaterial);
                floor.position.set(j * 10 + 5, 0, i * 10 + 5);
                scene.add(floor);

                const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
                ceiling.position.set(j * 10 + 5, 10, i * 10 + 5);
                scene.add(ceiling);
            }
        }
    }
}

createMaze();

// 添加灯光
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 0);
scene.add(light);

// 设置相机初始位置
camera.position.set(15, 1.5, 15);
camera.rotation.y = -Math.PI / 2;

// 第一人称控制
const controls = new PointerLockControls(camera, renderer.domElement);

// 点击页面以锁定指针
document.addEventListener('click', () => {
    controls.lock();
});

// 键盘控制
const keys = {};
const moveSpeed = 0.05;
let isJumping = false;
const gravity = -0.001;
let velocityY = 0;
const jumpStrength = 0.05;

document.addEventListener('keydown', (event) => {
    keys[event.code] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
});

// 玩家尺寸
const playerSize = new THREE.Vector3(1, 2, 1);

// 碰撞检测
function checkCollision(newPosition) {
    const playerBox = new THREE.Box3(
        new THREE.Vector3(newPosition.x - playerSize.x / 2, newPosition.y - playerSize.y / 2, newPosition.z - playerSize.z / 2),
        new THREE.Vector3(newPosition.x + playerSize.x / 2, newPosition.y + playerSize.y / 2, newPosition.z + playerSize.z / 2)
    );

    for (let i = 0; i < Maze.length; i++) {
        for (let j = 0; j < Maze[i].length; j++) {
            if (Maze[i][j] === 1) {
                const wallBox = new THREE.Box3(
                    new THREE.Vector3(j * 10, 0, i * 10),
                    new THREE.Vector3(j * 10 + 10, 10, i * 10 + 10)
                );

                if (playerBox.intersectsBox(wallBox)) {
                    return true; // 碰撞发生
                }
            }
        }
    }

    return false; // 没有碰撞
}

// 更新玩家控制
function updateControls() {
    const currentPosition = controls.object.position.clone();
    const _vector = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);

    if (keys['KeyW']) { // 前进
        const newPosition = currentPosition.clone();
        _vector.crossVectors(camera.up, _vector);
        newPosition.addScaledVector(_vector, moveSpeed);

        if (!checkCollision(newPosition)) {
            controls.moveForward(moveSpeed);
        }
    }
    if (keys['KeyS']) { // 后退
        const newPosition = currentPosition.clone();
        _vector.crossVectors(camera.up, _vector);
        newPosition.addScaledVector(_vector, -moveSpeed);

        if (!checkCollision(newPosition)) {
            controls.moveForward(-moveSpeed);
        }
    }
    if (keys['KeyA']) { // 左移
        const newPosition = currentPosition.clone();
        newPosition.addScaledVector(_vector, -moveSpeed);

        if (!checkCollision(newPosition)) {
            controls.moveRight(-moveSpeed);
        }
    }
    if (keys['KeyD']) { // 右移
        const newPosition = currentPosition.clone();
        newPosition.addScaledVector(_vector, moveSpeed);

        if (!checkCollision(newPosition)) {
            controls.moveRight(moveSpeed);
        }
    }

    // 跳跃功能
    if (keys['Space'] && !isJumping) {
        velocityY = jumpStrength;
        isJumping = true;
    }

    if (isJumping) {
        velocityY += gravity;
        controls.object.position.y += velocityY;

        if (controls.object.position.y < 1.5) {
            controls.object.position.y = 1.5;
            velocityY = 0;
            isJumping = false;
        }
    }
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    updateControls();
    renderer.render(scene, camera);
}

animate();

// 窗口大小调整时更新相机和渲染器
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});