// Okay what's left?
//
//  Start up menu
//      Let's be lazy and use a 
//

    var bugArray = [];
    var foodProperties = [ {xPos : Math.random()*360 + 10, yPos : Math.random()*430 + 120, active : 1},
                           {xPos : Math.random()*360 + 10, yPos : Math.random()*430 + 120, active : 1},
                           {xPos : Math.random()*360 + 10, yPos : Math.random()*430 + 120, active : 1},
                           {xPos : Math.random()*360 + 10, yPos : Math.random()*430 + 120, active : 1},
                           {xPos : Math.random()*360 + 10, yPos : Math.random()*430 + 120, active : 1} ];
    var bInterval = 20;
    var bugTimer = setInterval(runGame, bInterval);
    var score = 0;
    var level = 1;
    var gamePaused = 0;
    var numFood = 5;
    var gameStart = 1;
    var foodEaten=0;
    
    var bug = function(x, y, col){ 
        
        // Concluded by examining drawBug

        var moveSpeed = 0;
        var points = 0;
        if (col == "orange") {
            if (level == 1) {
                moveSpeed = 60 / (1000 / bInterval); // 60px/sec  ||  80
            } else {
                moveSpeed = 80 / (1000 / bInterval);
            }
            points = 1;
        }
        else if (col == "red") {
            if (level == 1) {
                moveSpeed = 75 / (1000 / bInterval); // 75px/sec  ||  100
            } else {
                moveSpeed = 100 / (1000 / bInterval);
            }
            points = 3;
        }
        else if (col == "black") {
            if (level == 1) {
                moveSpeed = 150 / (1000 / bInterval); // 150px/sec  ||  200
            } else {
                moveSpeed = 200 / (1000 / bInterval);
            }
            
            points = 5;
        }
        
        bugArray.push({
            xpos: x,
            ypos: y,
            colour: col, //Luckily Candian spelling can be used lol
            velocityX: 0,
            velocityY: 1,
            width: 10,
            height: 40,
            speed: moveSpeed,
            alive: 1,
            points: points
        });
    };
    
    function addBugs() {
         
        var ran = Math.random();
        var xcomp = Math.random()*380 + 10;
        if (ran < 0.4) {
            // Create Orange Bug
            var newBug = bug(xcomp, 10, "orange");
        }
        else if (ran < 0.7) {
            // Create Black Bug
            var newBug = bug(xcomp, 10, "black");
        }
        else{
            // Create Red Bug
            var newBug = bug(xcomp, 10, "red");
        }
    }
    
    function runGame() {
        manageBugs();
        drawFood();
        checkGameEnd();
    }
    
    function drawFood() {
        var canvas = document.getElementById("game");
        var context = canvas.getContext("2d");
        
        var food0 = new Image();
        food0.src = "Images/blueberries.png";
        var food1 = new Image();
        food1.src = "Images/cookie.png";
        var food2 = new Image();
        food2.src = "Images/hamburger.png";
        var food3 = new Image();
        food3.src = "Images/lettuce.png";
        var food4 = new Image();
        food4.src = "Images/pizza_slice.png";
        
        var foodPics = [];
        foodPics.push(food0);
        foodPics.push(food1);
        foodPics.push(food2);
        foodPics.push(food3);
        foodPics.push(food4);
        
        var f = 0;
        for (f=0; f<numFood; f++) {
            if (foodProperties[f].active == 1) {
                context.drawImage(foodPics[f], foodProperties[f].xPos, foodProperties[f].yPos, 50, 50);
            }
        }
    }
    
    function redirectBugs(){
        // Determine which food is closest
        
        var bg = 0;
        var fd = 0;
        var closestFood=0; // placeholder
        var closestDist=1000; // placeholder
        
        for (bg=0; bg<bugArray.length;bg++) {

            if (bugArray[bg].alive == 1) {

                for (fd=0; fd < numFood; fd++){
                    if (foodProperties[fd].active == 1) {
                        var deltaX = bugArray[bg].xpos - foodProperties[fd].xPos;
                        var deltaY = bugArray[bg].ypos - foodProperties[fd].yPos;
                        var computed = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
                        if (computed < closestDist) {
                            closestFood=fd;
                            closestDist = computed;
                        }
                    }
                }
                // direct velocity to that position
                var angle = Math.atan((foodProperties[closestFood].yPos - bugArray[bg].ypos) /
                                      (foodProperties[closestFood].xPos - bugArray[bg].xpos));
                
                bugArray[bg].velocityX = Math.cos(angle + Math.PI);
                bugArray[bg].velocityY = Math.sin(angle + Math.PI);
                
                if ((bugArray[bg].velocityX < 0 && foodProperties[closestFood].xPos > bugArray[bg].xpos)
                    || (bugArray[bg].velocityX > 0 && foodProperties[closestFood].xPos < bugArray[bg].xpos)) {
                    bugArray[bg].velocityX = -(bugArray[bg].velocityX);
                }
                if ((bugArray[bg].velocityY < 0 && foodProperties[closestFood].yPos > bugArray[bg].ypos)
                    || (bugArray[bg].velocityY > 0 && foodProperties[closestFood].yPos < bugArray[bg].ypos)) {
                    bugArray[bg].velocityY = -(bugArray[bg].velocityY);
                }
            }
        }
       
    }
    
    function manageBugs() {
        // Other (ideals)
        //
        // Rotate bugs: this will be annoying since bugs aren't
        //      drawn relative to the origin.
        //      Problems would include strange/unrealistic rotations
        
        var canvas = document.getElementById("game");
        
        var context = canvas.getContext("2d");
        // wipe clean
        context.clearRect(0, 0, 400, 600);
        // Display Score
        var scoreTag = document.getElementById("score");
        scoreTag.innerHTML = "Score: " + score;
        
        redirectBugs();
        
        var i = 0;
        for (i=0; i < bugArray.length; i++) {
            
            if (bugArray[i].alive == 1) {
                bugArray[i].xpos += bugArray[i].velocityX * bugArray[i].speed;
                bugArray[i].ypos += bugArray[i].velocityY * bugArray[i].speed;
                drawBug(bugArray[i].xpos, bugArray[i].ypos, bugArray[i].colour);
                var q=0;
                for (q=0; q<numFood;q++) {
                    if (foodProperties[q].active == 1) {
                        if (bugArray[i].xpos + bugArray[i].width >= foodProperties[q].xPos && bugArray[i].xpos <= foodProperties[q].xPos + 50) {
                            if (bugArray[i].ypos + bugArray[i].height >= foodProperties[q].yPos && bugArray[i].ypos <= foodProperties[q].yPos + 50) {
                                foodProperties[q].active = 0;
                                foodEaten += 1;
                            }
                        }
                    }
                }
            }
        }
    }
    
    function pauseGame() {
        if (count > 0) {
            var pauseButtonIcon = document.getElementById("pause-button-icon");
            if (pauseButtonIcon.className == "pause icon") {
                pauseButtonIcon.className = "play icon";
                clearTimeout(gameTimer);
                clearTimeout(bugTimer);
                gamePaused = 1;
            } else {
                gameTimer = setInterval(updateGame, 1000);
                bugTimer = setInterval(runGame, bInterval);
                pauseButtonIcon.className = "pause icon";
                gamePaused = 0;
            }
        }
    }

    function squashBug(event) {
        if (gamePaused == 0) {
            var eX = event.offsetX;
            var eY = event.offsetY;
            
            var canvas = document.getElementById("game");
            var context = canvas.getContext("2d");
            
            var index = 0;
            for (index=0; index < bugArray.length; index++) {
                
                if (eX >= bugArray[index].xpos && eX <= (bugArray[index].xpos + bugArray[index].width)) {
                    if (eY >= bugArray[index].ypos && eY <= (bugArray[index].ypos + bugArray[index].height)) {
                        
                        if (bugArray[index].alive == 1) {
                            bugArray[index].alive = 0;
                            // increase points
                            score += bugArray[index].points;
                        }
                    }
                }
            }
        }
    }

    function newGame(lvl) {
        bugArray = [];
        foodProperties = [ {xPos : Math.random()*380 + 10, yPos : Math.random()*480 + 120, active : 1},
                           {xPos : Math.random()*380 + 10, yPos : Math.random()*480 + 120, active : 1},
                           {xPos : Math.random()*380 + 10, yPos : Math.random()*480 + 120, active : 1},
                           {xPos : Math.random()*380 + 10, yPos : Math.random()*480 + 120, active : 1},
                           {xPos : Math.random()*380 + 10, yPos : Math.random()*480 + 120, active : 1} ];
        level = lvl;
        bugTimer = setInterval(runGame, bInterval);
        gameTimer = setInterval(updateGame, 1000);
        foodEaten = 0;
        count = 60;
        score = 0;
    }
    
    function checkGameEnd() {
        if (foodEaten == numFood) {
            endGame();
        }
    }
//
//  **From exemplar code Bug.js
//
    function drawBug(x, y, col){
        color = col;
        alpha = ".5";
        
        var canvas = document.getElementById("game");
        var context = canvas.getContext("2d");
        
        //http://www.w3schools.com/tags/canvas_globalalpha.asp
        context.globalAlpha = alpha;
        
        /*-- Whiskers, legs and arms--*/
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(x+5, y+15);
        context.lineTo(x+10, y);
        context.moveTo(x+5, y+20);
        context.lineTo(x+4, y+22);
        context.lineTo(x+6, y+22);
        context.lineTo(x+5, y+20);
        context.moveTo(x, y+20);
        context.lineTo(x+10, y+40);
        context.moveTo(x+10, y+20);
        context.lineTo(x, y+40);
        context.lineWidth = 2;
        context.strokeStyle = color;

        /*-- Triangles on the tips --*/
        context.moveTo(x,y);
        context.lineTo(x, y+3);
        context.lineTo(x+1.73, y+2.4);
        context.lineTo(x, y);
        context.moveTo(x+10, y);
        context.lineTo(x+8.27, y+2.4);
        context.lineTo(x+10, y+3);
        context.lineTo(x+10, y);
        context.moveTo(x, y+20);
        context.lineTo(x, y+22);
        context.lineTo(x+1.6, y+21.25);
        context.lineTo(x, y+22);
        context.moveTo(x+10, y+20);
        context.lineTo(x+8.4, y+21.25);
        context.lineTo(x+10, y+22);
        context.lineTo(x+10, y+20);
        context.moveTo(x, y+40);
        context.lineTo(x, y+38);
        context.lineTo(x+1.6, y+38.25);
        context.lineTo(x, y+38);
        context.moveTo(x+10, y+40);
        context.lineTo(x+8.4, y+38.25);
        context.lineTo(x+10, y+38);
        context.lineTo(x+10, y+40);
        context.stroke();

        /*-- Body parts --*/
        context.beginPath();
        context.arc(x+5, y+15, 5, 0, 2*Math.PI);
        context.moveTo(x+5, y+21);
        context.bezierCurveTo(x, y+20, x, y+30, x+5, y+38.75);
        context.moveTo(x+5, y+21);	
        context.bezierCurveTo(x+10, y+20, x+10, y+30, x+5, y+38.75);
        context.fillStyle = color;
        context.lineWidth = 1;
        context.strokeStyle = "#000000"
        context.stroke();
        context.fill();

        /*-- Eyes and Mouth --*/
        context.beginPath();
        context.arc(x+3.3, y+13.2, 1, 0, 2*Math.PI);
        context.arc(x+6.75, y+13.2, 1, 0, 2*Math.PI);
        context.fillStyle = "white";
        context.fill();
        context.beginPath();
        context.arc(x+5, y+15, 2.5, 0, Math.PI, false);
        context.stroke();
    }