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

    var _msgtype = (_messageType == "w") ? "warning" : (_messageType == "e") ? "error" : "success";
    var _msgtypecapitalize = (_msgtype[0].toUpperCase() + _msgtype.slice(1));
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