const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 600;

let currentLevel = 1;
let gameState = "intro"; // intro, playing, gameover
let rocket, obstacles, timer, levelTime, levelTimerInterval;
let laneCount = 5;
let laneWidth = canvas.width / laneCount;
let finishLineY = -5000; // Distance to finish

function startLevel(levelId) {
  currentLevel = levelId;
  rocket = { x: 2, width: laneWidth, height: 40, y: canvas.height - 60, color: "#00e5ff" };
  obstacles = [];
  timer = 0;
  levelTime = levels.find(l => l.id === levelId).timeLimit;
  finishLineY = -5000;
  gameState = "playing";
  document.getElementById("missionOverlay").style.display = "none";
  document.getElementById("endScreen").style.display = "none";
  levelTimerInterval = setInterval(() => timer++, 1000);
  requestAnimationFrame(gameLoop);
}

function drawRocket() {
  ctx.fillStyle = rocket.color;
  ctx.fillRect(rocket.x * laneWidth + 5, rocket.y, laneWidth - 10, rocket.height);
}

function drawObstacles() {
  ctx.fillStyle = "#ff3d00";
  for (let obs of obstacles) {
    ctx.fillRect(obs.x * laneWidth + 10, obs.y, laneWidth - 20, 30);
  }
}

function drawFinishLine() {
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 4;
  ctx.strokeRect(0, finishLineY, canvas.width, 10);
}

function moveObstacles() {
  for (let obs of obstacles) {
    obs.y += 4 + currentLevel; // speed increases per level
  }
  finishLineY += 4 + currentLevel;
}

function generateObstacle() {
  const x = Math.floor(Math.random() * laneCount);
  obstacles.push({ x: x, y: -30 });
}

function checkCollision() {
  for (let obs of obstacles) {
    if (obs.y + 30 >= rocket.y &&
        obs.y <= rocket.y + rocket.height &&
        obs.x === rocket.x) {
      endGame(false);
    }
  }
}

function checkFinish() {
  if (finishLineY >= rocket.y) {
    endGame(true);
  }
}

function gameLoop() {
  if (gameState !== "playing") return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveObstacles();
  drawFinishLine();
  drawRocket();
  drawObstacles();
  checkCollision();
  checkFinish();

  if (Math.random() < 0.03) generateObstacle();

  document.getElementById("hud").innerText =
    `Level ${currentLevel}: ${levels[currentLevel - 1].name} | Time: ${timer}s`;

  requestAnimationFrame(gameLoop);
}

function endGame(win) {
  clearInterval(levelTimerInterval);
  gameState = "gameover";
  document.getElementById("endScreen").style.display = "flex";
  document.getElementById("endMessage").innerText = win
    ? `Mission Success in ${timer}s!`
    : "You were too late.";
  if (win) submitScore(currentLevel, timer);
  loadLeaderboard(currentLevel);
}

document.addEventListener("keydown", (e) => {
  if (gameState !== "playing") return;
  if (e.key === "ArrowLeft" || e.key === "a") {
    rocket.x = Math.max(0, rocket.x - 1);
  }
  if (e.key === "ArrowRight" || e.key === "d") {
    rocket.x = Math.min(laneCount - 1, rocket.x + 1);
  }
});

function showLevelIntro(levelId) {
  const level = levels.find(l => l.id === levelId);
  document.getElementById("missionOverlay").style.display = "flex";
  document.getElementById("missionTitle").innerText = level.name;
  document.getElementById("missionStory").innerText = level.story;
  document.getElementById("startButton").onclick = () => startLevel(levelId);
}

document.getElementById("nextLevelButton").onclick = () => {
  const nextLevel = currentLevel + 1;
  if (nextLevel <= levels.length) {
    showLevelIntro(nextLevel);
  } else {
    alert("You completed all missions!");
  }
};

// Start with level 1
showLevelIntro(1);
