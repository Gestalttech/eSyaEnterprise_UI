$(document).ready(function () {

    $('#btnUserSignIn').attr('disabled', true);


    $('#btnUserSignIn').click(function (e) {
        e.preventDefault();
        if ($("#cboBusinessLocation").val() == "0" || IsStringNullorEmpty($("#cboBusinessLocation").val()))
        {
            fnAlert("w", "", "UI0380", errorMsg.UserIDNotLinkedLoc_E9);
            return;
        }
        if ($("#cboFinancialYear").val() == "0" || IsStringNullorEmpty($("#cboFinancialYear").val())) {
            fnAlert("w", "", "UI0381", errorMsg.UserIDNotLinkedFY_E10);
            return;
        }
        $('#btnUserSignIn').attr('disabled', true);
        var data = {
            UserName: $('#txtUserID').val(),
            Password: $('#txtLoginPassword').val(),
            BusinessKey: $('#cboBusinessLocation').val(),
            FinancialYear: $('#cboFinancialYear').val()
        };

        $.ajax({
            type: 'POST',
            url: getBaseURL() + '/Account/Index',
            data: data,
            success: function (response) {
                // Handle the response
                if (response.success) {
                    
                    window.location.href = getBaseURL() + response.redirectUrl;
                  //  $('#btnUserSignIn').attr('disabled', false);
                } else {

                    fnAlert("w", "", "", response.errorMessage);
                    $('#btnUserSignIn').attr('disabled', false);
                }
               
            },
            error: function (xhr, status, error) {
                fnAlert("w", "", "", xhr.responseText);  
                $('#btnUserSignIn').attr('disabled', false);
            }
        });
    });

});


function fnEnableSignInButton()
{
    if (!IsStringNullorEmpty($("#txtUserID").val()) && !IsStringNullorEmpty($("#txtLoginPassword").val()) &&
        $("#cboBusinessLocation").val() != "0" && $("#cboFinancialYear").val() != "0")
    {
        $('#btnUserSignIn').attr('disabled', false);
    } else {
        $('#btnUserSignIn').attr('disabled', true);
    }
}