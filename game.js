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

// Scoring system
let score = 0;
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.right = '10px';
scoreElement.style.color = 'white';
document.body.appendChild(scoreElement);
updateScoreDisplay();

function updateScoreDisplay() {
  scoreElement.innerHTML = `Score: ${score}`;
}

// Win/Lose condition
const maxScore = 10;

function checkWinLoseCondition() {
  if (score >= maxScore) {
    alert('Congratulations! You won!');
    resetGame();
  }
  if (player.position.distanceTo(enemy.position) < 2) {
    alert('You lost! The enemy caught you.');
    resetGame();
  }
}

function resetGame() {
  // Reset player, enemy, and defender positions
  player.position.set(0, 0, 0);
  enemy.position.set(-5, 0, 0);
  defender.position.set(5, 0, 0);

  // Clear all obstacles and remove them from the scene
  for (const obstacle of obstacles) {
    scene.remove(obstacle);
  }
  obstacles.length = 0;

  // Reset score and update display
  score = 0;
  updateScoreDisplay();
}

// Game boundary
const gameBoundary = new THREE.Box3(
  new THREE.Vector3(-10, -10, -1),
  new THREE.Vector3(10, 10, 1)
);

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
  const newPosition = player.position.clone();

  if (keyState['ArrowUp']) newPosition.y += speed;
  if (keyState['ArrowDown']) newPosition.y -= speed;
  if (keyState['ArrowLeft']) newPosition.x -= speed;
  if (keyState['ArrowRight']) newPosition.x += speed;

  // Check if new position is within game boundary
  if (gameBoundary.containsPoint(newPosition)) {
    player.position.copy(newPosition);
  }
}

function updateEnemy() {
  // Implement enemy behavior to block the player
  const enemySpeed = 0.02;
  const direction = player.position.clone().sub(enemy.position).normalize();
  enemy.position.add(direction.multiplyScalar(enemySpeed));
}

function animate() {
  requestAnimationFrame(animate);

  updatePlayer();
  updateEnemy();
  checkWinLoseCondition();

  renderer.render(scene, camera);
}

animate();
