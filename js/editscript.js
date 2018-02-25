var serverPath = "http://dev.acme-group.net/imagedemo2/api.php";
var noshyServerPath = "http://dev.acme-group.net/imagedemo2/";
var scales = [];
var angles = [];
var translatePosArray = [];
var ImageIDs = [];
var ImgIndex = -1;
var ImageUrls = [];
var RemoteLink;

var scale = 1.0;
var flipX = 1;
var flipY = 1;
var scaleMultiplier = 0.8;
var currentAngle = 0;
var angleInDegrees = 0;
var oW = 0;
var oH = 0;
var translatePos = {
    x: 0,
    y: 0
};
var imageID = null;
var saveNeeded = false;
var hideMoodBoards = false;
// Control Scroll
var scrollEnabled = true;

var allData;
window.onload = function () {
    $.ajax({
        url: noshyServerPath + "noshyapi.php?inspirations=true"
    }).done(function (data) {

        inspirations = data;

    }).fail(function (edata) {

    });

    $.ajax({
        url: serverPath + "?allcategories=a"
    }).done(function (data) {
        allData = data;
        send_request('Sofas');
    }).fail(function (data) {
    });

    function updateIndicatoroff() {
        $(".offline-ui").removeClass("offline-ui-up");
        $(".offline-ui").addClass("offline-ui-down");
    }
    function updateIndicatoron() {
        $(".offline-ui").addClass("offline-ui-up");
        $(".offline-ui").removeClass("offline-ui-down");
    }
    // Update the online status icon based on connectivity
    // document.addEventListener('online', updateIndicatoron);
    // document.addEventListener('offline', updateIndicatoroff);
    setInterval(function () {
        if (navigator.onLine == false) {
            updateIndicatoroff();
        }
        else {
            updateIndicatoron();
        }
    }, 1000);
    if (navigator.onLine == false) {

        $(".offline-ui").removeClass("offline-ui-up");
        $(".offline-ui").addClass("offline-ui-down");
    }
    LoadData();
    //document.addEventListener('contextmenu', event => event.preventDefault());
    var container = document.getElementById("cutter");
    var ZoomIn = document.getElementById("zoomIn");
    var ZoomOut = document.getElementById("zoomOut");
    var rotateRight = document.getElementById("rotateRight");
    var rotateLeft = document.getElementById("rotateLeft");




    var startDragOffset = {};
    var mouseDown = false;



    container.addEventListener("touchstart", function (evt) {
        mouseDown = true;
        startDragOffset.x = evt.touches[0].pageX - translatePos.x;
        startDragOffset.y = evt.touches[0].pageY - translatePos.y;
        if (imageID != null) {
            //saveNeeded = true;
            if (scrollEnabled) {
                disableScroll();
            }
        }

    });

    container.addEventListener("touchend", function (evt) {
        mouseDown = false;
        if(scrollEnabled)
            enableScroll();
        DeselectImages();
        //saveNeeded = true;
    });

    container.addEventListener("touchmove", function (evt) {
        if (mouseDown) {
            if (imageID == null) { return; }
            if (Math.abs((evt.touches[0].pageY - startDragOffset.y) - translatePos.y) <= 30) {



                var nx = evt.touches[0].pageX - startDragOffset.x;
                var ny = evt.touches[0].pageY - startDragOffset.y;
                var cutterWidth = $("#cutter").width();
                var cutterHeight = $("#cutter").width();


                if (($("#" + imageID).width() + nx) >= 20 &&
                    ($("#" + imageID).height() + ny) >= 20 &&
                    cutterWidth - nx >= 20 &&
                    cutterHeight - ny >= 20
                ) {
                    // console.log((nx+$("#" + imageID).width()));
                    // console.log(cutterWidth);
                    translatePos.x = evt.touches[0].pageX - startDragOffset.x;
                    translatePos.y = evt.touches[0].pageY - startDragOffset.y;
                    $("#" + imageID).css("margin-left", translatePos.x + "px");
                    $("#" + imageID).css("margin-top", translatePos.y + "px");
                    updateArray();
                }


            }
            else {
                mouseDown = false;
                if(scrollEnabled)
                    enableScroll();
                DeselectImages();
            }
            saveNeeded = true;
        }
    });
    container.addEventListener("mousedown", function (evt) {
        mouseDown = true;
        startDragOffset.x = evt.clientX - translatePos.x;
        startDragOffset.y = evt.clientY - translatePos.y;
        //saveNeeded = true;
    });

    container.addEventListener("mouseup", function (evt) {
        mouseDown = false;
        //saveNeeded = true;
    });

    container.addEventListener("mouseover", function (evt) {
        mouseDown = false;
        //saveNeeded = true;
    });

    container.addEventListener("mouseout", function (evt) {
        mouseDown = false;
        //saveNeeded = true;
    });

    container.addEventListener("mousemove", function (evt) {
        if (mouseDown) {

            if (imageID == null) { return; }


            var nx = evt.clientX - startDragOffset.x;
            var ny = evt.clientY - startDragOffset.y;
            var cutterWidth = $("#cutter").width();
            var cutterHeight = $("#cutter").width();
            if (($("#" + imageID).width() + nx) >= 20 &&
                ($("#" + imageID).height() + ny) >= 20 &&
                cutterWidth - nx >= 20 &&
                cutterHeight - ny >= 20
            ) {
                translatePos.x = evt.clientX - startDragOffset.x;
                translatePos.y = evt.clientY - startDragOffset.y;
                $("#" + imageID).css("margin-left", translatePos.x + "px");
                $("#" + imageID).css("margin-top", translatePos.y + "px");
                updateArray();
                saveNeeded = true;
            }
        }
    });

    holdit(rotateRight, function () { RotateRight(imageID, flipX, flipY); }, 50, 1);
    holdit(rotateLeft, function () { RotateLeft(imageID, flipX, flipY); }, 50, 1);
    holdit(ZoomIn, function () { scale = ZoomInFunc(imageID, currentAngle, flipX, flipY); }, 50, 1);
    holdit(ZoomOut, function () { scale = ZoomOutFunc(imageID, currentAngle, flipX, flipY); }, 50, 1);


    setInterval(function () { SaveData(); }, 5000);

};

function holdit(btn, action, start, speedup) {

    var t;
    var repeat = function () {
        action();
        // t = setTimeout(repeat, start);
        // start = start / speedup;
    };

    btn.addEventListener("mousedown", function (evt) {
        repeat();
    });

    btn.addEventListener("mouseup", function (evt) {
        // clearTimeout(t);
    });
    btn.addEventListener("mouseleave", function (evt) {

        // clearTimeout(t);
    });
    btn.addEventListener("touchstart", function (evt) {
        repeat();
    });

    btn.addEventListener("touchend", function (evt) {
        // clearTimeout(t);
    });

    btn.addEventListener("contextmenu", function (evt) {

        // clearTimeout(t);
        return false;
    });
}
function Transform(imageID, currentAngle, flipX, flipY) {
    if (imageID == null) { return; }
    if (ImgIndex == -1)
        return;
    if (oW == 0) {

        oW = 223;


    }

    // scale = currentScale;
    $("#" + imageID).css("-webkit-transform", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).css("-ms-transform ", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).css("transform", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).width(oW * scale);
    // $("#" + imageID).height(oH * scale);
    $("#" + imageID).css("margin-left", translatePos.x + "px");
    $("#" + imageID).css("margin-top", translatePos.y + "px");
    updateArray();
    saveNeeded = true;
    return scale;
}
function RotateRight(imageID, flipX, flipY) {
    if (imageID == null) { return; }
    angleInDegrees = 5;
    currentAngle += angleInDegrees;
    // console.log("|"+currentAngle+"|");

    Transform(imageID, currentAngle, flipX, flipY);
    updateArray();
    return currentAngle;
}
function RotateLeft(imageID, flipX, flipY) {
    if (imageID == null) { return; }
    angleInDegrees = -5;
    currentAngle += angleInDegrees;
    // console.log("|"+currentAngle+"|");
    Transform(imageID, currentAngle, flipX, flipY);
    updateArray();
    return currentAngle;
}
function ZoomInFunc(imageID, currentAngle, flipX, flipY) {
    if (imageID == null) { return; }
    scale = parseFloat(scale);
    scale = scale > 2.0 ? scale : scale + 0.05;

    Transform(imageID, currentAngle, flipX, flipY);
    updateArray();
    return scale;
}
function ZoomOutFunc(imageID, currentAngle, flipX, flipY) {
    if (imageID == null) { return; }
    scale = parseFloat(scale);
    scale = scale < 0.05 ? scale : scale - 0.05;

    Transform(imageID, currentAngle, flipX, flipY);
    updateArray();
    return scale;
}

function AddImage(imageId, containerId) {
    $(".selectedImg").removeClass("selectedImg");
    for (i = 0; i < ImageIDs.length; i++) {
        if (ImageIDs[i] == "ed_" + imageId) {
            imageID = null;
            DeleteImage("ed_" + imageId);
            saveNeeded = true;
            return;
        }
    }

    var newImageWidth = 223;
    var newsrc = $("#" + imageId).attr("src").replace("furniture", "trimmed");
    // alert(newsrc);
    var nesc = 1.0;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        nesc = 0.5;
    }
    var newHTMLImg = "<img onclick='SelectImage(\"ed_" + imageId + "\");event.stopPropagation();' class='nodrag' id='ed_" + imageId + "' src='" + newsrc + "' style='height:auto;width:" + (newImageWidth * nesc) + "px;position:absolute;left:0;top:0;' />";

    $("#" + containerId).append(newHTMLImg);
    document.getElementById("ed_" + imageId).addEventListener("touchstart", function (evt) {
        SelectImage("ed_" + imageId);

    });
    imageID = null;

    ImgIndex = ImageIDs.length;
    ImageIDs.push("ed_" + imageId);

    translatePosArray.push({
        x: 0,
        y: 0
    });
    scales.push(nesc);
    angles.push(0.0);
    ImageUrls.push(newsrc);
    translatePos = translatePosArray[ImgIndex];
    scale = scales[ImgIndex];
    currentAngle = angles[ImgIndex];
    $('.nodrag').on('dragstart', function (event) { event.preventDefault(); });
    //alert(newsrc);
    saveNeeded = true;

}

function DeleteImage(imageId) {
    if (imageID == null)
        return;
    SelectImage(imageId);
    $("#" + imageId).remove();
    imageID = null;

    ImageIDs.splice(ImgIndex, 1);
    translatePosArray.splice(ImgIndex, 1);
    scales.splice(ImgIndex, 1);
    angles.splice(ImgIndex, 1);
    ImageUrls.splice(ImgIndex, 1);
    saveNeeded = true;
}
function DeleteCurrent() {
    if (imageID == null)
        return;
    if (ImgIndex == -1)
        return;
    $("#heart_" + ImageIDs[ImgIndex]).removeClass("added");
    DeleteImage(ImageIDs[ImgIndex]);
    DeselectImages();

}

function SelectImage(imageId) {
    oW = 0;
    $(".selectedImg").removeClass("selectedImg");

    ImgIndex = $("#" + imageId).index();
    imageID = imageId;
    translatePos = translatePosArray[ImgIndex];
    scale = scales[ImgIndex];
    currentAngle = parseInt(angles[ImgIndex]);
    // alert(currentAngle);
    $("#" + imageId).addClass("selectedImg");
    AddSelectControls();

}
function updateArray() {
    translatePosArray[ImgIndex] = translatePos;
    scales[ImgIndex] = scale;
    angles[ImgIndex] = currentAngle;
}
function DeselectImages() {
    oW = 0;
    $(".selectedImg").removeClass("selectedImg");
    imageID = null;
    RemoveSelectControls();
}








var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
    // if (scrollEnabled == false)
    //     return;
    //to disable aymans work
    if (window.addEventListener) // older FF
        window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.onwheel = preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
    window.ontouchmove = preventDefault; // mobile
    document.onkeydown = preventDefaultForScrollKeys;
}

function enableScroll() {
    // if (scrollEnabled == false)
    //     return;
    //to disable aymans work
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
    RemoveSelectControls();
}


function ToggleCollapse(togglebutton) {
    DeselectImages();
    if ($(togglebutton).hasClass("rotatedButton")) {
        //expand
        $(togglebutton).removeClass("rotatedButton");
        $("#editDiv").animate({
            height: 500,
        }, function () {

        }
        );

        $("#shadowEffect").animate({
            opacity: 0,
        }, function () {
            $("#shadowEffect").css("display", "none");
        }
        );

    }
    else {
        //collapse

        $(togglebutton).addClass("rotatedButton");

        $("#shadowEffect").css("display", "block");
        $("#editDiv").animate({
            height: 200,
        }, function () {

        }
        );

        $("#shadowEffect").animate({
            opacity: 0.7,
        }, function () {
        }
        );

        RemoveSelectControls();
    }
}
function AddSelectControls() {
    $("#ImageControls").removeClass("hideControls");


}

function RemoveSelectControls() {
    if (!$("#ImageControls").hasClass("hideControls")) {
        $("#ImageControls").addClass("hideControls");


    }
}


// var scales = [];
// var angles = [];
// var translatePosArray = [];
// var ImageIDs = [];
// var ImageUrls = [];
var saving = false;
function SaveData() {
    if (saveNeeded && !saving) {
        //alert("saving");
        saving = true;
        saveNeeded = false;
        var moodboard = {
            Email: checkEmail(),
            Scales: scales,
            Angles: angles,
            Positions: translatePosArray,
            ImageIds: ImageIDs,
            ImageUrls: ImageUrls,
            Background: $("#cutter").css("background-color"),
            moodboardId: currentMoodBoardId
        };
        // setCookie("scales",JSON.stringify(scales));
        // setCookie("angles",JSON.stringify(angles));
        // setCookie("translatePosArray",JSON.stringify(translatePosArray));
        // setCookie("ImageIDs",JSON.stringify(ImageIDs));
        // setCookie("ImageUrls",JSON.stringify(ImageUrls));
        // setCookie("BGColor",$("#cutter").css("background-color"));
        // console.log("http://localhost/image-backend.php?moodboard="+JSON.stringify(moodboard));
        /*$.ajax({
            url:"http://localhost/image-backend.php?moodboard="+JSON.stringify(moodboard)
          }).done(function(data) {
            // alert(data);
          });*/
        //   console.log("http://dev.acme-group.net/imagedemo/image-backend.php?moodboard="+JSON.stringify(moodboard));
        //"http://dev.acme-group.net/imagedemo2/api.php?moodboard="+JSON.stringify(moodboard));
        $.ajax({
            url: serverPath + "?moodboard=" + JSON.stringify(moodboard)
        }).done(function (data) {
            // alert(data);
            saving = false;
            // console.log("saved");
            //alert("done");
            //LoadData();
        }).fail(function (edata) {
            saving = false;
            //alert("done - fail");
            //alert(edata);
            // console.log(edata);
            // console.log(scales);
            // console.log("saved");
        });

    }
    else if (!saving && !saveNeeded) {
        LoadData();
    }

}
var currentMoodBoardId = -1;
function LoadData() {


    try {
        var userInfo = {
            Name: getCookie("Name"),
            Email: checkEmail(),
            Mobile: getCookie("Mobile")
        };
        //console.log("http://localhost/imagedemo/image-backend.php?user="+JSON.stringify(userInfo)+"&moodboardId="+currentMoodBoardId);
        // console.log("http://localhost/image-backend.php?user="+JSON.stringify(userInfo));
        $.ajax({
            url: serverPath + "?user=" + JSON.stringify(userInfo) + "&moodboardId=" + currentMoodBoardId
        }).done(function (data) {
            //console.log(data);
            // console.log("loaded");
            // console.log(data.Scales);
            if (!saving && !saveNeeded) {
                $("#cutter").empty();

                try {
                    var jsoni = data;
                    scales = jsoni.Scales;//$.parseJSON(getCookie("scales"));
                    angles = jsoni.Angles;//$.parseJSON(getCookie("angles"));
                    // console.log(angles);
                    translatePosArray = jsoni.Positions;//$.parseJSON(getCookie("translatePosArray"));
                    ImageIDs = jsoni.ImageIds;//$.parseJSON(getCookie("ImageIDs"));
                    ImageUrls = jsoni.ImageUrls;//$.parseJSON(getCookie("ImageUrls"));
                    $("#cutter").css("background-color", jsoni.Background);
                    if (ImageIDs != "") {
                        $(".added").removeClass("added");
                        for (var i = 0; i < ImageIDs.length; i++) {
                            AddImageByIndex(i);
                            if ($("#" + ImageIDs[i]).length > 0) {
                                $("#heart_" + ImageIDs[i]).addClass("added");
                            }
                        }
                    }
                    else {

                        scales = [];
                        angles = [];
                        translatePosArray = [];
                        ImageIDs = [];
                        ImgIndex = -1;
                        ImageUrls = [];
                    }

                }
                catch (ee) {
                    //alert(ee);
                }
            }


        }).fail(function (err) {
            // alert( err);
        });
        /* $.ajax({
           url: "http://dev.acme-group.net/imagedemo/image-backend.php?user="+JSON.stringify(userInfo)
         }).done(function()
         {

         });*/



    }
    catch (e) {
        // alert("javascript error" + e);
    }


}
function ImageAvailable(imID) {
    for (var i = 0; i < ImageIDs.length; i++) {
        if (imageIDs[i] == imID) {
            return true;
        }
    }
    return false;
}
function AddImageByIndex(ix) {
    var containerId = "cutter";

    var newImageWidth = 223;
    $("#" + imageID).css("-webkit-transform", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).css("-ms-transform ", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    $("#" + imageID).css("transform", "rotate(" + currentAngle + "deg)  scaleX(" + flipX + ") scaleY(" + flipY + ")");
    var newHTMLImg = "<img onclick='SelectImage(\"" + ImageIDs[ix] + "\");event.stopPropagation();' class='nodrag' id='" + ImageIDs[ix] + "' src='" + ImageUrls[ix] + "' style='height:auto;width:" + (newImageWidth * scales[ix]) + "px;position:absolute;margin-left:" + translatePosArray[ix].x + "px;margin-top:" + translatePosArray[ix].y + "px;left:0;top:0;" +
        "-webkit-transform:rotate(" + angles[ix] + "deg)  scaleX(1) scaleY(1);" +
        "-ms-transform:rotate(" + angles[ix] + "deg)  scaleX(1) scaleY(1);" +
        "transform:rotate(" + angles[ix] + "deg)  scaleX(1) scaleY(1);" +
        "' />";

    $("#" + containerId).append(newHTMLImg);
    document.getElementById(ImageIDs[ix]).addEventListener("touchstart", function (evt) {
        SelectImage(ImageIDs[ix]);

    });
    imageID = null;


    $('.nodrag').on('dragstart', function (event) { event.preventDefault(); });
}
function checkEmail() {
    if (getUrlParameter("email") == "") {
        hideMoodBoards = false;
        return getCookie("Email");
    }
    else {
        currentMoodBoardId = getUrlParameter("moodboardId");
        hideMoodBoards = true;
        return getUrlParameter("email");
    }
}
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function ToggleMenu(buttonTrigger) {
    if ($(buttonTrigger).css("background-color") == "rgb(211, 211, 211)") {
        $("#ColorButton").css("display", "none");
        $("#InpirationButton").css("display", "none");
        $("#HelpButton").css("display", "none");
        $(buttonTrigger).css("background-color", "#ffbb00");
    }
    else {
        $("#ColorButton").css("display", "block");
        if (inspirations.length > 0) {
            $("#InpirationButton").css("display", "block");
        }
        $("#HelpButton").css("display", "block");
        $(buttonTrigger).css("background-color", "lightgray");
    }
}






var inspirations = [];
var inspirationIndex = 0;
function GetInspirations() {
    $('.page-loader').removeClass('loaded');
    $.ajax({
        url: "http://dev.acme-group.net/imagedemo2/noshyapi.php?inspirations=true"
    }).done(function (data) {
        // alert(data);


        inspirations = data;

        // console.log(inspirations);
        inspirationIndex = 0;
        setInsp();
        //alert("done");
        //LoadData();
    }).fail(function (edata) {
        setTimeout(function () {
            $('.page-loader').addClass('loaded');
        }, 1000);
        inspirations = [];
        inspirationIndex = 0;
    });
}
function setInsp() {
    setTimeout(function () {
        $(".inspOverlay").css("display", "block");
        $('.page-loader').addClass('loaded');
    }, 1000);
    if (inspirations.length == 0) {
        return;
    }
    // alert("http://localhost:8080/imagedemo/inspirations/"+inspirations[inspirationIndex]);
    $("#inspImg").attr("src", "http://dev.acme-group.net/imagedemo2/inspirations/" + inspirations[inspirationIndex]);
}
function nextInsp() {
    if (inspirationIndex < (inspirations.length - 1)) {
        inspirationIndex++;
        $('.page-loader').removeClass('loaded');
    }
    setInsp();
}

function prevInsp() {
    if (inspirationIndex > 0) {
        inspirationIndex--;
        $('.page-loader').removeClass('loaded');
    }
    setInsp();
}





function imageExists(image_url) {

    var http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status != 404;

}

// Control Scrolling
function ScrollControl(LockImage) {
    if (scrollEnabled) {
        disableScroll();
        scrollEnabled = false;
    }
    else {
        enableScroll();
        scrollEnabled = true;
    }

    $(LockImage).css("opacity", "1");
    setTimeout(function () {
        $(LockImage).css("opacity", "0.5");
    }, 2000);
}
