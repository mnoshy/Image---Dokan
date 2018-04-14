//var backendURL = "http://dev.acme-group.net/imagedemo/image-backend.php";//Production 
var mobileBuild = true;
var backendURL = "http://dev.acme-group.net/imagedemo2/api.php";//Local 
var email = "";
var selectedCategory = 'Sofas';
var willAddMoodboard = '';
$(document).ready(function () {


  $("#first-icon").parent().css("background-color", "whitesmoke");
  email = getCookie("Email");
  if (hideMoodBoards == false) {
    load_moodboards(email);
  }
  else {
    $("#dropdown").css("display", "none");
    
  }

});

$(".category-icon").click(function (event) {
  $(".category-icon").parent().css("background-color", "");
  $(this).parent().css("background-color", "whitesmoke");
  selectedCategory = $(this).find(':first-child').attr("name");
  send_request(selectedCategory);

});


function addMoodBoard(email) {
  var name = $("#add-new-moodboard").val();
  willAddMoodboard = name;
  sendHTTPRequest("email=" + email + "&name=" + name + "&command=add", MoodBoardListResponse);
}
function deleteMoodBoard(id, email) {
  sendHTTPRequest("id=" + id + "&email=" + email + "&command=delete", MoodBoardListResponse);
}
function load_moodboards(email) {
  sendHTTPRequest("email=" + email, MoodBoardListResponse);
}
function MoodBoardListResponse(recieved) {
  var rec = '<li><a class="dropdown-element" name="new" >';
  rec += '<input id="add-new-moodboard" type="text" class="form-control" placeholder="New Moodboard" style="width: 80%;display: inline;" />';
  rec += '<span class="icon icon-plus-circle icon-moodboard" style="margin-top: 10px;"></span></a><li>';
  $(".dropdown-menu").html("");
  var temp = "";
  for (var i = 0; i < recieved.length; i++) {
    rec += "<li><a class='dropdown-element' name='" + recieved[i]['name'] + "' >" + recieved[i]['name'] + "<span id=" + recieved[i]['id'] + " class='icon icon-circle-minus icon-moodboard'></span></a></li>";
    if (currentMoodBoardId != -1) {
      if (recieved[i]['id'] == currentMoodBoardId) {
        temp = recieved[i]['name'];
      }
    }
    else {
      if (i == 0) {
        temp = recieved[i]['name'];
        currentMoodBoardId = recieved[i]['id'];
      }
    }

  }
  $(".dropdown-menu").html(rec);
  if (temp != "") {
    $("#dropdown").html(temp + ' <span class="caret"></span>');
  }
  $('.dropdown-element').on('click', function () {
    
    if($(this).find(":first-child").attr("id")!="add-new-moodboard")
    {
      $("#dropdown").html($(this).text() + ' <span class="caret"></span>');
      currentMoodBoardId = $(this).find(":first-child").attr("id");
      LoadData();
      send_request(selectedCategory);
    }
    
    //send request to load selected moodboard

  });
  $('.icon-moodboard').on('click', function () {
    if ($(this).attr("class").includes("icon-plus-circle")) {
      addMoodBoard(email);

    }
    else {
      $(this).parent().remove();
      deleteMoodBoard($(this).attr("id"), email);
    }

  });
}

function sendHTTPRequest(queryString, onresponseFunction)//respone function is passed the response json as input
{
  console.log(backendURL + "?" + queryString);
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      try {
        
        var jsonObj = JSON.parse(this.responseText);
        onresponseFunction(jsonObj);
        //StopLoading();
      }
      catch (err) {
        console.log(err);
        console.log(this.responseText);
      }

    }
  };
  xmlhttp.open("GET", backendURL + "?" + queryString, true);
  xmlhttp.send();
}


function send_request(category) {
  var arrayRes = [];

  // console.log(allData);
  for (var i = 0; i < allData.length; i++) {
    if (allData[i] == category) {
      //arrayRes.push(allData[i]);

      arrayRes.push(allData[i]);
      arrayRes.push(allData[i + 1]);
      // console.log(arrayRes);
      MoodBoardResponse(arrayRes);
      break;

    }
  }

  // sendHTTPRequest("category="+category,MoodBoardResponse);
}

function MoodBoardResponse(recieved) {

  $(".added").removeClass("added");
  $("#products-row").html("");
  for (var i = 0; i < recieved[1].length; i++) {
    var id = getTheProductId(recieved[1][i]);
    var imgurl = recieved[0] + "/" + recieved[1][i];
    /*if (imageExists("assets/furniture/"+imgurl)) */{
      $("#products-row").append(productTemplate(id, imgurl));
      
      // if ($("#ed_" + id).length > 0) {
      //   $("#heart_ed_" + id).addClass("added");
        
      // }
    }

  }
  updateButtons();
}
function productTemplate(product_id, product_img) {
  var html = "";
  html += '<div class="col-md-4 col-xs-6"><article>';
  html += '<div class="info">';
  html += '<span id="heart_ed_' + product_id + '" class="add-favorite '+
  ($('#ed_'+product_id).length > 0?"added":"")+
  '" onclick="AddImage(\'' + product_id + '\',\'cutter\')">';
  html += '<a href="javascript:void(0);" data-title="Add to favorites" data-title-added="Added to favorites list"><i class="icon icon-heart"></i></a>';
  html += '</span>';

  html += '</div>';

  html += '<div class="figure-grid"><div class="image">';
  html += '<a class="mfp-open">';
  html += '<img id="' + product_id + '" src="assets/furniture/' + product_img + '" alt="" width="360"  />';
  html += '</a>';

  html += '</div></div>';
  html += '</article></div>';
  return html;
}
function productModalTemplate(product_id, product_img) {
  var html = "";
  html += '<div class="popup-main mfp-hide" id="' + product_id + '"><div class="product">';

  html += '<div class="popup-title">';
  html += '<div class="h1 title">Laura <small>product category</small></div>';
  html += '</div>';

  html += '<div class="owl-product-gallery">';
  html += '<img src="assets/furniture/' + product_img + '" alt="" width="640" />';
  html += '</div>';

  html += '</div></div>';
  return html;
}

function getTheProductId(product_img) {
  var res = product_img.split(".png");
  var resf = res[0].replace(/ +/g, "");
  resf = resf.replace(".", "_");
  return resf;
}
function updateButtons() {
  $('.add-favorite').on('click', function () {
    $(this).toggleClass("added");
  });
}


function RequestQuote(selectedItems) {
  var name = getCookie("Name");
  var email = getCookie("Email");
  var mobile = getCookie("Mobile");
  var tempquote = { Name: name, Mobile: mobile, Email: email, SelectedItems: selectedItems ,ImageURLs:ImageUrls,SelectedCategory:selectedCategory};
  var quote = JSON.stringify(tempquote);
  sendHTTPRequest("quote=" + quote, QuoteResponse);
}

function QuoteResponse(response) {

}
function getPageURLWithoutParameters() {
  var url = window.location.href;
  return url.split('?')[0];
}
function copyToClipboard() {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val((mobileBuild == false ? getPageURLWithoutParameters() : "http://dev.acme-group.net/imagedemo2/image/products.html") + "?email=" + email + "&moodboardId=" + currentMoodBoardId).select();
  document.execCommand("copy");
  $temp.remove();
  showCopiedToClipboard();
  setTimeout(hideCopiedToClipboard, 3000);
}

function showCopiedToClipboard() {
  $("#controlsRow").css("padding-bottom", "0px");
  $("#copyToClipboardId").fadeIn();
}
function hideCopiedToClipboard() {
  $("#copyToClipboardId").fadeOut(function () {
    $("#controlsRow").css("padding-bottom", "40px");
  });

}

function StartLoading() {
  $('.page-loader').removeClass('loaded');
}
function StopLoading() {
  setTimeout(function () {
    $('.page-loader').addClass('loaded');
  }, 1500);
}
