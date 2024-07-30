
var _TimerDuration = 300;  /*In Seconds*/
$(function () {
    $("#rdoSendOTPMob,#rdoSendOTPEmailID").parent().removeClass('is-checked').prop('checked', false);
})
var _ClickedResendBtn = 0;
$("#btnGetUserIDSendOTP").click(function () {
   
    var _ForgotUIDOTPMobileNo = $("#txtForgotUIDOTPMobileNo").val();
    if (_ForgotUIDOTPMobileNo == 0 || _ForgotUIDOTPMobileNo == null || _ForgotUIDOTPMobileNo == undefined) {
        fnAlert("w", "", "", "Please enter the Mobile number");
        document.getElementById("txtForgotUIDOTPMobileNo").focus();
        return;
    }
    else {
   
        fnGetOTPbyMobileNumber();
        //setTimeout(function () {
        //    $("#btnGetUserIDSendOTP").attr('disabled', true);
        //}, 1000);
        //$("#divForgotUIDOTPSec").css('display', 'flex');
        //fnStartTimer(300, "#lblForgotUIDOTPtimer", "#btnForgotUIDResendOTP");
        //fneSyaOTP(6, "#divForgotUIDOTP", "#txtForgotUIDOTP", "#btnValidateForgotUIDOTP");
    }
   
    
   
});

$("#PopupGetUserID").on('shown.bs.modal', function () {
    document.getElementById("txtForgotUIDOTPMobileNo").focus();
    $("#btnGetUserIDSendOTP").attr('disabled', false);
    $("#btnForgotUIDResendOTP").attr('disabled', true);
    $("#btnValidateForgotUIDOTP").attr('disabled', true);
    $("#btnValidateForgotUIDAnswer").attr('disabled', true);
   
})
$("#PopupGetUserID").on('hidden.bs.modal', function () {
    $("#txtForgotUIDOTPMobileNo").val("");
    $("#divForgotUIDOTPSec").css('display', 'none');
    $("#divFUIDSQuestions").css("display", "none");
    $("#txtFUIDAnswers").val('');
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


function fnOpenFUserIDPopup() {
    $.ajax({
        url: getBaseURL() + '/Account/GetLabelNameForgotUserIDbyRule',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.Status) {
                $("#PopupGetUserID").modal('show');

                $("#btnGetUserIDSendOTP").html("<i class='fa-regular fa-paper-plane me-1'></i> " + response.Message);
            }
            else {
                $("#PopupGetUserID").modal('show');

                $("#btnGetUserIDSendOTP").html("<i class='fa-regular fa-paper-plane me-1'></i> " + response.Message);
            }
        }
    });
}
function fnGetOTPbyMobileNumber() {
    
   
    $.ajax({
        url: getBaseURL() + '/Account/GetOTPbyMobileNumber?mobileNo=' + $("#txtForgotUIDOTPMobileNo").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.IsSucceeded) {
              
                //fnAlert("s", "", response.StatusCode, response.Message);
                if (response.SecurityQuestionId != 0)
                    {
                    $("#divFUIDSQuestions").css('display', 'block');
                    $("#lblFUIDSQuestions").text('');
                    $("#txtFUIDAnswers").val('');
                    $("#lblFUIDSQuestions").text(response.QuestionDesc);
                    $("#txtQuestionId").val('');
                    $("#txtQuestionId").val(response.SecurityQuestionId);
                    $("#btnValidateForgotUIDAnswer").css('display', 'inline-block');
                    $("#divForgotUIDOTPSec").css('display', 'none');
                    $("#btnValidateForgotUIDOTP").css('display', 'inline-block');
                    $("#btnValidateForgotUIDAnswer").attr('disabled', false);
                    $("#txtforgotUserId").val(response.UserId); 

                } else {
                    $("#btnValidateForgotUIDOTP").css('display', 'inline-block');
                    $("#divFUIDSQuestions").css('display', 'none');
                    $("#divForgotUIDOTPSec").css('display', 'flex');
                    fnStartTimer(_TimerDuration, "#lblForgotUIDOTPtimer", "#btnForgotUIDResendOTP");
                    fneSyaOTP(6, "#divForgotUIDOTP", "#txtForgotUIDOTP", "#btnValidateForgotUIDOTP");
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnValidateForgotUIDAnswer").css('display', 'none');
                $("#btnValidateForgotUIDOTP").css('display', 'none');
            }
        },
        //async: false,
        //processData: false
    });


}

function fnValidateAnswer() {
    
    if (IsStringNullorEmpty($("#txtFUIDAnswers").val())) {

        fnAlert("w", "", "", "Please Enter Your Answer");
        return;
    }

    $("#btnValidateForgotUIDAnswer").attr('disabled', true);
    obj = {
        SecurityQuestionId: $("#txtQuestionId").val(),
        SecurityAnswer: $("#txtFUIDAnswers").val(),
        UserId: $("#txtforgotUserId").val()
    }
    $("#btnValidateForgotUIDAnswer").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Account/ValidateUserSecurityQuestion',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.IsSucceeded) {
                fnAlert("s", "", response.StatusCode, response.Message + " Your User ID :" + response.LoginID);
                fnCloseQuestionAnswer();
                $("#PopupGetUserID").modal('hide');
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnValidateForgotUIDAnswer").attr('disabled', false);
                $("#divFUIDSQuestions").css("display", "none");
                fnGetOTPbyMobileNumber();
                $("#divFUIDSQuestions").css("display", "block");
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnValidateForgotUIDAnswer").attr("disabled", false);
        }
    });
}

function fnCloseQuestionAnswer() {
    $("#txtforgotUserId").val('');
    $("#txtQuestionId").val(''); 
}

function fnForgotUIDValidateOTP() {
    $.ajax({
        url: getBaseURL() + '/Account/ValidateUserbyOTP',
        type: 'GET',
        datatype: 'json',
        data: { mobileNo: $("#txtForgotUIDOTPMobileNo").val(), otp: $("#txtForgotUIDOTP").val(), expirytime: _TimerDuration/60 },
        async: false,
        success: function (result) {
            if (result.IsSucceeded) {
                fnAlert("s", "", "", result.Message + " Your User ID has been sent to SMS/Email");
                $("#PopupGetUserID").modal('hide');

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
