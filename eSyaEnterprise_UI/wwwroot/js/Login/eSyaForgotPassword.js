
var _FPTimerDuration = 300;  /*In Seconds*/
$(function () {
   
})
var _ClickedResendBtn = 0;
$("#btnFPSendOTP").click(function () {

    var _FPMobileNo = $("#txtGetFPMobileNo").val();
    if (_FPMobileNo == 0 || _FPMobileNo == null || _FPMobileNo == undefined) {
        fnAlert("w", "", "", "Please enter the Mobile number");
        document.getElementById("txtGetFPMobileNo").focus();
        return;
    }
    else {

        fnFPGetOTPbyMobileNumber();
        //setTimeout(function () {
        //    $("#btnFPSendOTP").attr('disabled', true);
        //}, 1000);
        //$("#divForgotPWOTPSec").css('display', 'flex');
        //fnStartTimer(300, "#lblForgotUIDOTPtimer", "#btnForgotPWResendOTP");
        //fneSyaOTP(6, "#divForgotUIDOTP", "#txtForgotPWOTP", "#btnValidateForgotPWOTP");
    }



});

$("#PopupForgotPassword").on('shown.bs.modal', function () {
    document.getElementById("txtGetFPMobileNo").focus();
    $("#btnFPSendOTP").attr('disabled', false);
    $("#btnForgotPWResendOTP").attr('disabled', true);
    $("#btnValidateForgotPWOTP").attr('disabled', true);
    $("#btnValidateForgotPWAnswer").attr('disabled', true);

})
$("#PopupForgotPassword").on('hidden.bs.modal', function () {
    $("#txtGetFPMobileNo").val("");
    $("#divForgotPWOTPSec").css('display', 'none');
    $("#divFPSQuestions").css("display", "none");
    $("#txtFPSAnswers").val('');
});

$("#btnForgotPWResendOTP").click(function () {
    if (_ClickedResendBtn < 2) {
        setTimeout(function () {
            $("#btnForgotPWResendOTP").attr('disabled', true);
        }, 1000);
        fnStartTimer(3, "#lblForgotUIDOTPtimer", "#btnForgotPWResendOTP");
        _ClickedResendBtn++;
    }
    else {
        fnAlert("w", "", "", "You have tried 2 times");
    }
});

function fnFPGetOTPbyMobileNumber() {



    $.ajax({
        url: getBaseURL() + '/Account/GetForgotPasswordOTPbyMobileNumber?mobileNo=' + $("#txtGetFPMobileNo").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.IsSucceeded) {

                //fnAlert("s", "", response.StatusCode, response.Message);
                if (response.SecurityQuestionId != 0) {
                    $("#divFPSQuestions").css('display', 'block');
                    $("#lblFPSQuestions").text('');
                    $("#txtFPSAnswers").val('');
                    $("#lblFPSQuestions").text(response.QuestionDesc);
                    $("#txtFPWQuestionId").val('');
                    $("#txtFPWQuestionId").val(response.SecurityQuestionId);
                    $("#btnValidateForgotPWAnswer").css('display', 'inline-block');
                    $("#divForgotPWOTPSec").css('display', 'none');
                    $("#btnValidateForgotPWOTP").css('display', 'inline-block');
                    $("#btnValidateForgotPWAnswer").attr('disabled', false);
                    $("#txtforgotPWUserID").val(response.UserId);

                } else {
                    debugger;
                    $("#btnValidateForgotPWOTP").css('display', 'inline-block');
                    $("#divFPSQuestions").css('display', 'none');
                    $("#divForgotPWOTPSec").css('display', 'flex');
                    fnStartTimer(_FPTimerDuration, "#lblForgotPWOTPtimer", "#btnForgotPWResendOTP");
                    fneSyaOTP(6, "#divForgotPWOTP", "#txtForgotPWOTP", "#btnValidateForgotPWOTP");
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnValidateForgotPWAnswer").css('display', 'none');
                $("#btnValidateForgotPWOTP").css('display', 'none');
            }
        },
        //async: false,
        //processData: false
    });


}

function fnFPValidateAnswer() {

    if (IsStringNullorEmpty($("#txtFPSAnswers").val())) {

        fnAlert("w", "", "", "Please Enter Your Answer");
        return;
    }

    $("#btnValidateForgotPWAnswer").attr('disabled', true);
    obj = {
        SecurityQuestionId: $("#txtFPWQuestionId").val(),
        SecurityAnswer: $("#txtFPSAnswers").val(),
        UserId: $("#txtforgotPWUserID").val()
    }
    $("#btnValidateForgotPWAnswer").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Account/ValidateForgotPasswordSecurityQuestion',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.IsSucceeded) {
                fnAlert("s", "", response.StatusCode, response.Message + " Your Password :" + response.Password);
                fnFPCloseQuestionAnswer();
                $("#PopupForgotPassword").modal('hide');
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnValidateForgotPWAnswer").attr('disabled', false);
                $("#divFPSQuestions").css("display", "none");
                fnFPGetOTPbyMobileNumber();
                $("#divFPSQuestions").css("display", "block");
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnValidateForgotPWAnswer").attr("disabled", false);
        }
    });
}

function fnFPCloseQuestionAnswer() {
    $("#txtforgotPWUserID").val('');
    $("#txtFPWQuestionId").val('');
}

function fnForgotPWValidateOTP() {
    $.ajax({
        url: getBaseURL() + '/Account/ValidateForgotPasswordOTP',
        type: 'GET',
        datatype: 'json',
        data: { mobileNo: $("#txtGetFPMobileNo").val(), otp: $("#txtForgotPWOTP").val(), expirytime: _FPTimerDuration / 60 },
        async: false,
        success: function (result) {
            if (result.IsSucceeded) {
                fnAlert("s", "", "", result.Message + " Your Password has been sent to SMS/Email");
                $("#PopupForgotPassword").modal('hide');

            } else {
                fnAlert("w", "", "", result.Message);
            }

        },
        error: function (error) {

            fnAlert("e", "", "", error.Message);
        }
    });
    return Status;
}
