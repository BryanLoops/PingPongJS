// Select canvas
const cvs = document.getElementById("pong");
const ctx = cvs.getContext("2d");

// User paddle
const user = {
    x : 0,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color: "WHITE",
    score: 0
}

// Com paddle
const com = {
    x : cvs.width -10,
    y : cvs.height/2 - 100/2,
    width : 10,
    height : 100,
    color: "WHITE",
    score: 0
}

// Create ball
const ball = {
    x : cvs.width/2,
    y : cvs.height/2,
    radius : 10,
    speed : 5,
    velocityX : 5,
    velocityY : 5,
    color : "WHITE"
}

// Draw rectangle function
function drawRect(x,y,w,h,color){
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
}

// Create net
const net = {
    x : cvs.width/2 - 1,
    y : 0,
    width : 2,
    height : 10,
    color : "WHITE"
}

// Draw net
function drawNet(){
    for(let i = 0; i <= cvs.height; i+=15){
        drawRect(net.x,net.y+i,net.width,net.height,net.color);
    }
}

// Draw circle
function drawCircle(x,y,r,color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,false);
    ctx.closePath();
    ctx.fill();
}

drawCircle(100, 100, 50, "WHITE");

// Draw text
function drawText(text,x,y,color){
    ctx.fillStyle = color;
    ctx.font = "45px fantasy";
    ctx.fillText(text,x,y);
}

function render(){
    // Clear canvas
    drawRect(0, 0, cvs.clientWidth, cvs.clientHeight, "BLACK");

    // Draw net
    drawNet();

    // Draw score
    drawText(user.score,cvs.width/4,cvs.height/5,"WHITE");
    drawText(com.score,3*cvs.width/4,cvs.height/5,"WHITE");

    // Draw user and com paddles
    drawRect(user.x,user.y,user.width,user.height,user.color);
    drawRect(com.x,com.y,com.width,com.height,com.color);

    // Draw ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
}

// Control user's paddle
cvs.addEventListener("mousemove",movePaddle);

function movePaddle(evt){
    let rect = cvs.getBoundingClientRect();

    user.y = evt.clientY - rect.top - user.height/2;
}

// Collision detection
function collision(b,p){
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Reset ball
function resetBall(){
    ball.x = cvs.width/2;
    ball.y = cvs.height/2;

    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
};


// Update : pos, mov, score...
function update(){
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI for com's paddle
    let computerLevel = 0.1;
    com.y += (ball.y - (com.y + com.height/2)) * computerLevel; 

    if(ball.y + ball.radius > cvs.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < cvs.width/2) ? user : com;

    if(collision(ball,player)){
        // Player hit location
        let collidePoint = ball.y - (player.y + player.height/2);

        // Normalization
        collidePoint = collidePoint/(player.height/2);

        // Angle calcullation in Radian
        let angleRad = collidePoint * (Math.PI/4);

        // Variable direction
        let direction = (ball.x < cvs.width/2) ? 1 : -1;

        // Change X and Y velocity
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);

        // Increase speed
        ball.speed += 0.5;
    }

    // Update score
    if(ball.x - ball.radius < 0){
        // Com win
        com.score++;
        resetBall();
    }else if(ball.x + ball.radius > cvs.width){
        // User win
        user.score++;
        resetBall();
    }
}

// Game init
function game(){
    update();
    render();
}

// Loop
const framePerSecond = 50;
setInterval(game,1000/framePerSecond);