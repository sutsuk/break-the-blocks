function gameStart() {
  scoreTotal = 0;
  gameScreenCanvasDOM = document.getElementById("game-screen-canvas");
  gameScreenCanvasContext = gameScreenCanvasDOM.getContext('2d');
  gameScreenCanvasDOM.width = blockImageSize * blockDataWidth;  
  gameScreenCanvasDOM.height = blockImageSize * blockDataHeight;  
  drawGameScreen();
}

function drawGameScreen() {
  let currentBlockData = get_blockData();
  for(let i = 0; i < blockDataHeight; i++) {
    for(let j = 0; j < blockDataWidth; j++) {
      if (currentBlockData[i][j] >= 0 && currentBlockData[i][j] < blockImages.length) {
        console.log(`(y:${i}, j:${j}) blockImages[${currentBlockData[i][j]}]`);
        gameScreenCanvasContext.drawImage(
          blockImages[currentBlockData[i][j]], 
          blockImageSize * j, blockImageSize * i, 
          blockImageSize, blockImageSize
        );
      }
    }
  }   
}

window.addEventListener("load", gameStart);

