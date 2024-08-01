var _errmsg = ""; var _list = ""
var _errmsgS = ""; var _listS = ""
$(document).on('click', '#viewExpPassword', function () {
    //$(this).text($(this).text() == "Show" ? "Hide" : "Show");
    $("#viewExpPassword svg").toggleClass("fa-eye-slash fa-eye");
    $(this).prev().attr('type', function (index, attr) { return attr == 'password' ? 'text' : 'password'; });
    $(".bgUserTips").removeClass('red');
    $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
});
$("#txtExpCurrentPassword,#txtExpNewPassword,#txtExpConfirmPassword,#btnExpSave").on('focusin focusout click', function () {
    $("#PopupExpirationMsg").modal('hide');
});
 
$("#PopupExpPassword").on('shown.bs.modal', function () {
    $("#PopupExpirationMsg").modal('hide');
});
function fnOpenExpChangePasswordPopUp() {
   
    $("#lblErrorMessageHeader").html('');
 
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
            if (response.Status) {
              
                if (response.StatusCode == "1" || response.StatusCode == 1) {
                        $("#PopupExpirationMsg").modal('hide');
                        fnExpClear();
                        $("#PopupExpPassword").modal('show');
                     
                    _errmsg = response.Message.split("\\");
                    _list = "";
                    $("#lblErrorList").remove();
                    $("#lblErrorMessageHeader").html(_errmsg[0]);
                    _list += "<ol id='lblErrorList'>"
                        for (i = 1; i < _errmsg.length; i++) {
                            _list += "<li class='animate__animated animate__fadeInDown'>" + _errmsg[i] + "</li>";
                        }
                        _list += "</ol>"
                    $("#divlblErrorList").append(_list);
                    $("#divErrorMsg").css('display', 'block');
                    $(".bgUserTips").removeClass('red');
                    $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
                 }
                else {
                    $("#PopupExpirationMsg").modal('hide');
                    fnExpClear();
                    $("#PopupExpPassword").modal('show');
                }
            }
        }
    });
    
}
function fnSaveExpChangePassword() {

    $("#lblErrorMessageHeader").html('');
    /*$("#lblErrorList").remove();*/
   
    if (IsStringNullorEmpty($("#txtExpUserID").val())) {
        fnAlert("w", "", "UI0277", "User ID is not Exist");
        return;
    }
    if (IsStringNullorEmpty($("#txtExpCurrentPassword").val())) {
        fnAlert("w", "", "UI0277", errorMsg.CurrentPassword_E4);
        return;
    }
    if (IsStringNullorEmpty($("#txtExpNewPassword").val())) {
        fnAlert("w", "", "UI0278", errorMsg.NewPassword_E5);
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
    obj = {
        userID: $("#txtExpUserID").val(),
        oldpassword: $("#txtExpCurrentPassword").val(),
        newPassword: $("#txtExpNewPassword").val(),
    };

    $.ajax({
        url: getBaseURL() + '/Account/ChangeUserExpirationPassword',
        type: 'POST',
        data: {
            obj

        },
      
        datatype: 'json',
        success: function (response) {
            
            $(".bgUserTips").removeClass('red');
            $("#lblErrorMessage").html("");
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnExpClear();
                $("#txtExpUserID").val(''); $("#btnExpSave").attr("disabled", false);
                $("#divErrorMsg").css('display', 'none');
            }
            else {
               
                $(".bgUserTips").removeClass('red');
                _errmsgS = response.Message.split("\\");
                $("#lblErrorMessageHeader").html(_errmsgS[0]);
                
                _listS = "";
                $("#lblErrorList").remove();
                $("#lblErrorMessageHeader").html(_errmsgS[0]);
                _listS += "<ol id='lblErrorList' >"
                for (i = 1; i < _errmsgS.length; i++) {
                    _listS += "<li class='animate__animated animate__fadeInDown'>" + _errmsgS[i] + "</li>";
                }
                _listS += "</ol>"
                $("#divlblErrorList").append(_listS);
                $("#divErrorMsg").css('display', 'block');
                $(".bgUserTips").addClass('red');
               
              
            }
            $("#btnExpSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnExpSave").attr("disabled", false);
        }
    });
}

function fnExpClear() {
    $("#txtExpCurrentPassword").val("");
    $("#txtExpNewPassword").val("");
    $("#txtExpConfirmPassword").val("");
    
}