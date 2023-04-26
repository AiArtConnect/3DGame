// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

// Create the player, enemy, and defender avatars
const player = createAvatar(0x00ff00, 0, 0);
const enemy = createAvatar(0xff0000, -5, 0);
const defender = createAvatar(0x0000ff, 5, 0);

// Create obstacles
const obstacles = [];
const keyState = {};

// Event listeners for keyboard input
window.addEventListener('keydown', (event) => {
  keyState[event.code] = true;
});

window.addEventListener('keyup', (event) => {
  keyState[event.code] = false;
});


// Event listener for window resizing
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Set up the game loop
function animate() {
  requestAnimationFrame(animate);

  // Update player, enemy, defender, and obstacles
  updatePlayer();
  updateEnemy();
  updateDefender();
  updateObstacles();

  // Render the scene
  renderer.render(scene, camera);
}

function createAvatar(color, x, y) {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshPhongMaterial({ color: color });
  const avatar = new THREE.Mesh(geometry, material);
  avatar.position.set(x, y, 0);
  scene.add(avatar);
  return avatar;
}

function updatePlayer() {
  const speed = 0.1;
  if (keyState['ArrowUp']) player.position.y += speed;
  if (keyState['ArrowDown']) player.position.y -= speed;
  if (keyState['ArrowLeft']) player.position.x -= speed;
  if (keyState['ArrowRight']) player.position.x += speed;
}


function updateEnemy() {
  // Implement enemy behavior to block the player
}

let defenderState = "awake";
let stateStartTime = performance.now();

function updateDefender() {
  const defenderSpeed = 0.05;
  const currentTime = performance.now();
  const elapsedTime = currentTime - stateStartTime;

  if (defenderState === "awake") {
    if (elapsedTime > 6000) { // Awake for 6 seconds
      defenderState = "asleep";
      stateStartTime = currentTime;
    } else {
      const diffX = enemy.position.x - defender.position.x;
      const diffY = enemy.position.y - defender.position.y;
      if (Math.abs(diffX) > Math.abs(diffY)) {
        defender.position.x += Math.sign(diffX) * defenderSpeed;
      } else {
        defender.position.y += Math.sign(diffY) * defenderSpeed;
      }
    }
  } else if (defenderState === "asleep") {
    if (elapsedTime > 3000) { // Sleep for 3 seconds
      defenderState = "awake";
      stateStartTime = currentTime;
    }
  }
}


function updateObstacles() {
  // Update obstacle positions
  for (let i = 0; i < obstacles.length; i++) {
    const obstacle = obstacles[i];
    obstacle.position.x += (Math.random() - 0.5) * 0.1;
    obstacle.position.y += (Math.random() - 0.5) * 0.1;

    // Remove obstacles that move off-screen
    if (obstacle.position.x < -20 || obstacle.position.x > 20 || obstacle.position.y < -20 || obstacle.position.y > 20) {
      scene.remove(obstacle);
      obstacles.splice(i, 1);
      i--;
    }
  }

  // Periodically spawn new obstacles
  if (Math.random() < 0.01) {
    const color = Math.random() * 0xffffff;
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const obstacle = spawnObstacle(color, x, y);
    obstacles.push(obstacle);
  }
}

function spawnObstacle(color, x, y) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ color: color });
  const obstacle = new THREE.Mesh(geometry, material);
  obstacle.position.set(x, y, 0);
  scene.add(obstacle);
  return obstacle;
}
animate();
