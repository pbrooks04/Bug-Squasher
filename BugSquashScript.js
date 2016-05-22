    var gameTimer = setInterval(updateGame, 1000);
    var count = 60;
    var nextBug = Math.random()*2 + 1;
    var highScore = 0;    

    function initBugCanvas() {
        var canvas = document.getElementById("game");
        var context = canvas.getContext("2d");
        
        canvas.addEventListener("mousedown", squashBug, false);
    }
    
    function updateGame() {
        if (count == 60) {
            addBugs();
        }
        count -= 1;
        var timeDisplay = document.getElementById("timer");
        timeDisplay.innerHTML = "Time: " + count;
        // Add a bug every 1 - 3 seconds (currently dependant on this time interval being set to 1 sec)
        if (nextBug <= 0) {
            nextBug = Math.random()*2 + 1; 
            addBugs();
        }
        else {
            nextBug -= 1;
        }
        if (count <= 0) {
            endGame();
        }
    }
    
    function endGame() {
        clearTimeout(gameTimer);
        clearTimeout(bugTimer);
        if (score > highScore) {
            highScore = score;
            alert("Game Over \n Congratulations! You set a new high score! \n Score: " + score);
        }
        else {
            alert("Game Over \n Score: " + score);
        }
        document.getElementById("high-score").innerHTML = "Current High Score: " + highScore;
        
        if (confirm("Start again?")) {
            newGame(1);
        }
        else {
            alert("Too Bad!");
            newGame(2);
        }
    }
    
    function showStartMenu() {
        //document.getElementById("start").modal('show');
        $('.ui modal').modal('show');
        alert("Showed it");
    }
    
    function setLevel1() {
        level = 1;
    }
    
    function setLevel2() {
        level = 2;
    }