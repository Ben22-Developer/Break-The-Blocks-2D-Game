const audios = document.querySelectorAll('audio');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const screenWidth = 630;
const screenHeight = innerHeight;
const veryDarkColor = 'rgb(0, 37, 69)';
const notTooDarkColor = 'rgb(26, 89, 144)';

canvas.width = screenWidth;
canvas.height = screenHeight;

//the sliding ground
function slidingGround() {
    ctx.fillStyle = veryDarkColor;
    ctx.fillRect(0,(screenHeight - 25),630,25);
}


//ball sliding shooter object,variable and functionality
class Shooter {
    constructor () {
        this.x = (screenWidth/2) - 45;
        this.y = (screenHeight - 40);
        this.width = 120;
        this.height = 15;
        this.speed = 0;
        this.color = notTooDarkColor;
    }
    update () {
        const lastX = this.x;
        const lastY = this.y;
        ctx.clearRect(lastX,lastY,this.width,this.height);
        this.x += this.speed;
        if (this.x + this.width >= screenWidth) {
            this.x = screenWidth - this.width;    
        }
        if (this.x <= 0) {
            this.x = 0;
        }
    }
    draw () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

const shooter = new Shooter();
function shooterPosition () {
    shooter.update();
    shooter.draw();
}

//ball object, variable and functionality
class Ball {
    constructor () {
        this.x = screenWidth/2;
        this.y = screenHeight/2;
        this.dx = 0;
        this.dy = 5;
        this.size = 23;
        this.color = veryDarkColor;
        this.gamePlaying = true;
        this.isGoingUp;
    }
    update () {
        const lastX = this.x - this.size;
        const lastY = this.y - this.size;
        ctx.clearRect(lastX,lastY,(this.size * 2),(this.size * 2));
        this.x += this.dx;
        this.y += this.dy;
        this.isGoingUp = this.dy < 0 ? true : false;
        if (this.y + this.size >= screenHeight - 10) {
            if (this.gamePlaying) {
                gameFail();
            }
        }
        else {
            if (this.x + this.size >= screenWidth) {
                this.x = screenWidth - this.size;
                this.dx *= -1;
                audios[0].play();
            }
            if (this.x - this.size <= 0) {
                this.x = this.size;
                this.dx *= -1;
                audios[0].play();
            }

//&& (shooter.x + shooter.width >= this.x && this.x >= shooter.x)
            //first if is to determine if the ball has touched the ground and the second if is to determine if the ball is in the range of the shooter on x-axis
            if ((this.y + this.size >= screenHeight - 40) && (shooter.x + shooter.width >= this.x && this.x >= shooter.x)) {
                this.y = screenHeight - (40 + this.size);
                this.dy *= -1;
                const randomXPosition = [-1,-2,-3,0,1,2,3];
                //this.dx = randomXPosition[Math.floor(Math.random() * randomXPosition.length)];
                const xAxisDifference = this.x - shooter.x;
                console.log(xAxisDifference);
                if (xAxisDifference <= 43) {
                    this.dx  = randomXPosition[Math.floor(Math.random() * 3)];
                }
                else if (xAxisDifference < 50) {
                    this.dx = randomXPosition[3];
                }
                else {
                    this.dx  = randomXPosition[Math.floor((Math.random() * 3) + 4)];
                }
                audios[0].play();
            }
            if (this.y - this.size <= 0) {
                this.y = this.size;
                this.dy *= -1;
                audios[0].play();
            }
        }
    }
    draw () {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);
        ctx.fill();
    }
}

const ball = new Ball();
function bouncingBall () {
    ball.update();
    ball.draw();
}
bouncingBall();
//blocks
class Blocks {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = 110;
        this.height = 30;
        ctx.fillStyle = notTooDarkColor;
    }
    draw () {
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

const blocks = [];
let allBlocks;
const xCoordinates = [0,130,260,390,520];
let i,j,yCoordinate;

const winningMessages = ['Look at the Super Power in the hood!','Even sad Panda smiled!','The sky is YAAAY!','You got a big up from Ben tho!'];
const failingMessages = ["Life goes on, let's try another one!","You were at the point tho!","You got no reason to give up!"];

function makeBlocks () {
    i = 0;
    allBlocks = 25;
    yCoordinate = 0;
    blockNbr = 5;
    blockMembers = 5;
    if (blocks.length) {
        blocks.splice(0);
    }
    for (j = 0; j < allBlocks; j++) {
        if (i === 5) {
            i = 0;
            yCoordinate += 60;
        }
        blocks[j] = new Blocks (xCoordinates[i],yCoordinate);
        blocks[j].draw();
        i++;
    }
}

makeBlocks();

function detectBlockBallCollision () {
    let hitten;

    for (j = 0; j < allBlocks; j++) {
        if ((((ball.y - ball.size - blocks[j].height - blocks[j].y) <= 0 && (ball.isGoingUp)) || ((!ball.isGoingUp) && ((ball.y + ball.size) - blocks[j].y <= 0 && (ball.y + ball.size) - blocks[j].y > -15))) && (blocks[j].x <= ball.x && (blocks[j].x + blocks[j].width >= ball.x))) {
            ball.dy *= -1;
            hitten = true;
            audios[0].play();
            break;
        }
    }

    if (hitten) {
        ctx.clearRect(blocks[j].x,blocks[j].y,blocks[j].width,blocks[j].height);
        allBlocks -= 1;
        blocks.splice(j,1);
        if (!blocks.length) {
            gameWin();
        }
    }

    for (j = 0; j < blocks.length; j++) {
        blocks[j].draw();
    }
}



//animation
function animating () {
    if (ball.gamePlaying) {
        slidingGround();
        shooterPosition();
        bouncingBall();
        detectBlockBallCollision();
    }
    requestAnimationFrame(animating);
}

function startGame () {
    document.querySelector('dialog').close();
    ctx.clearRect(ball.x - ball.size,ball.y - ball.size,ball.size * 2,ball.size * 2);
    ctx.beginPath();
    ball.x = shooter.x + (shooter.width/2);
    ball.y = screenHeight/2;
    ball.dx = 0;
    ball.gamePlaying = true;
    makeBlocks();
}

//start Game after failure
function gameFail () {
    ball.gamePlaying = false;
    audios[2].play();
    document.querySelector('dialog').showModal();
    document.querySelector('dialog').innerHTML = `<h2>${failingMessages[Math.floor(Math.random() * failingMessages.length)]}</h2><br><br>
                                                  <h3>😔😔😔😔😔😔😔😔😔😔😔😔😔😔😔😔😔</h3><br><br>
                                                  <button id="loose">Play Another Round To Prove It Wrong!</button>`;
    document.querySelector('#loose').addEventListener('click',() => {
        startGame();
    })
}

function gameWin() {
    ball.gamePlaying = false;
    audios[1].play();
    document.querySelector('dialog').showModal();
    document.querySelector('dialog').innerHTML = `<h2>${winningMessages[Math.floor(Math.random() * winningMessages.length)]}</h2><br><br>
                                                  <h3>🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳🥳</h3><br><br>
                                                  <button id="win">Play Another Round To Confirm It!</button>`;
    document.querySelector('#win').addEventListener('click',() => {
        startGame();
    })
}


document.addEventListener('keydown',(e) => {
    if (e.key === 'ArrowRight') {
        shooter.speed = 10;
    }
    else if (e.key === 'ArrowLeft') {
        if(shooter.x === 0) {
            return;
        }
        shooter.speed = -10;
    }
    else {
        return;
    }
    shooterPosition();
})

document.addEventListener('keyup',() => {
    shooter.speed = 0;
})

document.getElementById('startBtn').addEventListener('click',() => {
    animating();
    shooterPosition();    
    document.getElementById('welcoming').style.display = 'none';
    document.querySelector('canvas').style.display = 'block';
})

document.addEventListener('touchstart', () => {
    alert("Break The Walls is currently designed to be enjoyed on a computer, so make sure to grab your keyboard to join the fun!\nWe're still improving the mobile/tablet Version");
})