const scoresPerBlock = 1;
const scoreComboBonus = 0.1;
const eraseThreshold = 4;
const gameoverThreshold = blockDataHeight - 1;

function search_erasableLine() {
  let j; let erasedLines = 0;
  let currentBlockData = get_blockData();
  for(let i = 0; i < blockDataHeight; i++) {
    for(j = 0; j < blockDataWidth; j++)
      if(currentBlockData[i][j] == 0) break;
    if(j == blockDataWidth) {
      erase_line(i);
      break;
    }
  }
  for(let i = gameoverThreshold; i < blockDataHeight; i++) {
    for(let j = 0; j < blockDataWidth; j++) {
      if(currentBlockData[i][j] > 0) {
        gameover();
        return;
      }
    }
  }
}

function erase_line(lineNum) {
  console.log("ライン" + lineNum + "を削除");
  function search_sameBlock(y, x, type) {
    let i;
    if(type > 0) {
      for(i = 0; i < eraseBlocks.length; i++)
        if(eraseBlocks[i].x == x && eraseBlocks[i].y == y) break;
      if(i == eraseBlocks.length) {
        eraseBlocks.push({x:x, y:y}); combo++;
        if(y > 0 && newBlockData[y - 1][x] == type)
          search_sameBlock(y - 1, x, type);
        if(y < blockDataHeight - 1 && newBlockData[y + 1][x] == type)
          search_sameBlock(y + 1, x, type);
        if(x > 0 && newBlockData[y][x - 1] == type)
          search_sameBlock(y, x - 1, type);
        if(x < blockDataWidth - 1 && newBlockData[y][x + 1] == type)
          search_sameBlock(y, x + 1, type);
      }
    }
  }
  if(typeof lineNum !== "number") {
    console.log("erase_lineの引数の型が違います");
    return;
  }
  let i, j; let eraseBlocks; let placed; let skipped; let scoreCombo; let combo;
  let erasedBlocksSameLine = new Array();
  let newBlockData = get_blockData();
  for(i = 0; i < blockDataWidth; i++) {
    for(j = 0; j < erasedBlocksSameLine.length; j++)
      if(erasedBlocksSameLine[j] == i) break;
    if(j < erasedBlocksSameLine.length) continue;
    eraseBlocks = new Array(); scoreCombo = 0; combo = 0;
    search_sameBlock(lineNum, i, newBlockData[lineNum][i]);
    if(eraseBlocks.length < eraseThreshold && eraseBlocks.length > 0) {
      eraseBlocks = [eraseBlocks[0]]; combo = 1;
    }
    if(combo >= 1) {
      scoreCombo = ((combo - 1) * scoreComboBonus + 1) * scoresPerBlock;
      console.log(combo + "コンボ");
    }
    console.log(scoreCombo + "ポイント加算");
    eraseBlocks.forEach((block) => {
      newBlockData[block.y][block.x] = -1;
      if(block.y == lineNum) erasedBlocksSameLine.push(block.x);
      console.log("ブロック[" + block.y + "][" + block.x + "] を消去");
    });
    scoreTotal += scoreCombo;
    console.log("トータルスコア" + scoreTotal);
    eraseBlocks.forEach((block) => {
      placed = 0; skipped = 0;
      for(j = 0; j < blockDataHeight; j++) {
        if(newBlockData[j][block.x] >= 0)
          newBlockData[placed++][block.x] = newBlockData[j][block.x];
        else
          skipped++;
      }
      for(j = 1; j <= skipped; j++)
        newBlockData[blockDataHeight - j][block.x] = 0;
    });
    if(get_isAbleInput()) update_blockData(newBlockData);
  }
  search_erasableLine();
}

