
var _FPTimerDuration = 300;  /*In Seconds*/
$(function () {
   
})
var _ClickedResendBtn = 0;
$("#btnFPSendOTP").click(function () {

    var _FPMobileNo = $("#txtGetFPMobileNo").val();
    if (_FPMobileNo == 0 || _FPMobileNo == null || _FPMobileNo == undefined) {
        fnAlert("w", "", "UI0111", errorMsg.Mobileno_E13);
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
  
});


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
        fnAlert("w", "", "UI0376", errorMsg.YouhaveTriedTwoTimes_E15);
    }
});


function fnOpenFPWDPopup() {
 
    if (IsStringNullorEmpty($("#txtUserID").val())) {

        fnAlert("w", "", "", "Please Enter User ID");
        return;
    }
    fnValidateUserID();
}
function GetForgotPasswordLabels() {
    $.ajax({
        url: getBaseURL() + '/Account/GetLabelNameForgotPasswordbyRule',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.Status) {
                $("#btnFPSendOTP").html("<i class='fa-regular fa-paper-plane me-1'></i> " + response.Message);
                $("#PopupForgotPassword").modal('show');
            }
            else {
                $("#btnFPSendOTP").html("<i class='fa-regular fa-paper-plane me-1'></i> " + response.Message);
                $("#PopupGetUserID").modal('show');
            }
        }
    });
}

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
                    $("#lblFOROTPMessage").html('');
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
                    $("#lblFOROTPMessage").html('');
                    $("#lblFOROTPMessage").html(response.LoginDesc);
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

        fnAlert("w", "", "UI0384", errorMsg.EnterYourAnswer_E14);
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
           
            //if (response.IsSucceeded) {
            //    fnAlert("s", "", response.StatusCode, response.Message + localization.YourPassword + response.Password);
            //    fnFPCloseQuestionAnswer();
            //    $("#PopupForgotPassword").modal('hide');


            //}
            //else {
            //    fnAlert("w", "", response.StatusCode, response.Message);
            //    $("#btnValidateForgotPWAnswer").attr('disabled', false);
            //    $("#divFPSQuestions").css("display", "none");
            //    fnFPGetOTPbyMobileNumber();
            //    $("#divFPSQuestions").css("display", "block");
            //}
            if (response.IsSucceeded) {
                fnFPCloseQuestionAnswer();
                $("#lblFPOTPLogInID").text('');
                $("#txtFPOTPloginUserId").val('');
                $("#PopupForgotPassword").modal('hide');
                fnAlert("s", "", "", response.Message);
                $("#lblFPOTPLogInID").text("Welcome " + response.LoginDesc);
                $("#txtFPOTPloginUserId").val(response.UserID);

                setTimeout(function () {
                    $("#PopupForgotPasswordAfterOTP").modal('show');
                }, 2000);
            }
            else
            {
                $("#btnValidateForgotPWAnswer").attr('disabled', false);
                $("#divFPSQuestions").css("display", "none");
                fnFPGetOTPbyMobileNumber();
                $("#divFPSQuestions").css("display", "block");
                $("#lblFPOTPLogInID").text("");
                $("#txtFPOTPloginUserId").val(response.UserID);
                fnAlert("w", "", "", response.Message);
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
                
                $("#lblFPOTPLogInID").text('');
                $("#txtFPOTPloginUserId").val('');
                $("#PopupForgotPassword").modal('hide');
                fnAlert("s", "", "", result.Message);
                $("#lblFPOTPLogInID").text("Welcome " + result.LoginDesc);
                $("#txtFPOTPloginUserId").val(result.UserID);

                setTimeout(function () {
                    $("#PopupForgotPasswordAfterOTP").modal('show');
                }, 2000);


            }

            else
            {
                $("#lblFPOTPLogInID").text("");
                $("#txtFPOTPloginUserId").val(result.UserID);
                fnAlert("w", "", "", result.Message);
            }

        },
        error: function (error) {

            fnAlert("e", "", "", error.Message);
        }
    });
}

function fnValidateUserID() {
    var logInId = $("#txtUserID").val();
   
    $.ajax({
        url: getBaseURL() + '/Account/CheckValidateUserID?loginId=' + logInId,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {

            if (response != null) {
                //refresh each time
                if (response.IsSucceeded) {
                    GetForgotPasswordLabels();

                } else {
                    fnAlert("e", "", "", response.Message);
                }

            }
            else {
                fnAlert("e", "", "", response.Message);
               
            }
        },
        async: false,
        processData: false
    });


}

$("#PopupForgotPasswordAfterOTP").on('shown.bs.modal', function () {
    $("#txtFPOTPpassword").val("");
    $("#txtFPOTPConfirmPassword").val("");
    fnCreateFPOTPPasswordPolicy();
});

function fnCreateFPOTPPasswordPolicy() {
    var _createPWerrmsg = "";
    var _createPWlist = "";

    $.ajax({
        url: getBaseURL() + '/Account/GetPasswordPolicybyRule',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            $(".bgUserTips").removeClass('animate__animated animate__flash animate__repeat-1');
            $("#divFPOTPCPErrorMsg").css('display', 'none');
            if (response.Status) {

                if (response.StatusCode == "1" || response.StatusCode == 1) {
                    $("#txtFPOTPpassword").val("");
                    $("#txtFPOTPConfirmPassword").val("");
                    _createPWerrmsg = response.Message.split("\\");
                    _createPWlist = "";
                    $("#lblFPOTPCPErrorList").remove();
                    $("#lblFPOTPCPErrorMessageHeader").html(_createPWerrmsg[0]);
                    _createPWlist += "<ol id='lblFPOTPCPErrorList'>"
                    for (i = 1; i < _createPWerrmsg.length; i++) {
                        _createPWlist += "<li class='animate__animated animate__fadeInDown'>" + _createPWerrmsg[i] + "</li>";
                    }
                    _createPWlist += "</ol>"
                    $("#divFPOTPCPlblErrorList").append(_createPWlist);

                    $(".bgUserTips").removeClass('red');
                    $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
                    $("#divFPOTPCPErrorMsg").css('display', 'block');
                }
                else {
                    $("#txtFPOTPpassword").val("");
                    $("#txtFPOTPConfirmPassword").val("");

                    $("#divFPOTPCPErrorMsg").css('display', 'none');
                }
            }
        }
    });
}

function fnSaveFPOTPChangePassword() {


    if ($("#txtFPOTPpassword").val().trim().length <= 0) {
        fnAlert("w", "", "UI0278", "Please Enter Password");
        return;
    }
    
    if ($("#txtFPOTPConfirmPassword").val().trim().length <= 0) {
        fnAlert("w", "", "UI0280", "Please Enter Confirm Password");
        return;
    }

    if ($("#txtFPOTPpassword").val() !== $("#txtFPOTPConfirmPassword").val()) {
        fnAlert("w", "", "UI0281", "Password and Confirm Password should be same");
        return;
    }

    $("#btnSaveFPOTPChangePassword").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Account/ChangePasswordfromForgotPassword?userId=' + $("#txtFPOTPloginUserId").val() + '&password=' + $("#txtFPOTPpassword").val() + '&confirmPassword=' + $("#txtFPOTPConfirmPassword").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (response) {

            if (response.Status) {
                $("#txtFPOTPloginUserId").val('');
                $("#txtFPOTPloginUserId").val(response.ID);

                $("#PopupForgotPasswordAfterOTP").modal('hide');
                fnAlert("s", "", "", response.Message);
                window.location.href = getBaseURL() + '/Account/Index';
            }
            else {
                $("#txtFPOTPpassword").val("");
                $("#txtFPOTPConfirmPassword").val("");
                _createPWerrmsg = response.Message.split("\\");
                _createPWlist = "";
                $("#lblFPOTPCPErrorList").remove();
                $("#lblFPOTPCPErrorMessageHeader").html(_createPWerrmsg[0]);
                _createPWlist += "<ol id='lblFPOTPCPErrorList'>"
                for (i = 1; i < _createPWerrmsg.length; i++) {
                    _createPWlist += "<li class='animate__animated animate__fadeInDown'>" + _createPWerrmsg[i] + "</li>";
                }
                _createPWlist += "</ol>"
                $("#divFPOTPCPlblErrorList").append(_createPWlist);

                $(".bgUserTips").removeClass('red');
                $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
                $("#divFPOTPCPErrorMsg").css('display', 'block');
            }
            $("#btnSaveFPOTPChangePassword").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", "", error.statusText);
            $("#btnSaveFPOTPChangePassword").attr("disabled", false);
        }
    });
}

