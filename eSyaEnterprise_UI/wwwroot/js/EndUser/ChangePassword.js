
$(function () {
    fnPasswordPolicy();
})
$(document).on("click", ".popover .close", function () {
    $(this).parents(".popover").popover('hide');
   });

$(document).on('click', '#viewPassword', function () {
    //$(this).text($(this).text() == "Show" ? "Hide" : "Show");
    $("#viewPassword svg").toggleClass("fa-eye-slash fa-eye");
    $(this).prev().attr('type', function (index, attr) { return attr == 'password' ? 'text' : 'password'; });
});


function fnPasswordPolicy() {
    var _resetPWerrmsg = "";
    var _resetPWlist = "";
        
            $.ajax({
                url: getBaseURL() + '/UserCreation/GetPasswordPolicybyRule',
                type: 'GET',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                error: function (xhr) {
                    fnAlert("e", "", "", xhr.statusText);
                },
                success: function (response) {
                    $(".bgUserTips").removeClass('animate__animated animate__flash animate__repeat-1');
                    $("#divRPErrorMsg").css('display', 'none');
                    if (response.Status) {

                        if (response.StatusCode == "1" || response.StatusCode == 1) {
                            
                            fnClear();
                           

                            _resetPWerrmsg = response.Message.split("\\");
                            _resetPWlist = "";
                            $("#lblRPErrorList").remove();
                            $("#lblRPErrorMessageHeader").html(_resetPWerrmsg[0]);
                            _resetPWlist += "<ol id='lblRPErrorList'>"
                            for (i = 1; i < _resetPWerrmsg.length; i++) {
                                _resetPWlist += "<li class='animate__animated animate__fadeInDown'>" + _resetPWerrmsg[i] + "</li>";
                            }
                            _resetPWlist += "</ol>"
                            $("#divRPlblErrorList").append(_resetPWlist);
                            
                            $(".bgUserTips").removeClass('red');
                            $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
                            $("#divRPErrorMsg").css('display', 'block');
                        }
                        else {
                            
                            fnClear();
                            $("#divRPErrorMsg").css('display', 'none');
                        }
                    }
                }
            });
}
$("#txtNewPassword").blur(function () {
    $(".popover").popover('hide');
});


function fnSaveChangePassword() {

   // var PasswordPattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@@#$%!&*]).{8,20})");

    if (IsStringNullorEmpty($("#txtCurrentPassword").val())) {
        fnAlert("w", "EEU_10_00", "UI0277", errorMsg.CurrentPassword_E4);
        return;
    }
    if (IsStringNullorEmpty($("#txtNewPassword").val())) {
        fnAlert("w", "EEU_10_00", "UI0278", errorMsg.NewPassword_E5);
        return;
    }
    
    //if (!PasswordPattern.test($("#txtNewPassword").val())) {
    //    fnAlert("w", "EEU_10_00", "UI0279", errorMsg.PasswordPattern_E6);
    //    return;
    //}
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
                _resetPWerrmsg = response.Message.split("\\");
                _resetPWlist = "";
                $("#lblRPErrorList").remove();
                $("#lblRPErrorMessageHeader").html(_resetPWerrmsg[0]);
                _resetPWlist += "<ol id='lblRPErrorList'>"
                for (i = 1; i < _resetPWerrmsg.length; i++) {
                    _resetPWlist += "<li class='animate__animated animate__fadeInDown'>" + _resetPWerrmsg[i] + "</li>";
                }
                _resetPWlist += "</ol>"
                $("#divRPlblErrorList").append(_resetPWlist);

                $(".bgUserTips").addClass('red');
                $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
                $("#divRPErrorMsg").css('display', 'block');
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
    $("#txtNewPassword").val("");
    $("#txtConfirmPassword").val("");
    $(".bgUserTips").removeClass('red');
}