//Create password popup open functionality
$("#txtUserID").on('focusin', function ()
{
    fnEnableSignInButton();
});

$("#txtLoginPassword").on('focusout', function () {
  
    if (!IsStringNullorEmpty($("#txtUserID").val())) {
        $.ajax({
            url: getBaseURL() + '/Account/GetPasswordExpirationDaysbyRule?loginId=' + $("#txtUserID").val(),
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            error: function (xhr) {
                fnAlert("e", "", "", xhr.statusText);
            },
            success: function (response) {
              
                if (response.Status) {
                   
                    if (response.StatusCode == "1") {
                        if (response.ID <= 0) {
                           
                            $("#btnRemindMeLater").attr('disabled', true);
                            $("#PopupExpirationMsg").modal('show');
                            $("#lblMessage").text("Your Password has Expired");
                            $("#txtExpUserID").val(response.Key);
                            fnEnableSignInButton();

                        }
                        else
                        {
                            $("#btnRemindMeLater").attr('disabled', false);
                            $("#PopupExpirationMsg").modal('show');
                            $("#lblMessage").text(response.Message);
                            $("#txtExpUserID").val(response.Key);
                            fnEnableSignInButton();
                        }
                        
                    }
                    else {
                        $("#PopupExpirationMsg").modal('hide');
                        $("#lblMessage").text('');
                        fnEnableSignInButton();
                    }
                }
            }
        });
    }
});

$("#txtUserID").on('focusout', function () {
   
    if (IsStringNullorEmpty($("#txtUserID").val())) {
        return;
    } else {
        fnEnableSignInButton();
        fncheckPasswordWithLoginID();
        fncheckIsUserQuestionsExists();
        fnBindUserLocations();
        
    }
    
});

$("#btnRemindMeLater").click(function () {
    $("#PopupExpirationMsg").modal('hide');
});

$("#txtLoginPassword").on('focusin', function () {
   
    if (IsStringNullorEmpty($("#txtUserID").val())) {
        return;
    } else {
        fnEnableSignInButton();
        fncheckPasswordWithLoginID();
        fncheckIsUserQuestionsExists();
       
    }
});

function fncheckIsUserQuestionsExists() {

    var logInId = $("#txtUserID").val();

    // $("#lblLogInID").text(logInId);
    if (logInId == null || logInId == "") {
        return;
    }
    if (logInId !== null || logInId !== "") {
        logInId = logInId.trim();
    }
    $.ajax({
        url: getBaseURL() + '/Account/ChkIsUserQuestionsExists?loginId=' + logInId,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.StatusCode === "1") {
               
                $("#txtloginUserId").val(response.ID);
                $("#PopupSecretQuestion").modal('show');
               

            }
            else {
                $("#txtloginUserId").val(response.ID);
                $("#PopupSecretQuestion").modal('hide');

            }
        },
        //async: false,
        //processData: false
    });


}
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
          
            $("#lblcreatepasswordmessage").html('');
            if (response.Status) {
                debugger;
                if (response.StatusCode === "1") {
                   
                    //$("#lblLogInID").text("Welcome "+response.Key);
                    $("#txtloginUserId").val(response.ID);
                    $("#lblcreatepasswordmessage").html(response.ErrorCode + "" + response.Message);
                    $("#PopupOTP").modal('show');

                }
                else {
                    // $("#lblLogInID").text("");
                    // $("#txtloginUserId").val("");
                    $("#lblcreatepasswordmessage").html('');
                    $("#PopupOTP").modal('hide');

                }
            }
            else
            {
                fnAlert("w", "", "", response.Message)
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

   // var PasswordPattern = new RegExp("((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@@#$%!&*]).{8,20})");

    if ($("#txtpassword").val().trim().length <= 0) {
        fnAlert("w", "", "UI0278", errorMsg.NewPassword_E5);
        return;
    }
    //if (!PasswordPattern.test($("#txtpassword").val())) {
    //    fnAlert("w", "", "", "Password Should Contains : Minimum 8 character, Minimum 1 uppercase character/lowercase character required, Minimum 1 special symbol(@@#$%!&*) required, Minimum 1 digit required.");
    //    return;
    //}
    if ($("#txtConfirmPassword").val().trim().length <= 0) {
        fnAlert("w", "", "UI0280", errorMsg.EnterPassword_E7);
        return;
    }

    if ($("#txtpassword").val() !== $("#txtConfirmPassword").val()) {
        fnAlert("w", "", "UI0281", errorMsg.PasswordSame_E8);
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
                $("#txtpassword").val("");
                $("#txtConfirmPassword").val("");
                _createPWerrmsg = response.Message.split("\\");
                _createPWlist = "";
                $("#lblCPErrorList").remove();
                $("#lblCPErrorMessageHeader").html(_createPWerrmsg[0]);
                _createPWlist += "<ol id='lblCPErrorList'>"
                for (i = 1; i < _createPWerrmsg.length; i++) {
                    _createPWlist += "<li class='animate__animated animate__fadeInDown'>" + _createPWerrmsg[i] + "</li>";
                }
                _createPWlist += "</ol>"
                $("#divCPlblErrorList").append(_createPWlist);

                $(".bgUserTips").removeClass('red');
                $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
                $("#divCPErrorMsg").css('display', 'block');
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

// Validation function
function validateUserQuestionAnswer() {
   
    var isValid = true;

    // Validate each selectpicker
    $('.selectpicker').each(function () {
        if ($(this).val() == "0" || IsStringNullorEmpty($(this).val())) {
            isValid = false;
           $(this).closest('.form-group').find('.validation-error').remove(); // Remove previous error
            $(this).closest('.form-group').append('<p class="validation-error text-danger m-0">' + localization.PleaseselectaQuestion +'</p>');
        } else {
            $(this).closest('.form-group').find('.validation-error').remove();
            isValid = true;
        }
    });

    // Validate each answer input
    $('.seqPassword').each(function () {
       
        if ($(this).val().trim() == "") {
            isValid = false;
            $(this).closest('.form-group').find('.validation-error').remove(); // Remove previous error
            $(this).closest('.form-group').append('<p class="validation-error text-danger m-0">' + localization.PleaseEnterYourAnswer + '</p>');
        } else {
            $(this).closest('.form-group').find('.validation-error').remove();
            isValid = true;
        }
    });

    return isValid;
}


function fnSaveUserQuestionAnswer() {
  
   
    if (!validateUserQuestionAnswer()) {
        fnAlert("w", "", "UI0383", errorMsg.PleaseCorrectErrors_E12);
        return;
    }

    /* $('.selectpicker').selectpicker();*/
     $('select[name=cboSecurityQuestion]').selectpicker();
    var data = [];
    $('select[name=cboSecurityQuestion]').each(function () {
        var questionId = $(this).attr('id').replace('cboQuestionId_', '');
        var questionValue = $(this).val();
        var answerValue = $('#txtAnswerId_' + questionId).val();
        data.push({
            UserId: $("#txtloginUserId").val(),
            questionId: questionId,
            SecurityQuestionId: questionValue,
            SecurityAnswer: answerValue
        });
    });
           
        $("#btnSaveQuestion").attr("disabled", true);
            $.ajax({
                    url: getBaseURL() + '/Account/InsertUserSecurityQuestion',
                    type: 'POST',
                    datatype: 'json',
                    data: { obj: data },
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

function fnBindUserLocations() {
    var logInId = $("#txtUserID").val();
    $("#cboBusinessLocation").empty();
    $("#cboFinancialYear").empty();
    $.ajax({
        url: getBaseURL() + '/Account/GetUserLocationsbyUserID?loginId=' + logInId,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
         
            if (response.lstUserLocation != null) {
                //refresh each time
               
                $("#cboBusinessLocation").empty();
                $("#cboBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));
                if (response.lstUserLocation != null) {

                for (var i = 0; i < response.lstUserLocation.length; i++) {
                    $("#cboBusinessLocation").append($("<option></option>").val(response.lstUserLocation[i].BusinessKey).html(response.lstUserLocation[i].BusinessLocation));
                    }
                }
                if (response.lstFinancialYear == null) {
                    $("#cboBusinessLocation").empty();
                    $("#cboBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));
                }

                else if (response.lstUserLocation.length == 1) {
                    $("#cboBusinessLocation option:eq(1)").prop("selected", true);
                    $("#cboBusinessLocation").prop("disabled", true);
                }
                else {
                    $("#cboBusinessLocation option:eq(1)").prop("selected", true);
                    $("#cboBusinessLocation").prop("disabled", false);
                }
                

                
                
                $("#cboFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));

                if (response.lstFinancialYear != null) {
                    for (var i = 0; i < response.lstFinancialYear.length; i++) {
                        $("#cboFinancialYear").append($("<option></option>").val(response.lstFinancialYear[i]).html(response.lstFinancialYear[i]));
                    }
                }
                if (response.lstFinancialYear == null) {
                    $("#cboFinancialYear").empty();
                    $("#cboFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));
                }

                else if (response.lstFinancialYear.length == 1) {
                        $("#cboFinancialYear option:eq(1)").prop("selected", true);
                        $("#cboFinancialYear").prop("disabled", true);
                } else {
                        $("#cboFinancialYear option:eq(1)").prop("selected", true);
                        $("#cboFinancialYear").prop("disabled", false);
                    }
               
            }
            else {
                fnAlert("e", "", "", "Invalid User ID");
                $("#cboBusinessLocation").empty();
                $("#cboBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));

                $("#cboFinancialYear").empty();
                $("#cboFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));
            }
        },
        async: false,
        processData: false
    });


}



//Get No of Questions from Rules
function fnGetNumberofQuestionsbyRule() {

    $.ajax({
        url: getBaseURL() + '/Account/GetNumberofQuestionsbyRule',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", "", xhr.statusText);
        },
        success: function (response) {
            if (response.StatusCode === "1") {
                
                $("#txtloginUserId").val(response.ID);
                $("#PopupOTP").modal('show');

            }
            else {
                
                $("#PopupOTP").modal('hide');

            }
        },
        //async: false,
        //processData: false
    });


}


$("#PopupChangePassword").on('shown.bs.modal', function () {
    $("#txtpassword").val("");
    $("#txtConfirmPassword").val("");
    fnCreatePasswordPolicy();
});
function fnCreatePasswordPolicy() {
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
            $("#divCPErrorMsg").css('display', 'none');
            if (response.Status) {

                if (response.StatusCode == "1" || response.StatusCode == 1) {
                    $("#txtpassword").val("");
                    $("#txtConfirmPassword").val("");
                    _createPWerrmsg = response.Message.split("\\");
                    _createPWlist = "";
                    $("#lblCPErrorList").remove();
                    $("#lblCPErrorMessageHeader").html(_createPWerrmsg[0]);
                    _createPWlist += "<ol id='lblCPErrorList'>"
                    for (i = 1; i < _createPWerrmsg.length; i++) {
                        _createPWlist += "<li class='animate__animated animate__fadeInDown'>" + _createPWerrmsg[i] + "</li>";
                    }
                    _createPWlist += "</ol>"
                    $("#divCPlblErrorList").append(_createPWlist);

                    $(".bgUserTips").removeClass('red');
                    $(".bgUserTips").addClass('animate__animated animate__flash animate__repeat-1');
                    $("#divCPErrorMsg").css('display', 'block');
                }
                else {
                    $("#txtpassword").val("");
                    $("#txtConfirmPassword").val("");
                   
                    $("#divCPErrorMsg").css('display', 'none');
                }
            }
        }
    });
}