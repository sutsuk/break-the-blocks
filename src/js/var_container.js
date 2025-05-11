const blockImageNames = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg"];
const blockImageSize = 50;
const blockDataHeight = 9;
const blockDataWidth = 6;
let blockData = [];
let gameScreenCanvasDOM = null;
let gameScreenCanvasContext = null;
let isAbleInput = true;
let justUpdate = false;
let blockImages = [];
for (let a = 0; a < blockImageNames.length; a++) {
  blockImages.push(new Image());
  blockImages[a].src = `/break-the-blocks/src/images/${blockImageNames[a]}`;
}

function get_isAbleInput() {
    return isAbleInput;
}

function set_isAbleInput(nowAbleInput) {
    if(typeof nowAbleInput !== "boolean"){
        console.log("set_able_inputに代入された型が違います")
        return;
    }
    isAbleInput = nowAbleInput
    return;
}

function is_good_blockData(newBlockData){
    let is_good_data = true
    if(typeof newBlockData !== "object"){
        console.log("is_good_blockDataに代入された型が違います")
        is_good_data = false
    }
    if(newBlockData.length !== blockDataHeight){
        console.log("is_good_blockDataに代入された高さが違います")
        is_good_data = false
    }
    for (let i = 0; i < newBlockData.length; i++) {
        if(newBlockData[i].length !== blockDataWidth){
            console.log("is_good_blockDataに代入された" + i + "番目の幅が違います")
            is_good_data = false
        } 
    }
    return is_good_data
}

function get_blockData() {
    return blockData;
}

function update_blockData(newBlockData){
    if(is_good_blockData(newBlockData)){
        blockData.splice(0,blockDataHeight)
        console.log("newBlockData = " + newBlockData)
        newBlockData.forEach((line) => {
            console.log("line = " + line)
            blockData.push(line)
          })
    } else{
        console.log("update_blockdataに代入された値が正しくありません")
    }
    return;
}
