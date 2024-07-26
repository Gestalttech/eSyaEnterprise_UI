$(function () {

})
var _ClickedResendBtn = 0;
$("#btnFPSendOTP").click(function () {
    var _GetFPMobileNo = $("#txtGetFPMobileNo").val();
    if (_GetFPMobileNo == 0 || _GetFPMobileNo == null || _GetFPMobileNo == undefined) {
        fnAlert("w", "", "", "Please enter the Mobile number");
        return;
    }
    //var _rdoFPOTPtoMob = $("#rdoFPOTPtoMob").parent().hasClass('is-checked');
    //var _rdoFPOTPtoEmailID = $("#rdoFPOTPtoEmailID").parent().hasClass('is-checked');

    //if ((_rdoFPOTPtoMob == false) && (_rdoFPOTPtoEmailID == false)) {
    //    fnAlert("w", "", "", "Please Select any medium to send OTP");
    //    return;
    //}

    setTimeout(function () {
        $("#btnFPSendOTP").attr('disabled', true);
    }, 1000);
    debugger;
    $("#divForgotPWOTPSec").css('display', 'flex');
    fnStartTimer(300, "#lblForgotPWOTPtimer", "#btnForgotPWResendOTP");
    fneSyaOTP(6, "#divForgotPWOTPSec", "#txtForgotPWOTP", "#btnValidateForgotPWOTP");

});

$("#PopupForgotPassword").on('shown.bs.modal', function () {
    $("#btnFPSendOTP").attr('disabled', false);
    $("#btnForgotPWResendOTP").attr('disabled', true);
    $("#btnValidateForgotPWOTP").attr('disabled', true);
    $("#rdoFPOTPtoMob,#rdoFPOTPtoEmailID").parent().removeClass('is-checked').prop('checked', false);
})
$("#PopupForgotPassword").on('hidden.bs.modal', function () {
    $("#txtGetFPMobileNo").val('');
    $("#divForgotPWOTPSec").css('display', 'none');
    $("#rdoFPOTPtoMob,#rdoFPOTPtoEmailID").parent().removeClass('is-checked').prop('checked', false);
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