// Create the JS representation from the DOM
const startText = document.getElementById("startText");
const paddle1 = document.getElementById("paddle1");
const paddle2 = document.getElementById("paddle2");
const ball = document.getElementById("ball");
const player1ScoreElement = document.getElementById("player1Score");
const player2ScoreElement = document.getElementById("player2Score");
const lossSound = document.getElementById("lossSound");
const wallSound = document.getElementById("wallSound");
const paddleSound = document.getElementById("paddleSound");

// Game Variables
let gameRunning = false;
let keysPressed = {};
let paddle1Speed = 0;
let paddle1Y = 150;
let paddle2Speed = 0;
let paddle2Y = 150;
let ballX = 290;
let ballSpeedX = 2;
let ballY = 190;
let ballSpeedY = 2;
let player1Score = 0;
let player2Score = 0;

// Game constants
const paddleAcc = 1;
const paddleMaxSpeed = 5;
const paddleDcc = 1;
const gameHeight = 400;
const gameWidth = 600;

document.addEventListener("keydown", startGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Start game
function startGame() {
    gameRunning = true;
    console.log('start');
    startText.style.display = "none";
    document.removeEventListener("keydown", startGame);
    gameLoop();
}

function gameLoop(){
    if(gameRunning){
        updatePaddle1();
        updatePaddle2();
        moveBall();
        setTimeout(gameLoop, 8);
    }
}

function handleKeyDown(e){
    keysPressed[e.key] = true;
}

function handleKeyUp(e){
    keysPressed[e.key] = false;
}

function updatePaddle1(){
    if(keysPressed['w']){
        console.log('up');
        paddle1Speed = Math.max(paddle1Speed - paddleAcc , -paddleMaxSpeed);
    } else if(keysPressed['s']){
        console.log('down');
        paddle1Speed = Math.min(paddle1Speed + paddleAcc , paddleMaxSpeed);
    } else{
        if(paddle1Speed> 0){
            paddle1Speed = Math.max(paddle1Speed - paddleDcc , 0);
        }else if(paddle1Speed < 0){
            paddle1Speed = Math.min(paddle1Speed + paddleDcc , 0);
        }
    }
    paddle1Y += paddle1Speed;
    if(paddle1Y < 0) {
        paddle1Y = 0;
    }
    if(paddle1Y > gameHeight - paddle1.clientHeight){
        paddle1Y = gameHeight - paddle1.clientHeight;
    }
    paddle1.style.top = paddle1Y + "px";
}

function updatePaddle2(){
    if(keysPressed['ArrowUp']){
        console.log('2up');
        paddle2Speed = Math.max(paddle2Speed - paddleAcc , -paddleMaxSpeed);
    } else if(keysPressed['ArrowDown']){
        console.log('2down');
        paddle2Speed = Math.min(paddle2Speed + paddleAcc , paddleMaxSpeed);
    } else{
        if(paddle2Speed> 0){
            paddle2Speed = Math.max(paddle2Speed - paddleDcc , 0);
        }else if(paddle2Speed < 0){
            paddle2Speed = Math.min(paddle2Speed + paddleDcc , 0);
        }
    }
    paddle2Y += paddle2Speed;
    if(paddle2Y < 0) {
        paddle2Y = 0;
    }
    if(paddle2Y > gameHeight - paddle2.clientHeight){
        paddle2Y = gameHeight - paddle2.clientHeight;
    }
    paddle2.style.top = paddle2Y + "px";
}

function moveBall(){
    // Ball movement logic
    console.log('move');
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    
    if (ballY >= gameHeight - ball.clientHeight || ballY <= 0){
        ballSpeedY = -ballSpeedY
        playSound(wallSound);
    }

    // Paddle 1 Collision

    if(ballX <= paddle1.clientWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddle1.clientHeight){
        ballSpeedX = -ballSpeedX;
        playSound(paddleSound);
    }
    // Paddle 2 Collision
    if(ballX >= gameWidth - paddle2.clientWidth - ball.clientWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddle2.clientHeight){
        ballSpeedX = -ballSpeedX;
        playSound(paddleSound);
    }

    // Out of the game area collision
    if(ballX <= 0){
        player2Score++;
        playSound(lossSound);
        updateScoreboard();
        resetBall();
        pauseGame();
    }else if(ballX >= gameWidth - ball.clientWidth){
        player1Score++;
        playSound(lossSound);
        updateScoreboard();
        resetBall();
        pauseGame();
    }

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
}
function updateScoreboard(){
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
}
function resetBall(){
    ballX = gameWidth / 2 - ball.clientWidth / 2;
    ballY = gameHeight / 2 - ball.clientHeight / 2;
    ballSpeedX = Math.random() < 0.5 ? 2 : -2; // Randomize initial direction
    ballSpeedY = Math.random() < 0.5 ? 2 : -2; // Randomize initial direction
}
function pauseGame(){
    gameRunning = false;
    document.addEventListener("keydown", startGame);
    console.log('pause');
}
function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}