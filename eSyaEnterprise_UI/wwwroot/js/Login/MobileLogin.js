$(document).ready(function () {
    $('#btnMobSignIn').attr('disabled', true);

    $('#btnMobSignIn').click(function (e) {
        e.preventDefault();
        if ($("#cboMobBusinessLocation").val() == "0" || IsStringNullorEmpty($("#cboMobBusinessLocation").val())) {
            fnAlert("w", "", "UI0380", errorMsg.UserIDNotLinkedLoc_E9);
            return;
        }
        if ($("#cboMobFinancialYear").val() == "0" || IsStringNullorEmpty($("#cboMobFinancialYear").val())) {
            fnAlert("w", "", "UI0381", errorMsg.UserIDNotLinkedFY_E10);
            return;
        }
        $('#btnMobSignIn').attr('disabled', true);
        var data = {
            UserName:$("#txtMobUserName").val(),
            MobileNumber: $('#txtPhoneNumber').val(), 
            BusinessKey: $('#cboMobBusinessLocation').val(),
            FinancialYear: $('#cboMobFinancialYear').val()
        };
        $("#txtDAReturnUrl").val('');
        $.ajax({
            type: 'POST',
            url: getBaseURL() + '/Account/LoginWithMobileNumber',
            data: data,
            success: function (response) {
                // Handle the response
                if (response.success) {

                    if ((response.ActivatedRule == "Sms") || (response.ActivatedRule == "Email") || (response.ActivatedRule == "Questions")) {
                        $("#txtDAReturnUrl").val(response.redirectUrl);
                        $("#PopupDualAuthentication").modal("show");
                    }
                    else {
                        window.location.href = getBaseURL() + response.redirectUrl;
                    }
                   
                } else {

                    fnAlert("w", "", "", response.errorMessage);
                    $('#btnMobSignIn').attr('disabled', false);
                }

            },
            error: function (xhr, status, error) {
                fnAlert("w", "", "", xhr.responseText);
                $('#btnMobSignIn').attr('disabled', false);
            }
        });
    });


});

function fnEnableMobSignInButton() {
    if (!IsStringNullorEmpty($("#txtMobUserID").val()) && !IsStringNullorEmpty($("#txtMobUserID").val()) &&
        $("#cboMobBusinessLocation").val() != "0" && $("#cboMobFinancialYear").val() != "0") {
        $('#btnMobSignIn').attr('disabled', false);
    } else {
        $('#btnMobSignIn').attr('disabled', true);
    }
}
function fnShowMobileDiv() {

    if (_IsMobileLogin === 'false' || _IsMobileLogin === false) {
        $("#dvMobileLoginUnavailable").html("<ul><li style='color:red;padding-top:20px'>Mobile Login Option Is Not Availed</li></ul>");
        return;
    }
    $("#divMobileNumber").removeClass('hide');
  /*  $("#dvOTPError").html("");*/
}

function fnHideMobileDiv() {
    $("#divMobileNumber").addClass('hide');
    $("#txtUserMobile").val('');
    $('#potpstatement').html("");
   /* $("#dvOTPError").html("");*/
}

function fnValidateUserMobileNumberGetOTP() {
    $('#potpstatement').html("");
    $("#txtOTP").val('');
    $('#divOTP').css('display', 'none');

    $("#cboMobBusinessLocation").empty();
    $("#cboMobBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));
    $("#cboMobFinancialYear").empty();
    $("#cboMobFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));
    $("#txtMobUserID").val("");
    $("#txtMobUserName").val("");

        if (IsStringNullorEmpty($("#txtUserMobile").val())) {

            fnAlert("w", "", "UI0375", "Please Enter Mobile Number");
            return;
        }
    $.ajax({
        url: getBaseURL() + '/Account/ValidateUserMobileNumberGetOTP?mobileNumber=' + $("#txtUserMobile").val(),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
           
          /*  $("#dvOTPError").html("");*/
            if (response.IsSucceeded) {
                $("#txtPhoneNumber").val($("#txtUserMobile").val());
                $("#divMobileNumber").hide(500);
                $("#divOTP").show(500);
                $('#txtOTP').val("");
                $('#btnAuthenticateOTP').prop('disabled', false);
                var waitMinutes = 60 * 5;
                fnStartTimer(waitMinutes, '#timer', '#btnAuthenticateOTP');
                $('#divOTP').css('display', 'block');
                $('#divMobileNumber').css('display', 'none');
                $('#potpstatement').html(response.Message);
               
                fnSwitchDiv();
               
            }
            else {
                fnAlert("e", "", "UI0375", response.Message); 
                
            }
        },
        error: function (error) {
            //$("#dvOTPError").html("<ul><li>Internal Error</li></ul>");
            fnAlert("e", "", "UI0375", "Internal Error"); 
        }
    });

}
function fnSwitchDiv() {
    $("#divMobileNumber").hide(500);
    $("#divOTP").show(500);
    var waitMinutes = 60 * 5;
    fnStartTimer(waitMinutes, timerElem);
}
function fnValidateOTP() {
    
    $("#txtMobUserID").val("");
    $("#txtMobUserName").val("");
    var waitMinutes = 60 * 5;
    $.ajax({
        url: getBaseURL() + '/Account/ValidateOTP',
        type: 'POST',
        datatype: 'json',
        data: { mobileNumber: $("#txtUserMobile").val(), OTP: $("#txtOTP").val(), expirytime: waitMinutes / 60 },
        success: function (response) {
            debugger;
            if (response.IsSucceeded) {
               
                fnAlert("s", "", "UI0375", response.Message);
                $('#divOTP').css('display', 'none');
                $('#divMobileNumber').css('display', 'block');
                fnBindMobileUserLocations(response);
                $("#txtMobUserID").val(response.UserID);
                $("#txtMobUserName").val(response.LoginID);
                fnEnableMobSignInButton();
            }
            else {
                fnAlert("e", "", "UI0375", response.Message); 
                $("#cboMobBusinessLocation").empty();
                $("#cboMobBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));

                $("#cboMobFinancialYear").empty();
                $("#cboMobFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));
                $("#txtMobUserID").val("");
                $("#txtMobUserName").val("");
            }
        },
        error: function (error) {
            fnAlert("e", "", "UI0375", "Internal Error"); 
        }
    });
   
}

function fnBindMobileUserLocations(response) {
    

    if (response.l_BusinessKey != null) {
        //refresh each time

        $("#cboMobBusinessLocation").empty();
        $("#cboMobBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));
        if (response.l_BusinessKey != null) {
            var l_BusinessKeyArray = Object.keys(response.l_BusinessKey).map(function (key) {
                return {
                    BusinessKey: parseInt(key),  // Convert string key to integer
                    BusinessLocation: response.l_BusinessKey[key]
                };
            });
         
            for (var i = 0; i < l_BusinessKeyArray.length; i++) {
                $("#cboMobBusinessLocation").append(
                    $("<option></option>")
                        .val(l_BusinessKeyArray[i].BusinessKey)
                        .html(l_BusinessKeyArray[i].BusinessLocation)
                );
            }
        }
        if (response.l_FinancialYear == null) {
            $("#cboMobBusinessLocation").empty();
            $("#cboMobBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));
        }

        else if (l_BusinessKeyArray.length == 1) {
            $("#cboMobBusinessLocation option:eq(1)").prop("selected", true);
            $("#cboMobBusinessLocation").prop("disabled", true);
        }
        else {
            $("#cboMobBusinessLocation option:eq(1)").prop("selected", true);
            $("#cboMobBusinessLocation").prop("disabled", false);
        }

        $("#cboMobFinancialYear").empty();
        $("#cboMobFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));

        if (response.l_FinancialYear != null) {
            for (var i = 0; i < response.l_FinancialYear.length; i++) {
                $("#cboMobFinancialYear").append($("<option></option>").val(response.l_FinancialYear[i]).html(response.l_FinancialYear[i]));
            }
        }
        if (response.l_FinancialYear == null) {
            $("#cboMobFinancialYear").empty();
            $("#cboMobFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));
        }

        else if (response.l_FinancialYear.length == 1) {
            $("#cboMobFinancialYear option:eq(1)").prop("selected", true);
            $("#cboMobFinancialYear").prop("disabled", true);
        } else {
            $("#cboMobFinancialYear option:eq(1)").prop("selected", true);
            $("#cboMobFinancialYear").prop("disabled", false);
        }

    }
    else {
    
        $("#cboMobBusinessLocation").empty();
        $("#cboMobBusinessLocation").append($("<option value='0'>" + localization.Select + "</option>"));

        $("#cboMobFinancialYear").empty();
        $("#cboMobFinancialYear").append($("<option value='0'>" + localization.Select + "</option>"));
    }

}
