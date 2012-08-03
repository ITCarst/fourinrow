_FIR = {
    players : {
        purpleNum : 1,
        yellowNum : 2,
        purplePlayer : 'purple',
        yellowPlayer : 'yellow'
    },
    gameSettings : {
        allowClick : true,
        startGame : false,
        animationTime : 1000,
        cols: 7,
        rows: 6,
        totalResources : 8,
        numResourcesLoaded : 0
    },
    tabletSettings : {
        topSpace : 13,
        firstOffset : 2,
        leftSpace : 8,
        chipW : 38,
        chipH : 38
    },
    allImages : [
        "simpleBcg",
        "homeTablet",
        "logo",
        "tabletOverlay",
        "logoSmall",
        "tabletIngame",     
        "yellow",
        "purple"
    ],
    images : {},
    tablet : {}, // will be tablet[rows][columns]
    animation : {} // obj with the animation points
}


/* initiate the animation */
var initAnim,
    whosTurn,
    //define first time the color to purple 
    whosTurnColor = _FIR.players.purplePlayer;    


var content = document.getElementById('game-container');

if(content){

    /* build first canvas elem */
    var firstLayer = document.createElement('canvas');
        firstLayer.setAttribute('id','mainLayer');
        firstLayer.width = 360;
        firstLayer.height = 480;
        
    var contextOne = firstLayer.getContext('2d'),
        cWidth = firstLayer.width,
        cHeight = firstLayer.height;

    /* build second canvas elem */
    var secondLayer = document.createElement('canvas');
        secondLayer.setAttribute('id', 'secondLayer');
        secondLayer.width = 338;
        secondLayer.height = 321;

    var contextTwo = secondLayer.getContext('2d');
        sWidth  =  secondLayer.width,
        sHeight = secondLayer.height;

    /* build third canvas elem */
    var thirdLayer = document.createElement('canvas');
        thirdLayer.setAttribute('id', 'thirdLayer');
        thirdLayer.width = 338;
        thirdLayer.height = 321;

    var contextThree = thirdLayer.getContext('2d'),
        tWidth =  thirdLayer.width,
        tHeight = thirdLayer.height;

   
}

/* preloader[wich image] */
function preloadImages(name){
    var preloadMsg = document.getElementById('preloader');
    //get obj length
    for(var i=0; i < _FIR.allImages.length; i++){
        _FIR.images[_FIR.allImages[i]] = new Image();
        _FIR.images[_FIR.allImages[i]].onload = function(){
            //check if images status
            if(this.complete === true){
                //add +1 to counter
                _FIR.gameSettings.numResourcesLoaded += 1;
                preloadMsg.innerHTML = 'Loading... (' + ( 100 / _FIR.gameSettings.totalResources ) * _FIR.gameSettings.numResourcesLoaded + '%)';
                if(_FIR.gameSettings.totalResources === _FIR.gameSettings.numResourcesLoaded){
                    //if counter its = with all images then hide loading msg
                    preloadMsg.style.display = 'none';
                    donePreloading();
                }
            }
        }
        //add source to img
        _FIR.images[_FIR.allImages[i]].src = 'images/' + _FIR.allImages[i] + '.png';
    }
}
//main object to build the visuals parts
var visuals = function() {
    _visuals = this;
    this._options = {
        bcgX : null,
        bcgY : null,
        logoX : 0,
        logoY : 0
    }
    //get all the buttons in page
    this.loadButtons = function(){
        _visuals.createButtons();
    }
    //load main images and place them on homepage
    this.loadGameImages = function(){
        _visuals.mainBcg();
        _visuals.homeTablet();
        _visuals.indexLogo();
    }
    //general obj for the main logo
    this.indexLogo = function(){
        _visuals._options.logoX = 0;
        _visuals._options.logY = 24;
        contextOne.drawImage(_FIR.images["logo"], _visuals._options.logoX, _visuals._options.logY);
    }
    //in page logo small
    this.logoSmall = function(){
        _visuals._options.logoX = 85;
        _visuals._options.logY = 10;
        contextOne.drawImage(_FIR.images["logoSmall"], _visuals._options.logoX, _visuals._options.logY);
    }
    //main brown background
    this.mainBcg = function(){
        _visuals._options.bcgX = 0;
        _visuals._options.bcgY = 0;
        contextOne.drawImage(_FIR.images["simpleBcg"], _visuals._options.bcgX, _visuals._options.bcgY);
    }
    //home tablet with chips in it
    this.homeTablet = function(){
        _visuals._options.bcgX = 13;
        _visuals._options.bcgY = 135;
        contextOne.drawImage(_FIR.images["homeTablet"], _visuals._options.bcgX, _visuals._options.bcgY);
    }
    //blue board used on about/ingame pages
    this.blueBoard = function(x,y){
        _visuals._options.bcgX = x;
        _visuals._options.bcgY = y;
        contextOne.drawImage(_FIR.images["tabletIngame"],_visuals._options.bcgX, _visuals._options.bcgY);
    }
    //create the 3 buttons used on the homepage
    this.createButtons = function(){
        _visuals.btnPlay();
        _visuals.btnAbout();
        _visuals.btnOther();
    }
    //action of the play btn
    this.btnPlay = function(){
        var playBtn = document.createElement('div');
            playBtn.setAttribute('id','play');
            playBtn.setAttribute('class', 'button');
            playBtn.innerHTML = 'New Game';
            content.appendChild(playBtn);
        //on click initiat the new game
        playBtn.onclick = function(event){
            /* start draw the animation on new game */
            initAnim = setInterval(draw, (_FIR.gameSettings.animationTime / 30));
            //purple player first player
            whosTurn = _FIR.players.yellowNum;
            //set start game that used later on
            _FIR.gameSettings.startGame = true;
            //each time clear the content
            clearContent();
            /*
              call other visual obj
                - top back btn
                - rest game btn
                - small logo
                - second layer and thid layer canvas
                - bottom players turn
            */  
            _visuals.backBtn(15,17);
            _visuals.resetGameBtn(292, 17);
            _visuals.logoSmall();
            _visuals.blueBoard(6,74);
            _visuals.drawSecondLayer();
            _visuals.drawThirdLayer();
            _visuals.buildPlayerTurn();
        }
    }
    //about btn and action 
    this.btnAbout = function(){
        var aboutBtn = document.createElement('div');
        aboutBtn.setAttribute('id','about');
        aboutBtn.setAttribute('class', 'button');
        aboutBtn.innerHTML = 'About';        
        content.appendChild(aboutBtn);
        //on click initiat the about page with text
        aboutBtn.onclick = function(){
            aboutPage();
        }
    }
    //no functionality at this moment
    this.btnOther = function(){
        var otherBtn = document.createElement('div');
        otherBtn.setAttribute('id','other');
        otherBtn.setAttribute('class', 'button');
        otherBtn.innerHTML = 'Other Games';
        content.appendChild(otherBtn);
    }
    //back btn wich calls the back event function
    this.backBtn = function(posX, posY){
        var backBtn = document.createElement('div');
            backBtn.setAttribute('id', 'back');
            backBtn.setAttribute('class', 'button-small');
            backBtn.innerHTML = 'Back';
            backBtn.style.left = posX + 'px';
            backBtn.style.top = posY + 'px';
        content.appendChild(backBtn);
        backBtn.onclick = function(){
            backEvnt();  
        }
    }
    this.drawSecondLayer = function(){
        contextTwo.clearRect(0, 0, sWidth, sHeight);
        content.appendChild(secondLayer);
    }
    //third canvas wich will handle the click event and places the chips
    this.drawThirdLayer = function(){
        content.appendChild(thirdLayer);
        contextThree.clearRect(0, 0, tWidth, tHeight);
        contextThree.drawImage(_FIR.images["tabletOverlay"], 0, 0);
        gGameCore = new gameCore();
        gGameCore.drawBoard();
        thirdLayer.onclick = function(evt){
            if(_FIR.gameSettings.allowClick){
                gGameCore.placeChip(secondLayer,evt);
            }    
        }
    }
    //create alert box for winner or draw game
    this.drawWinnerAlert = function(whoWon, itsDraw){
        var winPopup = document.createElement('div'),
            closePopup = document.createElement('div'),
            newGame = document.createElement('div');
            winPopup.setAttribute('id', 'winPopup');
            closePopup.setAttribute('id', 'closePopup');
            newGame.setAttribute('id', 'restartGame');
            if(whoWon){
                winPopup.innerHTML = 'Player ' + whoWon + ' Wins!';
            }else if(itsDraw){
                winPopup.innerHTML = 'It\'s a ' + itsDraw + ' !';
            }
            newGame.innerHTML = 'New Game';
            content.appendChild(winPopup);
            winPopup.appendChild(closePopup);
            winPopup.appendChild(newGame);

        closePopup.onclick = function(){
            resetGame();
            content.removeChild(winPopup);
        }
        newGame.onclick = function(){
            resetGame();
            content.removeChild(winPopup);
        }
    }
    //reset game button of top of ingame page
    this.resetGameBtn = function(posX, posY){
        var resetBtn = document.createElement('div');
            resetBtn.setAttribute('id', 'reset');
            resetBtn.setAttribute('class', 'button-small');
            resetBtn.innerHTML = 'Reset';
            resetBtn.style.left = posX + 'px';
            resetBtn.style.top = posY + 'px';
        content.appendChild(resetBtn);
        resetBtn.onclick = function(){
            resetGame();
        }
    }
    //build players turn bottom buttons
    this.buildPlayerTurn = function(){
        var playerOne = document.createElement('div');
            playerOne.setAttribute('class', 'whoIs');
            playerOne.innerHTML = '\'s Turn';
            playerOne.setAttribute('id', 'playerOne');
            playerOne.style.background = 'url("images/purple.png") no-repeat left top';
            playerOne.style.left = '11px';
            playerOne.style.borderBottom = '3px solid #ba3391';
        
        var playerTwo = document.createElement('div');
            playerTwo.setAttribute('class', 'whoIs');
            playerTwo.innerHTML = '\'s Turn';
            playerTwo.style.right = '11px';
            playerTwo.setAttribute('id', 'playerTwo');
            playerTwo.style.borderBottom = '3px solid transparent';
            playerTwo.style.background = 'url("images/yellow.png") no-repeat left top';
        
        content.appendChild(playerOne);
        content.appendChild(playerTwo);
    }
}
var visuals = new visuals();

//main function for the game
var gameCore = function() {
    _game = this;
    //draw chip [whichColor, position X, position Y, width, height]
    this.drawChip = function (playerChip, posx, posy, chipWidth, chipHeight) {
        contextTwo.drawImage(playerChip, posx, posy, chipWidth, chipHeight);
    }
    /*
    main object tablet wich holds:
        - width/height filled and players value
    */
    this.drawBoard =  function() {
        //first loop through rows and build the object tablet->row
        for(var row = 0; row < _FIR.gameSettings.rows; row++){
            _FIR.tablet[row] = {};
            //loop through each row and build the columns tablet->rows->cols
            for(var col = 0; col < _FIR.gameSettings.cols; col++){
                /*
                build the maine object with the values in it
                */ 
                if(col <= 0){
                    _FIR.tablet[row][col] = {
                        player : 0,
                        width : _FIR.tabletSettings.chipW, //38
                        height : (_FIR.tabletSettings.chipH + _FIR.tabletSettings.topSpace + ((_FIR.tabletSettings.chipH + _FIR.tabletSettings.topSpace) * row)) + _FIR.tabletSettings.firstOffset,
                        filled : false
                    };
                }else{
                    //calculate the width height of each chip based on the tablet dimension
                    _FIR.tablet[row][col] = {
                        player : 0,
                        width : ((_FIR.tabletSettings.chipW + _FIR.tabletSettings.leftSpace) + _FIR.tablet[row][col-1].width),
                        height : (_FIR.tabletSettings.chipH + _FIR.tabletSettings.topSpace + ((_FIR.tabletSettings.chipH + _FIR.tabletSettings.topSpace) * row)) + _FIR.tabletSettings.firstOffset,
                        filled : false
                    };
                }
            }
        }
    }
    /* function for handeling the click event and placeing chips */
    this.placeChip = function(obj, e){
        var targ = obj,
            top = 0,
            left = 0;
            
        if(obj.target) targ = obj.target;
        while(targ && targ.tagName != 'BODY'){
            top += targ.offsetTop;
            left += targ.offsetLeft;
            targ = targ.offsetParent;
        }        
        var mouseX = e.clientX - left + window.pageXOffset;
        var mouseY = e.clientY - top + window.pageYOffset;
        
       // loop through tablet object and get the columns
       for(var allCols = 0; allCols < _FIR.gameSettings.cols; allCols++){
            var foundValue = false;
            // loop through tablet object and get the rows
            for(var allRows = 0; allRows < _FIR.gameSettings.rows; allRows++){
                /*
                 match click event with the dimensions of the tablet object
                */ 
                if(mouseX <= _FIR.tablet[allRows][allCols].width && mouseY <= _FIR.tablet[allRows][allCols].height){
                    var startRow = 0, //start pos of chip
                        addToPos = -1, //add chip to position starting from -1
                        chipAlRows; //get tablet all rows
                    
                    //get all columns and brake animation if column is true
                    for(chipAlRows = 0; chipAlRows < 6; chipAlRows++){
                        // tablet[rows][columns]
                        if(_FIR.tablet[chipAlRows][allCols].filled === true){
                            break;
                        }
                        //define the position where it needs the chip to drop
                        addToPos++;
                    }
                    if(addToPos != -1){
                        //switch between the players 
                        _game.switchTurns();
                        /*
                         allow click set to false so that if user clicks multiple times
                         not to switch the chips before animation it's done
                        */
                        _FIR.gameSettings.allowClick = false;
                        //animate chip to the point where it's set true
                        _game.animateChips(allCols, startRow, addToPos, whosTurn);
                    }
                    //position found also break first loop
                    foundValue = true;
                    break;
                }
            }
            // check if a value has been found, if so, break the parent loop
            if(foundValue === true) break;
       }
    }
    this.switchTurns = function(){
        var getPlayerOneColor = document.getElementById('playerOne');
        var getPlayerTwoColor = document.getElementById('playerTwo');
        if(whosTurn === _FIR.players.purpleNum){
            //set player to 1
            whosTurn = _FIR.players.yellowNum;
            if(getPlayerOneColor){
                getPlayerOneColor.style.borderBottom = '3px solid #ba3391';
                getPlayerTwoColor.style.borderBottom = '3px solid transparent';
            }                         
        }else{
            //set player to 2
            whosTurn = _FIR.players.purpleNum;
            if(getPlayerTwoColor){
                getPlayerTwoColor.style.borderBottom = '3px solid #e5b912';
                getPlayerOneColor.style.borderBottom = '3px solid transparent';
            }          
        }
    }
    // animate [to column, from top, to the click row, which color]
    this.animateChips = function(colPos, fromRow, toRow, player){
        var chipColor;
        if(player === 1){
            chipColor = _FIR.players.purplePlayer;
        }else{
            chipColor = _FIR.players.yellowPlayer;
        }
        /*
         object wich holds the animation properties
         position, duration, chip type
         called by the draw function
        */
        _FIR.animation = {
            colFrom : colPos,
            rowFrom : fromRow,
            rowTo : toRow,
            time : _FIR.gameSettings.animationTime,
			calcY : 0,
            chipType : _FIR.images[chipColor]
        }
    }
    this.checkWinner = function(player, posRow, posCol){
        var rows,
            cols,
            countH = 0,
            countV = 0,
            topP = 0,
            bottomP = 0,
            diagonalR = 0,
            diagonalL = 0,
            isWinner,
            rowCount = 4,
            winningNo = 4,
            winningNoF = 5, //forced number
            rowCountS = 4;
        /*
            make sure the check it's only 4
            if it's smaller then 4 then increase the row
        */     
        if(posRow < rowCount){
            rowCount = posRow+1;
        }
        if(posRow < 2){
            rowCountS = 5 - posRow;
        }
        /*
          check winner horizontal looping through the rows
          and match the player value
        */
        for(rows = 0; rows < _FIR.gameSettings.rows; rows++){
            countH = 0;
            for(cols = 0; cols < _FIR.gameSettings.cols; cols++){
                //horizontal check winner
                if(_FIR.tablet[rows][cols].player === player){
                    countH += 1;
                }else{
                    countH = 0;
                }
                // if the rows has player value bigger then 4 then we have a winner
                if(countH >= winningNo){
                    isWinner = true;
                }
            }
        }
        /*
          check winner vertically looping through the columns
          and match the player value
        */
        for(var vcols = 0; vcols < _FIR.gameSettings.cols; vcols++){
            countV = 0;
            for(var vrows = 0; vrows < _FIR.gameSettings.rows; vrows++){
                if(_FIR.tablet[vrows][vcols].player === player){
                    countV += 1;
                }else{
                    countV = 0;
                }
                //if the column has a player value matched to 4 or bigger then we have a winner
                if(countV >= winningNo){
                    isWinner = true;
                }    
            }
        }
        /*
         loop throgh top positions : - + and  - -
         this will check the rows and cols based on the + or -
        */
        for(var tP = 0; tP < rowCount; tP++){
            var setCount = false;
            /*
             prevent the count of position not to pass the object size
             if pos it's -1 make it 0 and not to pass 6 wich is the max val of the row
            */
            if(posRow-tP < 0 || posCol+tP > 6){
            }else{
                if(_FIR.tablet[posRow-tP][posCol+tP].player === player){
                    topP++;
                    diagonalR++;
                    setCount = true;
                }
            }
            /*
             prevent the count of position not to pass the object size
             if pos it's -1 make it 0 and not to pass 0 wich is the min val of the row
            */
            if(posRow-tP < 0 || posCol-tP < 0){
            }else{
                if(_FIR.tablet[posRow-tP][posCol-tP].player === player){
                    diagonalL++;
                    if(!setCount){
                        topP++;
                    }    
                }
            }    
            if(topP >= winningNo){
                isWinner = true;
            }
        }
        /*
         loop throgh bottom positions : + - and  + + 
         this will check the rows and cols based on the + or -
        */
        for(var bP = 0; bP < rowCountS; bP++){
            var setCount = false;
            /*
             prevent the count of position not to pass the object size
             if pos it's 5 make it 5 and not to pass 0 wich is the min val of the row
            */            
            if(posRow+bP > 5 || posCol-bP < 0) {
            }else{
                if(_FIR.tablet[posRow+bP][posCol-bP].player === player){
                    bottomP++;
                    diagonalR++;
                    setCount = true;
                }
            }
            if(posRow+bP > 5 || posCol+bP > 6){
            }else{
                if(_FIR.tablet[posRow+bP][posCol+bP].player === player){
                    diagonalL++;
                    if(!setCount){
                        bottomP++;
                    }
                }
            }
            if(bottomP >= winningNo){
                isWinner = true;
            }
        }
        //if the return results of diagonal it's bigger then 5 then it's a winner
        if(diagonalR >= winningNoF){
            isWinner = true;
        }
        if(diagonalL >= winningNoF){
            isWinner = true;
        }
        //set the winner to true in the loops now show the popup and reset the game
        if(isWinner === true){
           resetGame();
           _visuals.drawWinnerAlert(player, false);
        }else{
            //check the draw game
            var countTotal = 0;
            //get all the rows and cols and increase the total
            for(rows = 0; rows < _FIR.gameSettings.rows; rows++){
                for(cols = 0; cols < _FIR.gameSettings.cols; cols++){
                    if(_FIR.tablet[rows][cols].filled === true){
                        countTotal++;
                    }
                }
            }
            //total number of the cols + rows
            if(countTotal >= 42){
                resetGame();
                _visuals.drawWinnerAlert(false, 'draw');
            }
        }
        _FIR.gameSettings.allowClick = true;
    }
}
function draw(){
    contextTwo.clearRect(0,0, sWidth, sHeight);
    if(_FIR.tablet && typeof(_FIR.tablet[0]) != "undefined"){
        if(typeof(_FIR.animation.colFrom) != "undefined"){
            var chipX = ((_FIR.tablet[_FIR.animation.rowFrom][_FIR.animation.colFrom].width - _FIR.tabletSettings.chipW) + 10); //38 + 10
            var fromY = (_FIR.tablet[_FIR.animation.rowFrom][_FIR.animation.colFrom].height - (_FIR.tabletSettings.chipH + 5));  // 0
            var toY = (_FIR.tablet[_FIR.animation.rowTo][_FIR.animation.colFrom].height - (_FIR.tabletSettings.chipH)); //
            if(_FIR.animation.calcY <= toY) {
                var stepY = fromY + (toY / 30);
                var newCalcY = _FIR.animation.calcY += stepY;
                if(newCalcY > toY){
                    _FIR.animation.calcY = toY;
                }else{
                    _FIR.animation.calcY = newCalcY;
                }
            }
            if(_FIR.animation.chipType != 'undefined'){
                _game.drawChip(_FIR.animation.chipType, chipX, _FIR.animation.calcY, _FIR.tabletSettings.chipW, _FIR.tabletSettings.chipH);
                if(_FIR.animation.calcY === toY){
                    _FIR.tablet[_FIR.animation.rowTo][_FIR.animation.colFrom].filled = true;
                    _FIR.tablet[_FIR.animation.rowTo][_FIR.animation.colFrom].player = whosTurn;
                    var colEnd = _FIR.animation.colFrom;
                    var rowEnd = _FIR.animation.rowTo;
                    _FIR.animation = {};
                    _game.checkWinner(whosTurn, rowEnd,colEnd);
                }    
            }    
        }
        for(var row = 0; row < _FIR.gameSettings.rows; row++){
            for(var col = 0; col < _FIR.gameSettings.cols; col++){
                if(_FIR.tablet[row][col].filled === true){
                    var drawPosX = _FIR.tablet[row][col].width - _FIR.tabletSettings.chipW + 10;
                    var drawPosY = _FIR.tablet[row][col].height - _FIR.tabletSettings.chipH;
                    if(_FIR.tablet[row][col].player === 1){
                        whosTurnColor = _FIR.players.purplePlayer;
                    }else{
                        whosTurnColor = _FIR.players.yellowPlayer;
                    }
                    _game.drawChip(_FIR.images[whosTurnColor], drawPosX, drawPosY, _FIR.tabletSettings.chipW, _FIR.tabletSettings.chipH);
                }
            }
        }
    }
}
//about: static page
function aboutPage(){
    clearContent();
    var txtCotent = document.createElement('div');
    txtCotent.setAttribute('id', 'txtAbout');
    txtCotent.innerHTML = "<strong>4 In A Row</strong> it's a simle board game.<br/><br/> If you want to get four stones in a row, you must first have 3 of your stones in the row (or diagonal). And before you have 3 stones in a 4-row, you must first have 2 there<br/><br/>So the first simple lesson is this: drop your stones in places where they will have the biggest effect in terms of 4-rows in which they participate.<br/><br/>If either side does not follow this basic principle, the other side will get lots of tactical possibilities.";
    content.appendChild(txtCotent);
    visuals.indexLogo();
    visuals.blueBoard(6,130);
    visuals.backBtn(10, 8);
}
//clear canvas content and rebuild elements
function backEvnt(){
    contextOne.clearRect(0, 0, cWidth, cHeight);
    content.innerHTML = '';
    /* stop the interval on the start page */
    clearInterval(initAnim);
    donePreloading();
}
function resetGame(){
    whosTurn = _FIR.players.yellowNum;
    clearContent();
    visuals.logoSmall();
    visuals.blueBoard(6,74);
    visuals.drawSecondLayer();
    visuals.drawThirdLayer();
}
//clear canvas content
function clearContent(){
    //remove evertithing from canvas except the buttons
    contextOne.clearRect( 0, 0, cWidth, cHeight);
    contextTwo.clearRect(0,0, sWidth, sHeight);
    contextThree.clearRect(0, 0, tWidth, tHeight);
    //empty the animation object which has the drop from to 
    _FIR.animation = {};
    //the buttons id
    var playBtn = document.getElementById('play'),
        aboutBtn = document.getElementById('about'),
        otherBtn = document.getElementById('other');
    if(playBtn) content.removeChild(playBtn);
    if(aboutBtn) content.removeChild(aboutBtn);
    if(otherBtn) content.removeChild(otherBtn);
    //add the main gackground again has to be on all pages
    visuals.mainBcg();
}
//initiate functions
function donePreloading(){
    content.appendChild(firstLayer);
    contextOne.clearRect(0, 0, cWidth, cHeight);
    visuals.loadGameImages();
    visuals.loadButtons();
}
window.onload = function(){
    window.scrollTo(0, 1);
   preloadImages();
}