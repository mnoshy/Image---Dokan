
function holdit(btn, action, start, speedup) {

    var t;
    var repeat = function () {
        action();
        t = setTimeout(repeat, start);
        start = start / speedup;
    }

    btn.addEventListener("mousedown", function (evt) {
        repeat();
    });

    btn.addEventListener("mouseup", function (evt) {
        clearTimeout(t);
    });
    btn.addEventListener("mouseleave", function (evt) {

        clearTimeout(t);
    });
    btn.addEventListener("touchstart", function (evt) {
        repeat();
    });

    btn.addEventListener("touchend", function (evt) {
        clearTimeout(t);
    });

    btn.addEventListener("contextmenu", function (evt) {
        
        clearTimeout(t);
        return false;
    });
}

function Transform(imageID, currentAngle, currentScale, flipX, flipY) {
    if(imageID == null)
    {return;}
    if (oW == 0)
    {
        oW = $("#userImage").width();
        oH = $("#userImage").height();
    }
    scale = currentScale;
    $("#" + imageID).css("-webkit-transform", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).css("-ms-transform ", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).css("transform", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).width(oW * currentScale);
    $("#" + imageID).height(oH * currentScale);
    $("#" + imageID).css("margin-left", translatePos.x + "px");
    $("#" + imageID).css("margin-top", translatePos.y + "px");
}
function RotateRight(imageID, currentAngle, currentScale, flipX, flipY) {
    if(imageID == null)
    {return;}
    angleInDegrees = 5;
    currentAngle += angleInDegrees;

    Transform(imageID, currentAngle, currentScale, flipX, flipY);

    return currentAngle;
}
function RotateLeft(imageID, currentAngle, currentScale, flipX, flipY) {
    if(imageID == null)
    {return;}
    angleInDegrees = -5;
    currentAngle += angleInDegrees;

    Transform(imageID, currentAngle, currentScale, flipX, flipY);

    return currentAngle;
}
function ZoomInFunc(imageID, currentAngle, currentScale, flipX, flipY) {
    if(imageID == null)
    {return;}
    currentScale /= 0.95;

    Transform(imageID, currentAngle, currentScale, flipX, flipY);

    return currentScale;
}
function ZoomOutFunc(imageID, currentAngle, currentScale, flipX, flipY) {
    if(imageID == null)
    {return;}
    currentScale *= 0.95;

    Transform(imageID, currentAngle, currentScale, flipX, flipY);

    return currentScale;
}