const board = document.getElementById("game-board");
const instructiontext = document.getElementById("instruction-text");
const logo = document.getElementById("logo");

const highScore = document.getElementById("highScore");
const score = document.getElementById("score");
const gameBorder1 = document.getElementsByClassName("game-border-1")[0];
const gameBorder2 = document.getElementsByClassName("game-border-2")[0];
const gameBorder3 = document.getElementsByClassName("game-border-3")[0];
const body = document.getElementsByTagName("body")[0];
const divSnake = document.getElementsByClassName("snake");

const snake_eyes = document.createElement("img");
const apple = createElement("img");
const cherry = createElement("img");

snake_eyes.setAttribute("src", "images/snake_eyes.png");
snake_eyes.setAttribute("width", "19px");
snake_eyes.setAttribute("alt", "snake");
apple.setAttribute("src", "images/apple.png");
apple.setAttribute("width", "20px");
apple.setAttribute("alt", "apple");
cherry.setAttribute("src", "images/gold.png");
cherry.setAttribute("width", "20px");
cherry.setAttribute("alt", "superFood");


let gridSize = 20;
let snake = [{ x: 10, y: 10 }]; 
let food = generateFood();
let highscore = 0;
let wall = generateWall();
let wall1 = generateWall();
let wall2 = generateWall();
let superFood = generateSuperFood();



let direction = "right"; 
let isGameStart = false;
let isLevelUp = false;
let gameSpeed = 300;
let gameIntervalId;

function draw() {
    board.innerHTML = "";
    drawSnake();
    drawFood();
    snakeScore();
    levelUp();
}

function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createElement("div", "snake");
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
    divSnake[0].appendChild(snake_eyes)
}

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;

}
// draw();

function drawFood() {
    let foodElement = createElement("div", "food");
    setPosition(foodElement, food);
    foodElement.appendChild(apple);
    board.appendChild(foodElement);
}
function drawSuperFood(){
    let superFoodElement = createElement("div", "superFood");
    setPosition(superFoodElement, superFood);
    superFoodElement.appendChild(cherry);
    board.appendChild(superFoodElement);
}   
function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y }
}
function generateSuperFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;

    return {x,y}
}
function drawWall() {
    let wallElement = createElement("div", "wall");
    let wallElement1 = createElement("div", "wall");
    let wallElement2 = createElement("div", "wall");
    setPosition(wallElement, wall);
    setPosition(wallElement1, wall1);
    setPosition(wallElement2, wall2);
    board.appendChild(wallElement);
    board.appendChild(wallElement1);
    board.appendChild(wallElement2);
}
function generateWall() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return { x, y }
}

function move() {
    let head = { ...snake[0] };
    let head1 = {...snake[1]};

    switch (direction) {
        case "up":
            head.y--
            break;
        case "down":
            head.y++
            break;
        case "right":
            head.x++
            break;
        case "left":
            head.x--
            break;
    }
    snake.unshift(head); 
    if (head.x === food.x && head.y === food.y) {
        snakeSpeed();
        levelUp();
        food = generateFood();
        console.log(snake);
        clearInterval(gameIntervalId)
        gameIntervalId = setInterval(() => {
            move();
            checkColllision();
            draw();
        }, gameSpeed);
    }else if(isLevelUp){
        if(head.x === superFood.x && head.y === superFood.y){
            snake.push(head1);
            console.log(snake);
            console.log("1");
            gameSpeed += 25;
            console.log("2");
            superFood = generateSuperFood();
            console.log("3");
            clearInterval(gameIntervalId);
            gameIntervalId = setInterval(() => {
            console.log("3");
                move();
                checkColllision();
                draw();
            }, gameSpeed);
        }else{
            snake.pop();
        }
    }
    else {
        snake.pop();
    }

}

function startGame() {
    isGameStart = true;
    instructiontext.style.display = "none";
    logo.style.display = "none";
    highScore.style.display = "none";
    gameBorder3.style.backgroundColor = "#c4cfa3";
    gameBorder3.style.borderColor = "#8b966c";
    gameBorder2.style.borderColor = "#abb78a";
    gameBorder1.style.borderColor = "#595f43";
    body.style.backgroundColor = "#625f5f";
    score.style.color = "#abb78a"
    highScore.style.color = "#c4cfa3";
    board.style.gridTemplateColumns = "repeat(20,20px)";
    board.style.gridTemplateRows = "repeat(20,20px)";
    gameIntervalId = setInterval(() => {
        move();
        checkColllision();
        draw();
    }, gameSpeed);
}
function handleKeyPress(e) {
    if ((!isGameStart && e.code == "Space") || (!isGameStart && e.key == " ")) {
        startGame();
    } else {
        switch (e.key) {
            case "ArrowUp":
                direction = "up"
                break;
            case "ArrowDown":
                direction = "down"
                break;
            case "ArrowRight":
                direction = "right"
                break;
            case "ArrowLeft":
                direction = "left"
                break;
        }
    }
}
function checkColllision() {
    let head = { ...snake[0] };

    if (head.x < 1 || head.x > gridSize ||
        head.y < 1 || head.y > gridSize) {
        resetGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x == snake[i].x && head.y == snake[i].y) {
            resetGame();
        }
    }
    if (isLevelUp) {
        if (head.x == wall.x && head.y == wall.y) {
            resetGame();
        } else if (head.x == wall1.x && head.y == wall1.y) {
            resetGame();
        } else if (head.x == wall2.x && head.y == wall2.y) {
            resetGame();
        }
    }
}
function resetGame() {
    gameOver();
    snakeHighScore();
    snake = [{ x: 10, y: 10 }];
    gridSize = 20;
    food = generateFood();
    direction = "right";
    gameSpeed = 300;
    snakeScore();
}
function gameOver() {
    clearInterval(gameIntervalId);
    isGameStart = false;
    isLevelUp = false;  
    instructiontext.style.display = "block";
    logo.style.display = "block";
}
function snakeScore() {
    let currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, "0")
}
function snakeHighScore() {
    let currentScore = snake.length - 1;
    if (currentScore > highscore) {
        highscore = currentScore;
    }
    highScore.textContent = highscore.toString().padStart(3, "0");
    highScore.style.display = "block";
    highscore = 0;
}
function snakeSpeed() {
    let currentScore = snake.length - 1;
    if (currentScore % 5 == 0) {
        if (gameSpeed > 100) {
            gameSpeed -= 50;
            clearInterval(gameIntervalId)
            gameIntervalId = setInterval(() => {
                move();
                checkColllision();
                draw();
            }, gameSpeed);
        }
    }
}
function levelUp() {
    let currentScore = snake.length - 1;
    if (currentScore >= 10) {
        isLevelUp = true;
        const divFood = document.getElementsByClassName("food")[0];
        const divSnake = document.getElementsByClassName("snake");
        gridSize = 30;
        drawWall();
        drawSuperFood();
        board.style.gridTemplateColumns = "repeat(30,20px)";
        board.style.gridTemplateRows = "repeat(30,20px)";
        gameBorder3.style.backgroundColor = "#99CCFF";
        gameBorder3.style.borderColor = "#004C99";
        gameBorder2.style.borderColor = "#76bfff";
        gameBorder1.style.borderColor = "#21415d";
        body.style.backgroundColor = "#6da6d7";
        score.style.color = "#ffffff"
        highScore.style.color = "#0011ff";
        divFood.style.borderColor = "#00ff4c";
        for (let i = 0; i < divSnake.length; i++) {
            divSnake[i].style.backgroundColor = "#106d12"
            divSnake[i].style.borderColor = "#000000"
        }
        clearInterval(gameIntervalId)
        gameIntervalId = setInterval(() => {
            move();
            checkColllision();
            draw();
        }, gameSpeed);
    }
}

function autoplay(){
    document.getElementById("player").play();
}
function toggleMute() {
    var myAudio = document.getElementById('player');
    myAudio.muted = !myAudio.muted;   
}
function pictureChange(){
    var x = document.getElementById('mute_img');

    if (x.src.indexOf("unmute.png")>0){
        x.src="images/mute.png";
    }else{
        x.src="images/unmute.png";
    }
}


document.addEventListener("keydown", handleKeyPress)

