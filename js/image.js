$(document).ready(function(){
    // Offline.options = {checks: {image: {url: 'https://www.google.com/images/srpr/logo11w.png'}, active: 'image'}};
    // Offline.check();
    // Offline.on('down',function(){
    //     $(".offline-ui-down").append("<span id='offit'>Offline</span>");
    // });
    // Offline.on('up',function(){
    //     $("#offit").remove();
    // });
    function updateIndicatoroff() {
        $(".offline-ui").removeClass("offline-ui-up");
        $(".offline-ui").addClass("offline-ui-down");
    }
    function updateIndicatoron() {
        $(".offline-ui").addClass("offline-ui-up");
        $(".offline-ui").removeClass("offline-ui-down");
    }
    // Update the online status icon based on connectivity
    // document.addEventListener('online',  updateIndicatoron);
    // document.addEventListener('offline', updateIndicatoroff);
    setInterval(function(){
        if(navigator.onLine == false)
        {
            updateIndicatoroff();
        }
        else
        {
            updateIndicatoron();
        }
    },1000);
    if(navigator.onLine == false)
    {
        $(".offline-ui").removeClass("offline-ui-up");
        $(".offline-ui").addClass("offline-ui-down");
    }
    $("#name_input").val( getCookie("Name"));
    $("#email_input").val( getCookie("Email"));
    $("#mobile_input").val( getCookie("Mobile"));
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $("#slide1").css("background-image","url(assets/images/m-mood1-min.jpg)");
        $("#slide2").css("background-image","url(assets/images/m-mood2-min.jpg)");
        $("#slide3").css("background-image","url(assets/images/m-mood3-min.jpg)");

        // alert($("#slide1").css("height"));
        // $("#slide1").css("height","544px!important");
        // $("#slide2").css("height","85vh!important");
        // $("#slide3").css("height","85vh!important");
        // alert($("#slide1").css("height"));
       }
});