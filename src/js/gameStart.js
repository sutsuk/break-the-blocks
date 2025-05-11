let scoreTotal = 0;
let isGameActive = false;
let fallingBlock = [[]];
let fallingBlockPos = {x: 0, y: 0};

window.addEventListener("load", gameStart);

function gameStart() {
  scoreTotal = 0;
  isGameActive = true;
  gameScreenCanvasDOM = document.getElementById("game-screen-canvas");
  gameScreenCanvasContext = gameScreenCanvasDOM.getContext('2d');
  gameScreenCanvasDOM.width = blockImageSize * blockDataWidth;  
  gameScreenCanvasDOM.height = blockImageSize * blockDataHeight;
  scoreTotal = 0;
  let newBlockData = [];
  for(let a = 0; a < blockDataHeight; a++) {
    newBlockData.push([]);
    for(let b = 0; b < blockDataWidth; b++) {
      newBlockData[a].push(-1);
    }
  }
  generateFallingBlock();
  update_blockData(newBlockData);
  document.body.addEventListener("keydown", keyEvent);
  // generateFallingBlock();
  setTimeout(gameMainLoop, 1000);
}

function keyEvent(e=null) {
  if (isGameActive) {
    console.log(`keyEvent: ${e.code}`);
    if (e.code == "ArrowUp") {
      console.log("Under construction...");
    } else if (e.code == "ArrowDown") {
      faiingBlockMove({x: 0, y: 1});
    } else if (e.code == "ArrowLeft") {
      faiingBlockMove({x: -1, y: 0});
    } else if (e.code == "ArrowRight") {
      faiingBlockMove({x: 1, y: 0});
    }
  }
}

function gameMainLoop() {
  faiingBlockMove({x: 0, y: 1});
  if (isGameActive) {
    setTimeout(gameMainLoop, 1000);
  }
}

function faiingBlockMove(move) {
  let updateFallingBlockFlag = true;
  let blockShape = {x: fallingBlock[0].length, y: fallingBlock.length};
  let fallingBlockPosNext = {
    x: fallingBlockPos.x + move.x, 
    y: fallingBlockPos.y + move.y
  };
  if (fallingBlockPosNext.x < 0) {
    console.log(`x: ${fallingBlockPosNext.x} is out of board`);
    updateFallingBlockFlag = false;
  } else if (fallingBlockPosNext.x + blockShape.x - 1 >= blockDataWidth) {
    console.log(`x: ${fallingBlockPosNext.x + blockShape.x} is out of board`);
    updateFallingBlockFlag = false;
  }
  if (fallingBlockPosNext.y + blockShape.y - 1 >= blockDataHeight) {
    console.log(`y: ${fallingBlockPosNext.y} is out of board`);
    updateFallingBlockFlag = false;
  }
  if (updateFallingBlockFlag) {
    let currentBlockData = get_blockData();
    for (let y = 0; y < blockShape.y; y++) {
      for (let x = 0; x < blockShape.x; x++) {
        if (fallingBlockPosNext.y + y < 0) {
          continue;
        } else if (fallingBlock[y][x] == -1) {
          continue;
        } else if (currentBlockData[fallingBlockPosNext.y + y][fallingBlockPosNext.x + x] >= 0) {
          console.log(`Block is already exists at (x: ${fallingBlockPosNext.x + x}, y: ${fallingBlockPosNext.y + y})`);
          updateFallingBlockFlag = false;
        }
      }
    }
  }
  if (updateFallingBlockFlag) {
    fallingBlockPos = fallingBlockPosNext;
  } else {
    if (move.y == 1) {
      console.log(`The falling block is placed`);
      placeFallingBlock();
      generateFallingBlock();
    }
  }
  drawGameScreen();
}

function placeFallingBlock() {
  let blockShape = {x: fallingBlock[0].length, y: fallingBlock.length};
  let newBlockData = get_blockData();
  for (let a = 0; a < blockShape.y; a++) {
    for (let b = 0; b < blockShape.x; b++) {
      if (fallingBlock[a][b] == -1) {
        continue;
      } else if (fallingBlockPos.x + b < 0 || fallingBlockPos.x + b >= blockDataWidth) {
        console.error(`Failed to place the falling block`);
        console.error(`Reason: Block will be placed x-axis out of board`);
        gameover();
      } else if (fallingBlockPos.y + a < 0 || fallingBlockPos.y + a >= blockDataHeight) {
        console.error(`Failed to place the falling block`);
        console.error(`Reason: Block will be placed y-axis out of board`);
        gameover();
      } else if (newBlockData[fallingBlockPos.y + a][fallingBlockPos.x + b] >= 0) {
        console.error(`Failed to place the falling block`);
        console.error(`Reason: Block is already exists at (x: ${fallingBlockPos.x + b}, y: ${fallingBlockPos.y + a})`);
        gameover();
      } else {
        newBlockData[fallingBlockPos.y + a][fallingBlockPos.x + b] = fallingBlock[a][b];
      }
    }
  }
  update_blockData(newBlockData);
  searchErasableLine();
}

function generateFallingBlock() {
  let blockPattern = blockPatterns[parseInt(Math.random() * blockPatterns.length)];
  fallingBlock = [];
  for (let a = 0; a < blockPattern.length; a++) {
    fallingBlock.push([]);
    for (let b = 0; b < blockPattern[a].length; b++) {
      if (blockPattern[a][b]) {
        fallingBlock[a].push(parseInt(Math.random() * blockImages.length));
      } else {
        fallingBlock[a].push(-1);
      }
    }
  }
  fallingBlockPos = {x: 0, y: (-1) * blockPattern.length};
}

function drawGameScreen() {
  let currentBlockData = get_blockData();
  gameScreenCanvasContext.clearRect(0, 0, gameScreenCanvasDOM.width, gameScreenCanvasDOM.height);
  for (let a = 0; a < fallingBlock.length; a++) {
    for (let b = 0; b < fallingBlock[a].length; b++) {
      if (fallingBlock[a][b] >= 0) {
        gameScreenCanvasContext.drawImage(
          blockImages[fallingBlock[a][b]],
          blockImageSize * b + blockImageSize * fallingBlockPos.x, 
          blockImageSize * a + blockImageSize * fallingBlockPos.y,
          blockImageSize, blockImageSize
        );
      }
    }
  }
  for (let i = 0; i < blockDataHeight; i++) {
    for (let j = 0; j < blockDataWidth; j++) {
      if (currentBlockData[i][j] >= 0 && currentBlockData[i][j] < blockImages.length) {
        // console.log(`(y:${i}, j:${j}) blockImages[${currentBlockData[i][j]}]`);
        gameScreenCanvasContext.drawImage(
          blockImages[currentBlockData[i][j]], 
          blockImageSize * j, blockImageSize * i, 
          blockImageSize, blockImageSize
        );
      } else {
        // console.log(`(y:${i}, j:${j}) skipped`);
      }
    }
  }   
}

function gameover() {
  console.log("ゲームオーバー");
  isGameActive = false;
}

