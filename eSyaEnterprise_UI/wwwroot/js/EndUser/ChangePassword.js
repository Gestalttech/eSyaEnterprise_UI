$(document).on("click", ".popover .close", function () {
    $(this).parents(".popover").popover('hide');
});

$(document).on('click', '#viewPassword', function () {
    //$(this).text($(this).text() == "Show" ? "Hide" : "Show");
    $("#viewPassword svg").toggleClass("fa-eye-slash fa-eye");
    $(this).prev().attr('type', function (index, attr) { return attr == 'password' ? 'text' : 'password'; });
});

$("#txtNewPassword").blur(function () {
    $(".popover").popover('hide');
});


function fnSaveChangePassword() {

    var PasswordPattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@@#$%!&*]).{8,20})");

    if (IsStringNullorEmpty($("#txtCurrentPassword").val())) {
        fnAlert("w", "EEU_10_00", "UI0277", errorMsg.CurrentPassword_E4);
        return;
    }
    if (IsStringNullorEmpty($("#txtNewPassword").val())) {
        fnAlert("w", "EEU_10_00", "UI0278", errorMsg.NewPassword_E5);
        return;
    }
    
    if (!PasswordPattern.test($("#txtNewPassword").val())) {
        fnAlert("w", "EEU_10_00", "UI0279", errorMsg.PasswordPattern_E6);
        return;
    }
    if (IsStringNullorEmpty($("#txtConfirmPassword").val())) {
        fnAlert("w", "EEU_10_00", "UI0280", errorMsg.EnterPassword_E7);
        return;
    }

    
    if ($("#txtNewPassword").val() !== $("#txtConfirmPassword").val()) {
        fnAlert("w", "EEU_10_00", "UI0281", errorMsg.PasswordSame_E8);
        return;
        
    }

    $("#btnSave").attr("disabled", true);
    objchangepsw = {
        oldpassword: $("#txtCurrentPassword").val(),
        newPassword: $("#txtNewPassword").val(),
    };

    $.ajax({
        url: getBaseURL() + '/UserCreation/ChangeUserPassword',
        type: 'POST',
        data: {
            obj: objchangepsw,
           
        },
        datatype: 'json',
        success: function (response) {

            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnClear();
                window.location.href = getBaseURL() + '/Account/Index';
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", response.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });
}

function fnClear() {
    $("#txtCurrentPassword").val("");
    $("#txtNewPassword").val("")
    $("#txtConfirmPassword").val("")
}