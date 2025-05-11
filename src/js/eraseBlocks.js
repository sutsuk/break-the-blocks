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
    let newEraseBlocks = eraseBlocks;
    if(type >= 0) {
      for(a = 0; a < newEraseBlocks.length; a++) {
        if(newEraseBlocks[a].x == x && eraseBlocks[a].y == y) {
          break;
        }
      }
      if(a == newEraseBlocks.length) {
        newEraseBlocks.push({x:x, y:y});
        combo++;
        if(y > 0 && newBlockData[y - 1][x] == type) {
          newEraseBlocks = searchSameBlock(y - 1, x, type, newEraseBlocks);
        }
        if(y < blockDataHeight - 1 && newBlockData[y + 1][x] == type) {
          newEraseBlocks = searchSameBlock(y + 1, x, type, newEraseBlocks);
        }
        if(x > 0 && newBlockData[y][x - 1] == type) {
          newEraseBlocks = searchSameBlock(y, x - 1, type, newEraseBlocks);
        }
        if(x < blockDataWidth - 1 && newBlockData[y][x + 1] == type) {
          newEraseBlocks = searchSameBlock(y, x + 1, type, newEraseBlocks);
        }
      }
    }
    return newEraseBlocks;
  }
  let x, y, a;
  let placed; 
  let skipped; 
  let scoreCombo; 
  let combo;
  let erasedBlocksSameLine = [];
  let newBlockData = get_blockData();
  for (x = 0; x < blockDataWidth; x++) {
    for (a = 0; a < erasedBlocksSameLine.length; a++) {
      if (erasedBlocksSameLine[a].x == x) {
        break;
      }
    }
    if (a < erasedBlocksSameLine.length) {
      continue;
    }
    scoreCombo = 0; 
    combo = 0;
    let eraseBlocks = searchSameBlock(lineNum, x, newBlockData[lineNum][x], []);
    if (eraseBlocks.length < eraseThreshold && eraseBlocks.length > 0) {
      eraseBlocks = [eraseBlocks[0]];
      combo = 1;
    }
    if (combo >= 1) {
      scoreCombo = ((combo - 1) * scoreComboBonus + 1) * scoresPerBlock;
      console.log(`${combo} Combo (+${scoreCombo}pt)`);
    }
    for (a = 0; a < eraseBlocks.length; a++) {
      newBlockData[eraseBlocks[a].y][eraseBlocks[a].x] = -1;
      if (eraseBlocks[a].y == lineNum) {
        erasedBlocksSameLine.push(eraseBlocks[a]);
      }
      console.log(`Erase blockData[${eraseBlocks[a].y}][${eraseBlocks[a].x}]`);
    }
    console.log(`Total scores = ${scoreTotal += scoreCombo}`);
  }
  for (x = 0; x < blockDataWidth; x++) {
    placed = 0; 
    skipped = 0;
    for (y = blockDataHeight - 1; y >= 0; y--) {
      if (newBlockData[y][x] >= 0) {
        newBlockData[blockDataHeight - 1 - placed++][x] = newBlockData[y][x];
      } else {
        skipped++;
      }
    }
    for (y = 0; y < skipped; y++) {
      newBlockData[y][x] = -1;
    }
  }
  update_blockData(newBlockData);
  searchErasableLine();
}

