var game = {
    "width": 10,//定义游戏宽
    "height": 10,//定义游戏高
    "boomNum": 15,//定义炸弹数量
    "blockLine": new Array(),//定义格子列数组
    "gameAreaArray": gameAreaArray,//定义游戏区域数组
    "createArea": function () {
        game.area = document.getElementsByClassName("gameArea")[0];
        game.width = game.area.offsetWidth;
        game.height = game.area.offsetHeight;
        //设定好游戏区域
        let i = 0;
        while (true) {
            var boomLocationX = parseInt(Math.random() * 10);
            var boomLocationY = parseInt(Math.random() * 10);
            //随机生成炸弹的位置
            if (gameAreaArray[boomLocationX][boomLocationY] == 0) {
                gameAreaArray[boomLocationX][boomLocationY] = 1;
                i++;
                //判断此处是否已有炸弹
            } else {
                continue;
            }
            if (i == game.boomNum) {
                break;
            }
        }
        game.createBlock();
        //创建格子
    },
    "createBlock": function () {
        var blockWidth = 0;
        for (let i = 0; i < game.width / 40 - 1; i++) {
            game.blockLine[i] = new Array();
            //定义每个列的行数组
            var blockHeight = 0;
            for (let j = 0; j < game.height / 40 - 1; j++) {
                game.blockLine[i][j] = document.createElement("div");
                game.blockLine[i][j].style.backgroundColor="lightblue";
                game.blockLine[i][j].width = 40 + "px";
                game.blockLine[i][j].height = 40 + "px";
                game.blockLine[i][j].className = "block";
                game.blockLine[i][j].id = i + "-" + j;
                game.blockLine[i][j].style.left = blockWidth + "px";
                game.blockLine[i][j].style.top = blockHeight + "px";
                game.blockLine[i][j].roundBoom = 0;
                //设置每个格子的属性
                //roundBoom为该格子周围的八个格子是否有炸弹,默认为0
                if (gameAreaArray[i][j] == 1) {
                    game.blockLine[i][j].isBoom = true;
                } else {
                    game.blockLine[i][j].isBoom = false;
                }
                //判断该格子是否有炸弹
                game.blockLine[i][j].onmousedown = function (e) {
                    game.guess(e, this);
                    //鼠标交互
                }
                blockHeight += 40;
                //创建下一行的格子
                game.area.appendChild(game.blockLine[i][j]);
            }
            blockWidth += 40;
            //创建下一列的格子
        }
        for (let i = 0; i < game.width / 40 - 1; i++) {
            for (let j = 0; j < game.height / 40 - 1; j++) {
                if (gameAreaArray[i][j] == 0) {
                    let count = 0;
                    try {
                        if (game.blockLine[i - 1][j - 1].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    try {
                        if (game.blockLine[i - 1][j].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    try {
                        if (game.blockLine[i - 1][j + 1].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    try {
                        if (game.blockLine[i][j - 1].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    try {
                        if (game.blockLine[i][j + 1].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    try {
                        if (game.blockLine[i + 1][j - 1].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    try {
                        if (game.blockLine[i + 1][j].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    try {
                        if (game.blockLine[i + 1][j + 1].isBoom) {
                            count++;
                        }
                    } catch (error) {}
                    game.blockLine[i][j].roundBoom = count;
                    //分别判断该格子周围八格里炸弹的个数
                    //若周围格子数不足八格，则不判断没有格子的地方
                }
            }
        }
    },
    "guess": function (e, block) {
        if (e.button == 0) {
            game.confirmB(block);
            //左键点击，意味着玩家觉得此处没有炸弹，并查看周围的炸弹数
        }
        if (e.button == 2) {
            if (block.innerHTML == "?") {
                block.innerHTML = "";
                //取消因右键点击生成的问号
            } else if (block.style.backgroundColor != "grey") {
                block.innerHTML = "?";
                //生成问号，意味着玩家觉得此处可能有炸弹
            }
        }
    },
    "confirmB": function (block) {
        if (block.isBoom) {
            block.style.backgroundColor = "black";
            block.innerHTML = "";
            //玩家点击到炸弹，清除该格子上的标记
        } else {
            block.style.backgroundColor = "grey";
            block.innerHTML = block.roundBoom;
            //玩家没有点击到炸弹，该格子上显示该格子周围有几个炸弹
            if (block.roundBoom == 0) {
                let row = block.id.split("-")[0];
                let line = block.id.split("-")[1];
                try {
                    if (game.blockLine[row - 1][line - 1].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[row - 1][line - 1]);
                } catch (error) {}
                try {
                    if (game.blockLine[row - 1][line].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[row - 1][line]);
                } catch (error) {}
                try {
                    if (game.blockLine[row - 1][parseInt(line)+ 1].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[row - 1][parseInt(line)+ 1]);
                } catch (error) {}
                try {
                    if (game.blockLine[row][line - 1].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[row][line - 1]);
                } catch (error) {}
                try {
                    if (game.blockLine[row][parseInt(line)+ 1].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[row][parseInt(line)+ 1]);
                } catch (error) {}
                try {
                    if (game.blockLine[parseInt(row)+1][line - 1].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[parseInt(row)+ 1][line - 1]);
                } catch (error) {}
                try {
                    if (game.blockLine[parseInt(row)+ 1][line].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[parseInt(row)+ 1][line]);
                } catch (error) {}
                try {
                    if (game.blockLine[parseInt(row)+ 1][parseInt(line)+ 1].style.backgroundColor == "lightblue")
                        game.confirmB(game.blockLine[parseInt(row)+ 1][parseInt(line)+ 1]);
                } catch (error) {}
            }
            //如果该格子周围八格没有炸弹，则将周围八格自动点亮
            //周围不足八格的则在没有格子的地方不进行操作
        }
    }
}

window.onload = function () {
    document.oncontextmenu = function () {
        return false;
    }
    //取消右键点击事件
    game.createArea();
    //创建游戏
}

var gameAreaArray = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
//游戏区域，用数组表示，用来放置炸弹和判断炸弹