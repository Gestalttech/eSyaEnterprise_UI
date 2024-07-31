$(document).on('click', '#viewPassword', function () {
    //$(this).text($(this).text() == "Show" ? "Hide" : "Show");
    $("#viewExpPassword svg").toggleClass("fa-eye-slash fa-eye");
    $(this).prev().attr('type', function (index, attr) { return attr == 'password' ? 'text' : 'password'; });
});


function fnSaveExpChangePassword() {

    var PasswordPattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@@#$%!&*]).{8,20})");

    if (IsStringNullorEmpty($("#txtExpCurrentPassword").val())) {
        fnAlert("w", "", "UI0277", errorMsg.CurrentPassword_E4);
        return;
    }
    if (IsStringNullorEmpty($("#txtExpNewPassword").val())) {
        fnAlert("w", "", "UI0278", errorMsg.NewPassword_E5);
        return;
    }

    if (!PasswordPattern.test($("#txtExpNewPassword").val())) {
        fnAlert("w", "", "UI0279", errorMsg.PasswordPattern_E6);
        return;
    }
    if (IsStringNullorEmpty($("#txtExpConfirmPassword").val())) {
        fnAlert("w", "", "UI0280", errorMsg.EnterPassword_E7);
        return;
    }


    if ($("#txtExpNewPassword").val() !== $("#txtExpConfirmPassword").val()) {
        fnAlert("w", "", "UI0281", errorMsg.PasswordSame_E8);
        return;

    }

    $("#btnExpSave").attr("disabled", true);
    objchangepsw = {
        oldpassword: $("#txtExpCurrentPassword").val(),
        newPassword: $("#txtExpNewPassword").val(),
    };

    $.ajax({
        url: getBaseURL() + '/Account/ChangeUserPassword',
        type: 'POST',
        data: {
            obj: objchangepsw,

        },
        datatype: 'json',
        success: function (response) {

            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnExpClear();
                
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnExpSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", response.StatusCode, error.statusText);
            $("#btnExpSave").attr("disabled", false);
        }
    });
}

function fnExpClear() {
    $("#txtExpCurrentPassword").val("");
    $("#txtExpNewPassword").val("")
    $("#txtExpConfirmPassword").val("")
}