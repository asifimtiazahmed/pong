var canvas;
var canvasContext;
var ballX=50;
var ballSpeedX=10;
var ballY=50;
var ballSpeedY=4;
var paddle1Y = 250;
var paddle2Y = 250;
var player1Score=0;
var player2Score =0;
var showingWinScreen = false;
var hit = document.getElementById('clickAudio');
const WINNING_SCORE = 3;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

window.addEventListener("load",getGame);


function getGame() {
canvas=document.querySelector("#canvas");
canvasContext=canvas.getContext('2d');

var framesPerSecond = 30;
setInterval(function(){
    moveEverything();
    drawEverything();
},1000/framesPerSecond);
// get the mouse coordinates and send to paddle draw
canvas.addEventListener("mousemove", function(evt){
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y-PADDLE_HEIGHT/2; //mouse coords giving to draw the paddle 1 i.e simulate movement

});

canvas.addEventListener("mousedown",handleMouseClick);
}

function handleMouseClick(){
    if (showingWinScreen){
        showingWinScreen=false;
        player1Score=0;
        player2Score=0; 
    }
}
function computerMovement(){
    var paddle2YCenter = paddle2Y +(PADDLE_HEIGHT/2);
    if (paddle2YCenter < ballY-35){
        paddle2Y+=6;
        if (paddle2YCenter<0){
            paddle2Y=0;
        }
    } else if (paddle2YCenter > ballY+35)
    {
        paddle2Y-=6;
        //if (paddle2Y+PADDLE_HEIGHT > canvas.height){
        //    (paddle2Y+PADDLE_HEIGHT) = (paddle2Y+PADDLE_HEIGHT); 
        //}
    }
}
function moveEverything() {
    if (showingWinScreen){
        return;
    }
    computerMovement();
    ballX +=ballSpeedX; //ball moving forward using setinterval
    ballY +=ballSpeedY; //ball moving up or down
    
    if (ballY>canvas.height-10){ //ball direction change
        ballSpeedY=-ballSpeedY;
    } else if (ballY<10 && ballSpeedY<0){
        (ballSpeedY=-ballSpeedY);
    }

    if (ballX<30){              //code for the right side paddle
            if(ballY>paddle1Y && ballY<paddle1Y+PADDLE_HEIGHT){
        ballSpeedX=-ballSpeedX;
        hit.play();
        var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2); //Ball control for P1
        ballSpeedY=deltaY*0.35;

            } else if (ballX<0) {
                player2Score++; //must be before ball reset
                ballReset();
        
            }
    } else if (ballX>canvas.width-30){ //code for the left side paddle
        if (ballY>paddle2Y && ballY<paddle2Y+PADDLE_HEIGHT){
            ballSpeedX=-ballSpeedX;
            hit.play();
            var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2); //Ball control for P1
        ballSpeedY=deltaY*0.35;
        } else if (ballX >canvas.width-25){
            player1Score++;//must be before ball reset
            ballReset();
            
        }
        
    }

}

function drawNet() {
    for(var i=0;i<canvas.height;i++){
        colorRect((canvas.width/2)-1,i,2, 20, 'yellow');
        i+=40;
    }
}
function drawEverything() {
    
    colorRect(0,0,canvas.width,canvas.height,'black'); //background color
    if (showingWinScreen){//pause the screen after winning
        canvasContext.fillStyle='white';
        canvasContext.fillText("Click to continue",350,canvas.height-110);
        canvasContext.fillText("Player One Score "+player1Score, 350,150);
        canvasContext.fillText("Player Two Score "+player2Score,350, 180);
        if (player1Score>player2Score){
            canvasContext.fillText("Player 1 Wins!",350, 400); 
        } else {canvasContext.fillText("Player 2 Wins!",350, 400);
         }
        return;
    }
    drawNet();
    colorRect(10,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'red'); //paddle left
    colorRect(canvas.width-20,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'red'); //paddle right
    //colorRect(ballX, 100,10,10, 'blue'); //ball square
    colorCircle(ballX,ballY,10,'white');
        
    canvasContext.fillStyle='white';
    canvasContext.fillText("Player 1: "+player1Score,100,100);
    canvasContext.fillText("Player 2: "+player2Score,canvas.width-150,100);

}

function ballReset() {
    if (player1Score>=WINNING_SCORE || player2Score>=WINNING_SCORE){
        showingWinScreen = true;
        //player1Score=0;
        //player2Score=0;
    }
    ballSpeedX=-ballSpeedX; //reverse the X direction of ball once it is reset
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function colorCircle(centerX, centerY, radiusX, color){
//ball circle
canvasContext.fillStyle=color;
canvasContext.beginPath();
canvasContext.arc(centerX,centerY,radiusX,0,Math.PI*2,true);
canvasContext.fill();

}

function colorRect(screenPosLeftX, screenPosTopY, rectWidth, rectHeight, drawColor){
    canvasContext.fillStyle=drawColor;
    canvasContext.fillRect(screenPosLeftX, screenPosTopY, rectWidth, rectHeight);
}

function calculateMousePos(evt) {
    var rect =canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}
