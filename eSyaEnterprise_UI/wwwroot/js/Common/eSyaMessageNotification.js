$(function () {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-top-center",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut",
        "preventDuplicates": true,
        "preventOpenDuplicates": true,
        "progressBar": true
    };
})


function fnAlert(_messageType, _messageTitle, _messageCode, _messageContent) {
    var _msgtype = "";
    var _culture = localStorage.getItem("culture");
    var _msgtypecapitalize = "";

    if (_culture == "ar-EG") {
        (_msgtype = "w") ? _msgtypecapitalize = "تحذير" : ((_msgtype = "e") ? _msgtypecapitalize = "خطأ" : _msgtypecapitalize = "نجاح");
     }
    if (_culture == "hi-IN") {
        (_msgtype = "w") ? _msgtypecapitalize = "चेतावनी" : ((_msgtype = "e") ? _msgtypecapitalize = "गलती" : _msgtypecapitalize = "सफलता");
    }
    if (_culture == "en-US") {
        (_msgtype = "w") ? _msgtypecapitalize = "Warning" : ((_msgtype = "e") ? _msgtypecapitalize = "Error" : _msgtypecapitalize = "Success");
     }
        _msgtype = (_messageType == "w") ? "warning" : (_messageType == "e") ? "error" : "success";
  
    
    var _msgtitle = (_messageTitle == "") ? "" : " - " + _messageTitle;
    var _msgcode = (_messageCode == "") ? "" : _messageCode;

    $.toast({
        position: 'top-center',
        type: _msgtype,
        title: _msgtypecapitalize + "" + _msgtitle,
        subtitle: _msgcode,
        content: _messageContent,
        delay: 5000
    });
}