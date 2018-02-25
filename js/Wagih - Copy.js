//var backendURL = "http://dev.acme-group.net/imagedemo/image-backend.php";//Production 
var backendURL = "http://localhost/imagedemo/image-backend.php";//Local 
$(document).ready(function () {

  send_request('Sofas');
  $("#first-icon").parent().css("background-color", "whitesmoke");

  load_moodboards("wagih.elgezery@gmail.com");

 sendHTTPRequest("email=wagih.elgezery@gmail.com",alertN);

});

$(".category-icon").click(function (event) {

  $(".category-icon").parent().css("background-color", "");
  $(this).parent().css("background-color", "whitesmoke");
  send_request($(this).find(':first-child').attr("name"));

  



});




function addMoodBoard(email)
{
  var recieved;
  var xmlhttp = new XMLHttpRequest();

  var rec = '<li><a class="dropdown-element" name="new" >';
  rec+='<input id="add-new-moodboard" type="text" class="form-control" placeholder="New Moodboard" style="width: 80%;display: inline;" />';
  rec+='<span class="icon icon-plus-circle icon-moodboard" style="margin-top: 10px;"></span></a><li>';
  name = $("#add-new-moodboard").val();
  $(".dropdown-menu").html("");

  xmlhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) 
   {

    recieved = JSON.parse(this.responseText);

    for (var i = 0; i < recieved.length; i++) 
    {

      rec += "<li><a class='dropdown-element' name='"+recieved[i]['name']+"' >"+recieved[i]['name']+"<span id="+recieved[i]['id']+" class='icon icon-circle-minus icon-moodboard'></span></a></li>";
    }

    $(".dropdown-menu").html(rec);

    $('.dropdown-element').on('click', function () 
    {
      $("#dropdown").html($(this).text()+' <span class="caret"></span>');
        //$(this).attr("name")
        //send request to load selected moodboard
      });
    $('.icon-moodboard').on('click', function () 
    {
      if( $(this).attr("class").includes("icon-plus-circle"))
      {
       addMoodBoard(email);
     }
     else
     {
          //$(this).parent().remove();
          deleteMoodBoard($(this).attr("id"),email);
        }
        //alert($(this).attr("id"));
        //$(this).attr("name")

      });

  }};
  xmlhttp.open("GET", backendURL+"?email="+email+"&name="+name+"&command=add", true);
  xmlhttp.send();

}
function deleteMoodBoard(id,email)
{
  var recieved;
  var xmlhttp = new XMLHttpRequest();
  $(".dropdown-menu").html("");
  var rec = '<li><a class="dropdown-element" name="new" >';
  rec+='<input id="add-new-moodboard" type="text" class="form-control" placeholder="New Moodboard" style="width: 80%;display: inline;" />';
  rec+='<span class="icon icon-plus-circle icon-moodboard" style="margin-top: 10px;"></span></a><li>';
  xmlhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) 
   {

    recieved = JSON.parse(this.responseText);

    for (var i = 0; i < recieved.length; i++) 
    {

      rec += "<li><a class='dropdown-element' name='"+recieved[i]['name']+"' >"+recieved[i]['name']+"<span id="+recieved[i]['id']+" class='icon icon-circle-minus icon-moodboard'></span></a></li>";
    }

    $(".dropdown-menu").html(rec);

    $('.dropdown-element').on('click', function () 
    {
      $("#dropdown").html($(this).text()+' <span class="caret"></span>');
        //$(this).attr("name")
        //send request to load selected moodboard
      });
    $('.icon-moodboard').on('click', function () 
    {
      if( $(this).attr("class").includes("icon-plus-circle"))
      {
       addMoodBoard(email);
     }
     else
     {
          //$(this).parent().remove();
          deleteMoodBoard($(this).attr("id"),email);
        }
        //alert($(this).attr("id"));
        //$(this).attr("name")

      });

  }};
  xmlhttp.open("GET", backendURL+"?id="+id+"&email="+email+"&command=delete", true);
  xmlhttp.send();
}
function load_moodboards(email)
{
  var recieved;
  var xmlhttp = new XMLHttpRequest();
  $(".dropdown-menu").html("");
  var rec = '<li><a class="dropdown-element" name="new" >';
  rec+='<input id="add-new-moodboard" type="text" class="form-control" placeholder="New Moodboard" style="width: 80%;display: inline;" />';
  rec+='<span class="icon icon-plus-circle icon-moodboard" style="margin-top: 10px;"></span></a><li>';

  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      recieved = JSON.parse(this.responseText);

      for (var i = 0; i < recieved.length; i++) 
      {

        rec += "<li><a class='dropdown-element' name='"+recieved[i]['name']+"' >"+recieved[i]['name']+"<span id="+recieved[i]['id']+" class='icon icon-circle-minus icon-moodboard'></span></a></li>";
      }

      $(".dropdown-menu").html(rec);

      $('.dropdown-element').on('click', function () 
      {
        $("#dropdown").html($(this).text()+' <span class="caret"></span>');
        //$(this).attr("name")
        //send request to load selected moodboard
      });
      $('.icon-moodboard').on('click', function () 
      {
        if( $(this).attr("class").includes("icon-plus-circle"))
        {
         addMoodBoard(email);
       }
       else
       {
          //$(this).parent().remove();
          deleteMoodBoard($(this).attr("id"),email);
        }
        //alert($(this).attr("id"));
        //$(this).attr("name")

      });
    }
  };
  xmlhttp.open("GET", backendURL+"?email=" + email, true);
  xmlhttp.send();
}


function extract(variable)
{
    for(var key in variable)
    {
      window[key] = variable[key];
    }
}

function sendHTTPRequest(queryString,onresponseFunction)//respone function is passed the response json as input
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () { 
      if (this.readyState == 4 && this.status == 200) { 
        onresponseFunction(JSON.parse(this.responseText));
      } 
    };
    xmlhttp.open("GET", backendURL+"?" + queryString, true);
    xmlhttp.send();
}


function send_request(category) {
  var xmlhttp = new XMLHttpRequest();
  var myObj;
  xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      myObj = JSON.parse(this.responseText);
      $("#products-row").html("");
      for (var i = 0; i < myObj[1].length; i++) {
        var id = getTheProductId(myObj[1][i]);
        var imgurl = myObj[0] + "/" + myObj[1][i];
        $("#products-row").append(productTemplate(id, imgurl));
        if($("#ed_"+id).length > 0)
        {
          $("#heart_ed_"+id).addClass("added");
        }
                //$("#products-row").after(productModalTemplate(id,imgurl));
              }
              updateButtons();
            }
          };
          xmlhttp.open("GET", backendURL+"?category=" + category, true);
          xmlhttp.send();
          return myObj;
        }

        function productTemplate(product_id, product_img) 
        {
          var html = "";
          html += '<div class="col-md-4 col-xs-6"><article>';
          html += '<div class="info">';

          html += '<span id="heart_ed_'+product_id+'" class="add-favorite" onclick="AddImage(\'' + product_id + '\',\'cutter\')">';
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
        function productModalTemplate(product_id, product_img) 
        {
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

        function getTheProductId(product_img) 
        {
          var res = product_img.split(".png");
          var resf = res[0].replace(/ +/g, "");
          resf = resf.replace(".", "_");
          return resf;
        }
        function updateButtons() 
        {
          $('.add-favorite').on('click', function () {
            $(this).toggleClass("added");
          });
        }
        function setCookie(cname, cvalue, exdays) 
        {
         var d = new Date();
         d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
         var expires = "expires="+d.toUTCString();
         document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
       }
       function getCookie(cname) 
       {
         var name = cname + "=";
         var ca = document.cookie.split(';');
         for(var i = 0; i < ca.length; i++) {
           var c = ca[i];
           while (c.charAt(0) == ' ') {
             c = c.substring(1);
           }
           if (c.indexOf(name) == 0) {
             return c.substring(name.length, c.length);
           }
         }
         return "";
       }

// var selectedItems = ['21-01-1616.jpg','21-01-1616.jpg'];
// RequestQuote(selectedItems);

function RequestQuote(selectedItems)
{


 var xmlhttp = new XMLHttpRequest();
 var myObj;
 var name = getCookie("Name");
 var email = getCookie("Email");
 var mobile = getCookie("Mobile");
 var tempquote = {Name:name,Mobile:mobile,Email:email,SelectedItems:selectedItems};
 var quote = JSON.stringify(tempquote);

 xmlhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) 
   {
           //alert(this.responseText);
           //myObj = JSON.parse(this.responseText);
         }
       };
       xmlhttp.open("GET", backendURL+"?quote="+quote, true);
       xmlhttp.send();
       return myObj;
     }

     function Register()
     {
      if(!(getCookie("Email") == $("#email_input").val()))
      {
        setCookie("scales","");
        setCookie("angles","");
        setCookie("translatePosArray","");
        setCookie("ImageIDs","");
        setCookie("ImageUrls","");
      }
      var em = $("#email_input").val();
      if(ValidateEmail(em))
      {
        $("#WrongEmail").css("display","none");
        setCookie('Name', document.getElementById('name_input').value, 365);
        setCookie('Mobile', document.getElementById('mobile_input').value, 365);
        setCookie('Email', document.getElementById('email_input').value, 365); 
        window.location = 'products.html';
      }
      else
      {
        $("#WrongEmail").css("display","block");
      }

    }

    function ValidateEmail(mail)   
    {  
     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))  
     {  
      return (true);
    }  
    return (false);
  }

