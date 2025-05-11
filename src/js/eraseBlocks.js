const scoresPerBlock = 1;
const scoreComboBonus = 0.1;
const eraseThreshold = 4;

function searchErasableLine() {
  let i, j; 
  let erasedLines = 0;
  let currentBlockData = get_blockData();
  for(i = 0; i < blockDataHeight; i++) {
    for(j = 0; j < blockDataWidth; j++) {
      if(currentBlockData[i][j] == -1) {
        break;
      }
    }
    if(j == blockDataWidth) {
      eraseLine(i);
      break;
    }
  }
}

function eraseLine(lineNum) {
  console.log(`Erase line: ${lineNum}`);
  function searchSameBlock(y, x, type, eraseBlocks) {
    let a;
    if(type > 0) {
      for(a = 0; a < eraseBlocks.length; a++) {
        if(eraseBlocks[a].x == x && eraseBlocks[a].y == y) {
          break;
        }
      }
      if(a == eraseBlocks.length) {
        eraseBlocks.push({x:x, y:y});
        combo++;
        if(y > 0 && newBlockData[y - 1][x] == type) {
          eraseBlocks = searchSameBlock(y - 1, x, type, eraseBlocks);
        }
        if(y < blockDataHeight - 1 && newBlockData[y + 1][x] == type) {
          eraseBlocks = searchSameBlock(y + 1, x, type, eraseBlocks);
        }
        if(x > 0 && newBlockData[y][x - 1] == type) {
          eraseBlocks = searchSameBlock(y, x - 1, type, eraseBlocks);
        }
        if(x < blockDataWidth - 1 && newBlockData[y][x + 1] == type) {
          eraseBlocks = searchSameBlock(y, x + 1, type, eraseBlocks);
        }
      }
    }
    return eraseBlocks;
  }
  let x, a;
  let eraseBlocks; 
  let placed; 
  let skipped; 
  let scoreCombo; 
  let combo;
  let erasedBlocksSameLine = new Array();
  let newBlockData = get_blockData();
  for(x = 0; x < blockDataWidth; x++) {
    for(a = 0; a < erasedBlocksSameLine.length; a++) {
      if(erasedBlocksSameLine[a] == x) {
        break;
      }
    }
    if(a < erasedBlocksSameLine.length) {
      continue;
    }
    scoreCombo = 0; 
    combo = 0;
    eraseBlocks = searchSameBlock(lineNum, x, newBlockData[lineNum][x], []);
    if (eraseBlocks.length < eraseThreshold && eraseBlocks.length > 0) {
      eraseBlocks = [eraseBlocks[0]];
      combo = 1;
    }
    if (combo >= 1) {
      scoreCombo = ((combo - 1) * scoreComboBonus + 1) * scoresPerBlock;
      console.log(`${combo} Combo (+${scoreCombo}pt)`);
    }
    eraseBlocks.forEach((block) => {
      newBlockData[block.y][block.x] = -1;
      if (block.y == lineNum) {
        erasedBlocksSameLine.push(block.x);
      }
      console.log(`Erase blockData[${block.y}][${block.x}]`);
    });
    console.log(`Total scores = ${scoreTotal += scoreCombo}`);
    eraseBlocks.forEach((block) => {
      placed = 0; 
      skipped = 0;
      for (a = blockDataHeight - 1; a >= 0; a--) {
        if (newBlockData[a][block.x] >= 0) {
          newBlockData[blockDataHeight - 1 - placed++][block.x] = newBlockData[a][block.x];
        } else {
          skipped++;
        }
      }
      for(j = 0; j < skipped; j++) {
        newBlockData[j][block.x] = -1;
      }
    });
    update_blockData(newBlockData);
  }
  searchErasableLine();
}

