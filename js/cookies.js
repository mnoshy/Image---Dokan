function setCookie(cname, cvalue, exdays) {
  window.localStorage.setItem(cname,cvalue);
  // var d = new Date();
  // d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  // var expires = "expires=" + d.toUTCString();
  // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  return window.localStorage.getItem(cname);
  // var name = cname + "=";
  // var ca = document.cookie.split(';');
  // for (var i = 0; i < ca.length; i++) {
  //   var c = ca[i];
  //   while (c.charAt(0) == ' ') {
  //     c = c.substring(1);
  //   }
  //   if (c.indexOf(name) == 0) {
  //     return c.substring(name.length, c.length);
  //   }
  // }
  return "";
}

function Register() {
  if (!(getCookie("Email") == $("#email_input").val())) {
    setCookie("allData","");
    setCookie("saveNeeded","false");
    setCookie("LoadedData","");
    setCookie("currentMoodBoardId","-1");
    setCookie("scales", "");
    setCookie("angles", "");
    setCookie("translatePosArray", "");
    setCookie("ImageIDs", "");
    setCookie("ImageUrls", "");
  }
  var em = $("#email_input").val();
  if (ValidateEmail(em)) {
    $("#WrongEmail").css("display", "none");
    setCookie('Name', document.getElementById('name_input').value, 365);
    setCookie('Mobile', document.getElementById('mobile_input').value, 365);
    setCookie('Email', document.getElementById('email_input').value, 365);
    window.location = 'products.html';
  }
  else {
    $("#WrongEmail").css("display", "block");
  }

}

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true);
  }
  return (false);
}