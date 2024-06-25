$(function () {
    $("#rdoSendOTPMob,#rdoSendOTPEmailID").parent().removeClass('is-checked').prop('checked', false);
})
var _ClickedResendBtn = 0;
$("#btnGetUserIDSendOTP").click(function () {
    debugger;
    var _ForgotUIDOTPMobileNo = $("#txtForgotUIDOTPMobileNo").val();
    if (_ForgotUIDOTPMobileNo == 0 || _ForgotUIDOTPMobileNo == null || _ForgotUIDOTPMobileNo == undefined) {
        fnAlert("w", "", "", "Please enter the Mobile number");
        document.getElementById("txtForgotUIDOTPMobileNo").focus();
        return;
    }
    var _rdoSendOTPMob = $("#rdoSendOTPMob").parent().hasClass('is-checked');
    var _rdoSendOTPEmailID = $("#rdoSendOTPEmailID").parent().hasClass('is-checked');

    if ((_rdoSendOTPMob == false) && (_rdoSendOTPEmailID == false)) {
        fnAlert("w", "", "", "Please Select any medium to send OTP");
        return;
    }
    
    setTimeout(function () {
        $("#btnGetUserIDSendOTP").attr('disabled', true);
    }, 1000); 
    $("#divForgotUIDOTPSec").css('display', 'flex');
    fnStartTimer(300, "#lblForgotUIDOTPtimer", "#btnForgotUIDResendOTP");
    fneSyaOTP(6, "#divForgotUIDOTP", "#txtForgotUIDOTP", "#btnValidateForgotUIDOTP");
   
});

$("#PopupGetUserID").on('shown.bs.modal', function () {
    document.getElementById("txtForgotUIDOTPMobileNo").focus();
    $("#btnGetUserIDSendOTP").attr('disabled', false);
    $("#btnForgotUIDResendOTP").attr('disabled', true);
    $("#btnValidateForgotUIDOTP").attr('disabled', true);
    $("#rdoSendOTPMob,#rdoSendOTPEmailID").parent().removeClass('is-checked').prop('checked', false);
})
$("#PopupGetUserID").on('hidden.bs.modal', function () {
    $("#txtForgotUIDOTPMobileNo").val("");
    $("#divForgotUIDOTPSec").css('display', 'none');
    $("#rdoSendOTPMob,#rdoSendOTPEmailID").parent().removeClass('is-checked').prop('checked', false);
   
});

$("#btnForgotUIDResendOTP").click(function () {
    if (_ClickedResendBtn < 2) {
        setTimeout(function () {
            $("#btnForgotUIDResendOTP").attr('disabled', true);
        }, 1000);
        fnStartTimer(3, "#lblForgotUIDOTPtimer", "#btnForgotUIDResendOTP");
        _ClickedResendBtn++;
    }
    else {
        fnAlert("w", "", "", "You have tried 2 times");
    }
});