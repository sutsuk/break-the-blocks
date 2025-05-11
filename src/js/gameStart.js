let scoreTotal = 0;
let isGameActive = false;

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
  update_blockData(newBlockData);
  setTimeout(gameMainLoop, 1000);
}

function gameMainLoop() {
  drawGameScreen();
  if (isGameActive) {
    setTimeout(gameMainLoop, 1000);
  }
}

function drawGameScreen() {
  let currentBlockData = get_blockData();
  for(let i = 0; i < blockDataHeight; i++) {
    for(let j = 0; j < blockDataWidth; j++) {
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

