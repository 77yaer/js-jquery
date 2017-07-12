/**
 * Created by dell-pc on 2017/4/21.
 */

//生成随机数动画
function showNumberWithAnimation(i, j, randNumber) {

    var numberCell = $("#number-cell-" + i + "-" + j);

    numberCell.css("background-color", getNumberBackgroundColor(randNumber));
    numberCell.css("color", getNumberColor(randNumber));
    numberCell.text(randNumber);

    //动画效果
    numberCell.animate({
        width: "100px",
        height: "100px",
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 50);
}

//移动的动画操作
function showMoveAnimation(fromx, fromy, tox, toy) {
    var numberCell = $("#number-cell-" + fromx + "-" + fromy);
    numberCell.animate({
        top: getPosTop(tox, toy),
        left: getPosLeft(tox, toy)
    }, 200);

}

//更新分数 可以自己加动画效果
function updateScore(score) {
    $("#score").text("score: " + score);
}