
function fncboLocation_change() {
    fnClearDoctorAddress();
    fnBindISDCodes();
}

$('input[name="zipcode"]').keyup(function (e) {
    if (/\D/g.test(this.value)) {
        this.value = this.value.replace(/\D/g, '');
    }
});

function fnGetDoctorAddressbyDoctorId() {
    $.ajax({
        url: getBaseURL() + '/Doctors/GetDoctorAddressDoctorId?Isdcode=' + $("#cboIsdcode").val() + '&doctorId=' + $("#txtDoctorId").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response) {
            if (response != null) {
                fnClearDoctorAddress();

                fnBindDoctorBusinessLinkList();
                $('#cboLocation').val(response.BusinessKey).selectpicker('refresh');

                fnBindISDCodes();
                $('#cboIsdcode').val(response.Isdcode).selectpicker('refresh');

                BindStates();
                $('#cboState').val(response.StateCode).selectpicker('refresh');
                BindCities();
                $('#cboCity').val(response.CityCode).selectpicker('refresh');
                BindZipDescriptions();
                $('#cboZipDesc').val(response.Zipcode).selectpicker('refresh');
                $('#txtZipCode').val(response.Zipcode);
                $('#txtAddress').val(response.Address);
                fnBindZipCodeAndArea();
                $('#cboArea').val(response.ZipserialNumber).selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
}

function fnClearDoctorAddress() {
    $("#cboLocation").val('0').selectpicker('refresh');
    $("#cboIsdcode").val('0').selectpicker('refresh');
    $("#cboState").val('0').selectpicker('refresh');
    $("#cboCity").val('0').selectpicker('refresh');
    $("#cboZipDesc").val('0').selectpicker('refresh');
    $("#cboArea").val('0').selectpicker('refresh');
    $("#txtZipCode").val('');
    $("#txtAddress").val('');
    $("#btnSaveDoctorProfileAddress").attr("disabled", false);
    $("#btnSaveDoctorProfileAddress").html('Save');
}

function fncboState_change() {
    BindCities();
    BindZipDescriptions();
}

function fncboCity_change() {
    BindZipDescriptions();
    fnBindZipCodeAndArea();
}

function fncboZipDesc_change() {

    fnBindZipCodeAndArea();
    //$("#txtPinCode").val($(':selected', $('#cboArea')).data('pincode'));
}

function BindStates() {

    $("#cboState").empty();

    $.ajax({
        url: getBaseURL() + '/Doctors/GetStatesbyIsdCode?Isdcode=' + $("#cboIsdcode").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboState").empty();
                $("#cboState").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboState").append($("<option></option>").val(response[i]["StateCode"]).html(response[i]["StateDesc"]));
                }
                $('#cboState').selectpicker('refresh');
            }
            else {
                $("#cboState").empty();
                $("#cboState").append($("<option value='0'> Select </option>"));
                $('#cboState').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function BindCities() {

    $("#cboCity").empty();
    $.ajax({
        url: getBaseURL() + '/Doctors/GetCitiesbyStateCode?Isdcode=' + $("#cboIsdcode").val() + '&statecode=' + $("#cboState").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboCity").empty();

                $("#cboCity").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboCity").append($("<option></option>").val(response[i]["CityCode"]).html(response[i]["CityDesc"]));
                }
                $('#cboCity').selectpicker('refresh');
            }
            else {
                $("#cboCity").empty();
                $("#cboCity").append($("<option value='0'> Select </option>"));
                $('#cboCity').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function BindZipDescriptions() {

    $("#txtZipCode").val('');
    $("#cboZipDesc").empty();
    $.ajax({

        url: getBaseURL() + '/Doctors/GetZipDescriptionbyCityCode?Isdcode=' + $("#cboIsdcode").val() + "&StateCode=" + $('#cboState').val()
            + "&CityCode=" + $('#cboCity').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {

            if (response != null) {
                //refresh each time
                $("#cboZipDesc").empty();
                $("#cboZipDesc").append($("<option value='0'> Select </option>"));

                for (var i = 0; i < response.length; i++) {
                    $("#cboZipDesc").append($("<option></option>").val(response[i]["Zipcode"]).html(response[i]["ZipDesc"]));
                }
                $('#cboZipDesc').selectpicker('refresh');

            } else {
                $("#cboZipDesc").empty();
                $("#cboZipDesc").append($("<option value='0'> Select </option>"));
                $('#cboZipDesc').selectpicker('refresh');
            }
        },

        async: false,
        processData: false
    });
}

function fnBindZipCodeAndArea() {
    $("#txtZipCode").val('');
    var zip = $('#cboZipDesc').val();
    $("#txtZipCode").val(zip);

    $("#cboArea").empty();
    $.ajax({
        url: getBaseURL() + '/Doctors/GetZipCodeAndArea?Isdcode=' + $("#cboIsdcode").val()
            + "&zipcode=" + $('#cboZipDesc').val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {

            if (response != null) {
                //refresh each time
                $("#cboArea").empty();
                $("#cboArea").append($("<option value='0'> Select </option>"));

                for (var i = 0; i < response.length; i++) {
                    $("#cboArea").append($("<option></option>").val(response[i]["ZipserialNumber"]).html(response[i]["Area"]));
                }
                $('#cboArea').selectpicker('refresh');

            } else {
                $("#cboArea").empty();
                $("#cboArea").append($("<option value='0'> Select </option>"));
                $('#cboArea').selectpicker('refresh');
            }
        },

        async: false,
        processData: false
    });
}

$('#txtZipCode').blur(function () {

    if (!IsStringNullorEmpty($("#txtZipCode").val()) && $("#txtZipCode").val() !== '0') {
        $.ajax({
            url: getBaseURL() + '/Doctors/FillCoumbosbyZipCode?Isdcode=' + $("#cboIsdcode").val() + '&zipcode=' + $("#txtZipCode").val(),
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result != null) {
                    BindStates();
                    $('#cboState').val(result.StateCode);
                    $('#cboState').selectpicker('refresh');
                    BindCities();
                    $('#cboCity').val(result.CityCode);
                    $('#cboCity').selectpicker('refresh');
                    BindZipDescriptions();
                    if ($('#cboZipDesc').children('option').length > 2)
                        $('#cboZipDesc').val("0");
                    else
                        $('#cboZipDesc').val(result.Zipcode);
                    $('#cboZipDesc').selectpicker('refresh');

                }

                else {
                    $('#cboState').selectpicker('refresh');
                    $('#CityCode').selectpicker('refresh');
                    $('#cboZipDesc').selectpicker('refresh');
                    $('#cboArea').selectpicker('refresh');
                }
            },
            error: function (result) {
                //Your error message
                $('#cboState').selectpicker('refresh');
                $('#CityCode').selectpicker('refresh');
                $('#cboZipDesc').selectpicker('refresh');
                $('#cboArea').selectpicker('refresh');
            },
            async: false,
            processData: false
        });
    }
    else {
        var cityCode = $('#cboCity').val();
        BindCities();
        $('#cboCity').val(cityCode);
        $('#cboCity').selectpicker('refresh');
        BindZipDescriptions();
    }

});

function fnSaveDoctorProfileAddress() {

    if (IsValidSaveDoctorAddress() === false) {
        return;
    }

    var obj = {
        BusinessKey: $("#cboLocation").val(),
        Isdcode: $("#cboIsdcode").val(),
        DoctorId: $('#txtDoctorId').val(),
        StateCode: $("#cboState").val(),
        CityCode: $("#cboCity").val(),
        Zipcode: $("#cboZipDesc").val(),
        ZipserialNumber: $('#cboArea').val(),
        //Area: $("#txtArea").val(),
        Address: $("#txtAddress").val(),
        ActiveStatus: true

    };
    $("#btnSaveDoctorProfileAddress").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Doctors/InsertOrUpdateIntoDoctorProfileAddress',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveDoctorProfileAddress").attr('disabled', false);
                fnClearDoctorAddress();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDoctorProfileAddress").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDoctorProfileAddress").attr('disabled', false);
        }
    });

}

function IsValidSaveDoctorAddress() {

    if (IsStringNullorEmpty($("#cboLocation").val()) || $("#cboLocation").val() === "0" || $("#cboLocation").val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0330", errorMsg_add.Location_E1);
        return false;
    }
    if (IsStringNullorEmpty($("#cboIsdcode").val()) || $("#cboIsdcode").val() === "0" || $("#cboIsdcode").val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0034", errorMsg_add.ISDCode_E2);
        return false;
    }
    if (IsStringNullorEmpty($("#txtDoctorId").val()) || $("#txtDoctorId").val() === "0") {
        fnAlert("w", "ESP_01_00", "UI0322", errorMsg_add.DoctorDetails_E3);
        return false;
    }


    if (IsStringNullorEmpty($("#cboState").val()) || $("#cboState").val() == '0' || $("#cboState").val() == "0") {
        fnAlert("w", "ESP_01_00", "UI0161", errorMsg_add.State_E4);
        return false;
    }
    if (IsStringNullorEmpty($("#cboCity").val()) || $("#cboCity").val() == '0' || $("#cboCity").val() == "0") {
        fnAlert("w", "ESP_01_00", "UI0162", errorMsg_add.City_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#cboZipDesc").val()) || $("#cboZipDesc").val() == '0' || $("#cboZipDesc").val() == "0") {
        fnAlert("w", "ESP_01_00", "UI0163", errorMsg_add.Zip_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#cboArea").val()) || $("#cboArea").val() == '0' || $("#cboArea").val() == "0") {
        fnAlert("w", "ESP_01_00", "UI0331", errorMsg_add.Area_E7);
        return false;
    }
}

function fnBindISDCodes() {
    $("#cboIsdcode").empty();

    $.ajax({
        url: getBaseURL() + '/Doctors/GetISDCodesbyBusinessKey?businessKey=' + $("#cboLocation").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },

        success: function (data) {
            if (data != null) {
                //refresh each time
                $("#cboIsdcode").empty();
                $("#cboIsdcode").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < data.length; i++) {

                    $("#cboIsdcode").append($("<option></option>").val(data[i]["Isdcode"]).html(data[i]["CountryName"]));

                    //$("#cboIsdcode").append($("<option></option>").val(data[i]["Isdcode"]).text(data[i]["Isdcode"] + '-' + data[i]["CountryName"]));
                }
                $("#cboIsdcode").val(_cnfISDCode);
                $("#cboIsdcode").val('0');
                $('#cboIsdcode').selectpicker('refresh');
            }
            else {
                $("#cboIsdcode").empty();
                $("#cboIsdcode").append($("<option value='0'> Select </option>"));
                $("#cboIsdcode").val(_cnfISDCode);
                $("#cboIsdcode").val('0');
                $('#cboIsdcode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });

}

function fnISD_change() {
    BindStates();
}

function fnBindDoctorBusinessLinkList() {

    $("#cboLocation").empty();

    $.ajax({
        url: getBaseURL() + '/Doctors/GetDoctorLinkWithBusinessLocation?doctorId=' + $("#txtDoctorId").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboLocation").empty();
                $("#cboLocation").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboLocation").append($("<option></option>").val(response[i]["BusinessKey"]).html(response[i]["BusinessLocation"]));
                }
                $('#cboLocation').selectpicker('refresh');
            }
            else {
                $("#cboLocation").empty();
                $("#cboLocation").append($("<option value='0'> Select </option>"));
                $('#cboLocation').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

