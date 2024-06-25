//Create password popup open functionality

$("#txtUserID").on('focusout', function () {
    fncheckPasswordWithLoginID()
});
$("#txtLoginPassword").on('focusin', function () {
    fncheckPasswordWithLoginID()
});

function fncheckPasswordWithLoginID() {

    var logInId = $("#txtUserID").val();

    // $("#lblLogInID").text(logInId);
    if (logInId == null || logInId == "") {
        return;
    }
    if (logInId !== null || logInId !== "") {
        logInId = logInId.trim();
    }
    $.ajax({
        url: getBaseURL() + '/Account/ChkIsCreatePasswordInNextSignIn?loginId=' + logInId,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.StatusCode === "1") {
                // $("#lblLogInID").text("Welcome "+response.Key);
                $("#txtloginUserId").val(response.ID);
                $("#PopupOTP").modal('show');

            }
            else {
                // $("#lblLogInID").text("");
                // $("#txtloginUserId").val("");
                $("#PopupOTP").modal('hide');

            }
        },
        //async: false,
        //processData: false
    });


}
function fnValidateUserOTP() {


    var otpval = $("[name='opt-value']").val();

    if ($("#txtloginUserId").val() == null || $("#txtloginUserId").val() == "") {
        return;
    }
    if (otpval == null || otpval == "") {
        return;
    }

    $.ajax({
        url: getBaseURL() + '/Account/ValidateCreateUserOTP?userId=' + $("#txtloginUserId").val() + '&otp=' + otpval,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {

            if (response.IsSucceeded == true) {
                $("#lblLogInID").text('');
                $("#txtloginUserId").val('');
                $("#PopupOTP").modal('hide');
                fnAlert("s", "", "", response.Message);
                $("#lblLogInID").text("Welcome " + response.LoginDesc);
                $("#txtloginUserId").val(response.UserID);

                setTimeout(function () {
                    $("#PopupChangePassword").modal('show');
                }, 2000);
            }
            else {
                $("#lblLogInID").text("");
                $("#txtloginUserId").val(response.UserID);
                fnAlert("w", "", "", response.Message);
            }
        },
        //async: false,
        //processData: false
    });


}
function fnSaveChangePassword() {

    var PasswordPattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@@#$%!&*]).{8,20})");

    if ($("#txtpassword").val().trim().length <= 0) {
        fnAlert("w", "", "", "Please Enter New Password");
        return;
    }
    if (!PasswordPattern.test($("#txtpassword").val())) {
        fnAlert("w", "", "", "Password Should Contains : Minimum 8 character, Minimum 1 uppercase character/lowercase character required, Minimum 1 special symbol(@@#$%!&*) required, Minimum 1 digit required.");
        return;
    }
    if ($("#txtConfirmPassword").val().trim().length <= 0) {
        fnAlert("w", "", "", "Please Enter New Confirm Password");
        return;
    }

    if ($("#txtpassword").val() !== $("#txtConfirmPassword").val()) {
        fnAlert("w", "", "", "Password and Confirm Password should be same");
        return;
    }

    $("#btnSaveChangePassword").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Account/CreateUserPasswordINNextSignIn?userId=' + $("#txtloginUserId").val() + '&password=' + $("#txtpassword").val() + '&confirmPassword=' + $("#txtConfirmPassword").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (response) {

            if (response.Status) {
                $("#txtloginUserId").val('');
                $("#txtloginUserId").val(response.ID);

                $("#PopupChangePassword").modal('hide');

                fnAlert("s", "", "", response.Message);



                setTimeout(function () {
                    $("#PopupSecretQuestion").modal('show');
                }, 2000);
            }
            else {
                fnAlert("e", "", "", response.Message);
            }
            $("#btnSaveChangePassword").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", "", error.statusText);
            $("#btnSaveChangePassword").attr("disabled", false);
        }
    });
}

function fnClearChangePasswordfromLogin() {
    $("#lblLogInID").text("");
    $("#txtloginUserId").val("");
    $("#txtpassword").val("");
    $("#txtConfirmPassword").val("");
    $("#btnSaveChangePassword").attr("disabled", false);
    $("#cboQuestionId").val('0').selectpicker('refresh');
    $("#txtAnswerId").val('');
}

function fnSaveUserQuestionAnswer() {

    if ($("#cboQuestionId").val() == "0" || $("#cboQuestionId").val() == 0 || $("#cboQuestionId").val() == "") {
        fnAlert("w", "", "", "Please select Your Question");
        return;
    }

    if ($("#txtAnswerId").val().trim().length <= 0) {
        fnAlert("w", "", "", "Please Enter Your Answer");
        return;
    }
    obj = {
        UserId: $("#txtloginUserId").val(),
        SecurityQuestionId: $("#cboQuestionId").val(),
        SecurityAnswer: $("#txtAnswerId").val(),
        ActiveStatus: true,
    };


    $("#btnSaveQuestion").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Account/InsertUserSecurityQuestion',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {

            if (response.Status) {
                fnAlert("s", "", "", response.Message);
                $("#PopupSecretQuestion").modal('hide');
                fnClearChangePasswordfromLogin();

            }
            else {
                fnAlert("e", "", "", response.Message);
            }
            $("#btnSaveQuestion").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", "", error.statusText);
            $("#btnSaveQuestion").attr("disabled", false);
        }
    });
}
// otp scripts

$("#PopupOTP").on('show.bs.modal', function () {
    $("#btnCheckOTP").attr('disabled', true);
    fneSyaOTP(6, "#divCreatePwdOTP", "#txtCreatePwdOTP", "#btnCheckOTP");
})

 