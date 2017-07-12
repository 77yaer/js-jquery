/**
 * Created by dell-pc on 2017/4/21.
 */

var board = new Array();//方格
var score = 0; //分数
var hasConflicted = new Array();//记录每一个小格子是否已经发生过合并

//加载函数
$(document).ready(function () {

    newGame();
});



//游戏总函数
function newGame() {
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();

}

//初始化游戏
function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {

            var gridCell = $("#grid-cell-" + i + "-" + j);
            gridCell.css("top", getPosTop(i, j));
            gridCell.css("left", getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();
    score = 0;
    updateScore(0);

}

//更新方格视图
function updateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append("<div class='number-cell' id='number-cell-" + i + "-" + j + "'></div>");
            var theNumberCell = $("#number-cell-" + i + "-" + j);

            if (board[i][j] == 0) {
                theNumberCell.css("width", "0px");
                theNumberCell.css("height", "0px");
                theNumberCell.css("top", getPosTop(i, j) + 50);
                theNumberCell.css("left", getPosLeft(i, j) + 50);
            } else {
                theNumberCell.css("width", "100px");
                theNumberCell.css("height", "100px");
                theNumberCell.css("top", getPosTop(i, j));
                theNumberCell.css("left", getPosLeft(i, j));
                theNumberCell.css("background-color", getNumberBackgroundColor(board[i][j]));
                theNumberCell.css("color", getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j])
            }
            hasConflicted[i][j] = false;
        }

    }
}

//随机生成数字
function generateOneNumber() {

    //判断是否可以生成随机数
    if (nospace(board)) {
        return false;
    }

    //随机一个位置
    var randX = parseInt(Math.floor(Math.random() * 4));//生成0-3
    var randY = parseInt(Math.floor(Math.random() * 4));//生成0-3

    var times = 0;
    while (times < 50) {
        if (board[randX][randY] == 0) {
            break;
        }
        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }

    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randX = i;
                    randY = j;
                }
            }
        }
    }

    //随机一个数字
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示出随机数字
    board[randX][randY] = randNumber;
    //随机数动画
    showNumberWithAnimation(randX, randY, randNumber);

    return true;
}

//鼠标按钮函数
$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37://left
            if (moveLeft()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 38://up
            if (moveUp()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 39://right
            if (moveRight()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        case 40://down`
            if (moveDown()) {
                setTimeout("generateOneNumber()", 210);
                setTimeout("isGameOver()", 300);
            }
            break;
        default://default
            break;
    }
});

//判断游戏是否结束
function isGameOver() {
    if (nospace(board) && nomove(board)) {
        gameover();
    }
}

function gameover() {
    alert("gameover");
}

//向左移动
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }

    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    //判断落脚位置是否为空且移动路径没有障碍物
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {

                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board) && !hasConflicted[i][k]) {//判断落脚位置数字与原数字是否相等且移动路径没有障碍物

                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }

    //刷新所有数据
    setTimeout("updateBoardView()", 200);
    return true;
}

//向右移动
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }

    //moveRight
    for (var i = 0; i < 4; i++)
        for (var j = 2; j >= 0; j--)
            if (board[i][j] != 0) {
                for (var k = 3; k > j; k--)
                    if (board[i][k] == 0 && noBlockHorizontal(i, j, k, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, j, k, board) && !hasConflicted[i][k]) {

                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        hasConflicted[i][k] = true;
                        continue;
                    }
            }


    //刷新所有数据
    setTimeout("updateBoardView()", 200);
    return true;
}

//向上移动
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }

    //moveUp
    for (var j = 0; j < 4; j++)
        for (var i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {

                    if (board[k][j] == 0 && noBlockVertical(j, k, i, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, k, i, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;
}

//向下移动
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }

    for (var j = 0; j < 4; j++)
        for (var i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (var k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockVertical(j, i, k, board)) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j]
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(j, i, k, board) && !hasConflicted[k][j]) {
                        showMoveAnimation(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }
    setTimeout("updateBoardView()", 200);
    return true;

}








