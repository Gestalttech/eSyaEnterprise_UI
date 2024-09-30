
var _TimerDuration = 300;  /*In Seconds*/

var _ClickedResendBtn = 0;
$("#btnDASendOTP").click(function () {

    var _DAOTPMobileNo = $("#txtDAOTPMobileNo").val();
    if (_DAOTPMobileNo == 0 || _DAOTPMobileNo == null || _DAOTPMobileNo == undefined) {
        fnAlert("w", "", "UI0111", errorMsg.Mobileno_E13);
        document.getElementById("txtDAOTPMobileNo").focus();
        return;
    }
    else {

        fnDAGetOTPbyMobileNumber();
        
    }



});

$("#PopupDualAuthentication").on('shown.bs.modal', function () {
    document.getElementById("txtDAOTPMobileNo").focus();
    $("#btnDASendOTP").attr('disabled', false);
    $("#btnDAResendOTP").attr('disabled', true);
    $("#btnValidateDAOTP").attr('disabled', true);
    $("#btnValidateDAAnswer").attr('disabled', true);
    fnDAOpenFUserIDPopup();
})
$("#PopupDualAuthentication").on('hidden.bs.modal', function () {
    $("#txtDAOTPMobileNo").val("");
    $("#divForgotDAOTPSec").css('display', 'none');
    $("#divDASQuestions").css("display", "none");
    $("#txtDAAnswers").val('');
});

$("#btnDAResendOTP").click(function () {
    if (_ClickedResendBtn < 2) {
        setTimeout(function () {
            $("#btnDAResendOTP").attr('disabled', true);
        }, 1000);
        fnStartTimer(3, "#lblDAOTPtimer", "#btnDAResendOTP");
        _ClickedResendBtn++;
    }
    else {
        fnAlert("w", "", "UI0385", errorMsg.YouhaveTriedTwoTimes_E15);
    }
});


function fnDAOpenFUserIDPopup() {
    $.ajax({
        url: getBaseURL() + '/Account/GetLabelNameForDualAuthenticationbyBusinesskey?businesskey=' + $('#cboBusinessLocation').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.Status) {
                $("#PopupDualAuthentication").modal('show');

                $("#btnDASendOTP").html("<i class='fa-regular fa-paper-plane me-1'></i> " + response.Message);
            }
            else {
                $("#PopupDualAuthentication").modal('show');

                $("#btnDASendOTP").html("<i class='fa-regular fa-paper-plane me-1'></i> " + response.Message);
            }
        }
    });
}
function fnDAGetOTPbyMobileNumber() {


    $.ajax({
        url: getBaseURL() + '/Account/GetOTPbyMobileNumberDualAuthentication?mobileNo=' + $("#txtDAOTPMobileNo").val() + '&businesskey=' + $('#cboBusinessLocation').val(),
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
                    $("#lblDAOTPMessage").html('');
                    $("#divDASQuestions").css('display', 'block');
                    $("#lblDASQuestions").text('');
                    $("#txtDAAnswers").val('');
                    $("#lblDASQuestions").text(response.QuestionDesc);
                    $("#txtDAQuestionId").val('');
                    $("#txtDAQuestionId").val(response.SecurityQuestionId);
                    $("#btnValidateDAAnswer").css('display', 'inline-block');
                    $("#divForgotDAOTPSec").css('display', 'none');
                    $("#btnValidateDAOTP").css('display', 'inline-block');
                    $("#btnValidateDAAnswer").attr('disabled', false);
                    $("#txtDAUserId").val(response.UserId);

                } else {
                    $("#lblDAOTPMessage").html('');
                    $("#lblDAOTPMessage").html(response.LoginDesc);
                    $("#btnValidateDAOTP").css('display', 'inline-block');
                    $("#divDASQuestions").css('display', 'none');
                    $("#divForgotDAOTPSec").css('display', 'flex');
                    fnStartTimer(_TimerDuration, "#lblDAOTPtimer", "#btnDAResendOTP");
                    fneSyaOTP(6, "#divDAOTP", "#txtDAOTP", "#btnValidateDAOTP");
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnValidateDAAnswer").css('display', 'none');
                $("#btnValidateDAOTP").css('display', 'none');
            }
        },
        //async: false,
        //processData: false
    });


}

function fnDAValidateAnswer() {

    if (IsStringNullorEmpty($("#txtDAAnswers").val())) {

        fnAlert("w", "", "UI0375", errorMsg.EnterYourAnswer_E14);
        return;
    }

    $("#btnValidateDAAnswer").attr('disabled', true);
    obj = {
        SecurityQuestionId: $("#txtDAQuestionId").val(),
        SecurityAnswer: $("#txtDAAnswers").val(),
        UserId: $("#txtDAUserId").val()
    }
    $("#btnValidateDAAnswer").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Account/ValidateUserSecurityQuestion',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.IsSucceeded) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnDACloseQuestionAnswer();
                $("#PopupDualAuthentication").modal('hide');
                window.location.href = getBaseURL() + $("#txtDAReturnUrl").val();
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnValidateDAAnswer").attr('disabled', false);
                $("#divDASQuestions").css("display", "none");
                fnDAGetOTPbyMobileNumber();
                $("#divDASQuestions").css("display", "block");
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnValidateDAAnswer").attr("disabled", false);
        }
    });
}

function fnDACloseQuestionAnswer() {
    $("#txtDAUserId").val('');
    $("#txtDAQuestionId").val('');
}

function fnDAValidateOTP() {
    $.ajax({
        url: getBaseURL() + '/Account/ValidateUserbyOTP',
        type: 'GET',
        datatype: 'json',
        data: { mobileNo: $("#txtDAOTPMobileNo").val(), otp: $("#txtDAOTP").val(), expirytime: _TimerDuration / 60 },
        async: false,
        success: function (result) {

            if (result.IsSucceeded) {
                fnAlert("s", "", "UI0377", result.Message);
                $("#PopupDualAuthentication").modal('hide');

                window.location.href = getBaseURL() + $("#txtDAReturnUrl").val();

            } else {
                fnAlert("w", "", "", result.Message);
            }

        },
        error: function (error) {

            fnAlert("e", "", "", error.Message);
        }
    });
    //    return Status;
}
