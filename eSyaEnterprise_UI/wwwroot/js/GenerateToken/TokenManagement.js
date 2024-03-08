var arr_Type = [];
$(document).ready(function () {

});

function fnGridLoadCounterDetail(_prefix) {
    $("#jqgCounter_" + _prefix).jqGrid('GridUnload');
    $("#jqgCounter_" + _prefix).jqGrid(
        {
            url: getBaseURL() + '/TokenManagement/GetTokenDetailByTokenType',
            datatype: "json",
            contentType: "application/json; charset-utf-8",
            mtype: 'GET',
            postData: {
                tokenprefix: _prefix,
            },
            colNames: ["Token Number", "S.No", "", "", "",/* "", "",*/ "", "", "",""],
            colModel: [

                { name: "TokenKey", width: 30, editable: true, align: 'left' },
                { name: "SequeueNumber", width: 20, editable: true, align: 'left', hidden: true },
                { name: "TokenPrefix", width: 20, editable: true, align: 'left', hidden: true },
                {
                    name: "Button", width: 80, editable: true, align: 'left', hidden: false, formatter: function (cellValue, options, rowObject) {
                        var i = options.rowId;
                        return "<button id=btnCall_" + rowObject.TokenPrefix + i + " type='button' class='btn btn-success btn-sm' onclick=fnCallingToken('" + rowObject.TokenKey + "','" + rowObject.TokenPrefix + "')><i class='fa fa-phone' aria-hidden='true'></i> Call</button>"
                            +
                            "&nbsp; <button id=btnHold_" + rowObject.TokenPrefix + i + "  type='button' class='btn btn-danger btn-sm mr-3' onclick=fnUpdateTokenToHold('" + rowObject.TokenKey + "','" + rowObject.TokenPrefix + "')><i class='fas fa-pause c-white'></i> Hold</button> "
                           +
                            "&nbsp; <button id=btnConfirm_" + rowObject.TokenPrefix + i + " type='button' class='btn btn-success btn-sm' onclick=fnCallingConfirmation('" + rowObject.TokenKey + "','" + rowObject.TokenPrefix + "','" + rowObject.TokenCalling + "')><i class='fa fa-check' aria-hidden='true'></i> Confirm</button>"
                           +
                            " <button id=btnRelease_" + rowObject.TokenPrefix + i + " type = 'button' class='btn btn-success btn-sm' onclick = fnUpdateTokenToRelease('" + rowObject.TokenKey + "','" + rowObject.TokenPrefix + "') > <i class='fas fa-play c-white'></i> Release</button > "

                            ;
                    }
                },
                { name: "TokenHold", width: 100, editable: true, align: 'left', hidden: true },
                //{
                //    name: "Button", width: 70, editable: true, align: 'center', hidden: false, formatter: function (cellValue, options, rowObject) {
                //        return "<button type='button' class='btn btn-primary' onclick=fnUpdateTokenStatusToCompleted('" + rowObject.TokenKey + "','" + rowObject.TokenType + "')><i class='fas fa-external-link-alt c-white'></i> Complete</button>"
                //    }
                //},
                //{
                //    name: "Button", width: 70, editable: true, align: 'center', hidden: false, formatter: function (cellValue, option, rowObject) {
                //        var i = option.rowId;
                //        return "<button id=btnHold_" + rowObject.TokenType + i + "  type='button' class='btn btn-danger mr-3' onclick=fnUpdateTokenToHold('" + rowObject.TokenKey + "','" + rowObject.TokenType + "')><i class='fas fa-pause c-white'></i> Hold</button> " +
                //            " <button id=btnRelease_" + rowObject.TokenType + i + " type = 'button' class='btn btn-success' onclick = fnUpdateTokenToRelease('" + rowObject.TokenKey + "','" + rowObject.TokenType + "') > <i class='fas fa-play c-white'></i> Release</button > "
                //    }
                //},
                { name: "TokenCalling", width: 120, editable: true, align: 'left', hidden: true },
                { name: "CallingConfirmation", width: 120, editable: true, align: 'left', hidden: true },
                { name: "ConfirmationUrl", width: 120, editable: true, align: 'left', hidden: true },
                { name: "QrcodeUrl", width: 120, editable: true, align: 'left', hidden: true }
            ],
            rowNum: 10000,
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            scroll: false,
            loadonce: true,
            width: 'auto',
            height: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: false,
            caption: localization.CounterDetails,
            loadComplete: function () {
                var rowIds = $('#jqgCounter_' + _prefix).jqGrid('getDataIDs');
                for (i = 0; i < rowIds.length; i++) {

                    rowData = $('#jqgCounter_' + _prefix).jqGrid('getRowData', rowIds[i]);

                    if (rowData["TokenHold"] === "true") {
                        $("#btnHold_" + _prefix + rowIds[i]).hide();
                    }
                    else {
                        $("#btnRelease_" + _prefix + rowIds[i]).hide();
                    }

                    if (rowData["TokenCalling"] === "true") {
                        $("#btnCall_" + _prefix + rowIds[i]).removeClass("btn-success");
                        $("#btnCall_" + _prefix + rowIds[i]).addClass("btn-danger");
                    }

                    if (rowData["CallingConfirmation"] === "true") {
                        $("#btnCall_" + _prefix + rowIds[i]).attr('disabled', true);
                        $("#btnConfirm_" + _prefix + rowIds[i]).attr('disabled', true);
                    }
                }

            },
        });

}
function fnLoadCounters() {
   
    $("#cboCounter").empty();
    $("#dvGridData").html('');
    $('#lblCurrentlyServingToken').text("0");
    clearInterval(myTimer);
    document.querySelector('#lblTokenTimer').textContent = "00:00";
    arr_Type = [];
    $.ajax({
        url: getBaseURL() + '/GenerateToken/TokenManagement/GetCounterNumbersbyFloorId?floorId=' + $("#cboFloor").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response, data) {

            $("#cboCounter").append($("<option value='0' selected> Select </option>"));
            for (var i = 0; i < response.length; i++) {
                $("#cboCounter").append($("<option></option>").val(response[i]["CounterNumber"]).html(response[i]["CounterNumber"]));
            }
            $('#cboCounter').selectpicker('refresh');

        },
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function fnGetTokenTypes() {
    arr_Type = [];
    $("#dvGridData").html('');
    $('#lblCurrentlyServingToken').text("0");
    clearInterval(myTimer);
    document.querySelector('#lblTokenTimer').textContent = "00:00";
    $.ajax({
        url: getBaseURL() + '/TokenManagement/GetTokenTypeByCounter?counterNumber=' + $("#cboCounter").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response, data) {
            arr_Type = response;
            var content = "";
            content += "<div class='row'>";
            for (var i = 0; i < arr_Type.length; i++) {
                content += "<div class='col-lg-6 col-6'><h5 class='episodeType'>" + arr_Type[i].TokenDesc + "</h5><table id='jqgCounter_" + arr_Type[i].TokenPrefix + "'> </table><div id='jqpCounter_" + arr_Type[i].TokenPrefix + "'><br/></div></div>";
            }
            content += "</div>";
            $("#dvGridData").html(content);
            for (var i = 0; i < arr_Type.length; i++) {
                fnGridLoadCounterDetail(arr_Type[i].TokenPrefix)
            }
        },
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });


}

function fnCallingToken(TokenKey, TokenPrefix) {
    $('#lblCurrentlyServingToken').text(TokenKey);
    $('#hdvTokenType').val(TokenPrefix);

    fnRecallToken();
}

function fnRecallToken() {


    if ($("#cboFloor").val() === "") {
        fnAlert("w", "ETM_08_00", "UI0253", errorMsg.SelectFloor_E1);
        return false;
    }
    if ($("#cboCounter").val() === "" || $("#cboCounter").val() === "0") {
        fnAlert("w", "ETM_08_00", "UI0254", errorMsg.counter_E2);
        return false;
    }
    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        fnAlert("w", "ETM_08_00", "UI0254", errorMsg.SelectToken_E3);
        return false;
    }
    var obj = {
        TokenKey: currentlyServingToken,
        TokenPrefix: $('#hdvTokenType').val(),
        CallingCounter: $("#cboCounter").val(),
    };

    if (currentlyServingToken.length > 1) {
        $.ajax({
            url: getBaseURL() + '/TokenManagement/UpdateCallingToken',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            success: function (result) {

                if (result.Status) {
                    fnAlert("s", "", result.StatusCode, result.Message);
                    var waitMinutes = 60 * 3;
                    display = document.querySelector('#lblTokenTimer');
                    startTimer(waitMinutes, display);
                    jQuery("#jqgCounter_" + $('#hdvTokenType').val()).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    return true;
                }
                else {
                    fnAlert("e", "", result.StatusCode, result.Message);
                    return false;
                }

            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                return false;
            }
        });
    }

}
function fnHoldToken() {

    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        fnAlert("w", "ETM_08_00", "UI0254", errorMsg.SelectToken_E3);
        return false;
    }

    var obj = {
        TokenKey: currentlyServingToken,
        TokenPrefix: $('#hdvTokenType').val(),
        CallingCounter: $("#cboCounter").val(),
    };

    if (currentlyServingToken.length > 1) {

        $.ajax({
            url: getBaseURL() + '/TokenManagement/UpdateTokenToHold',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            success: function (result) {

                if (result.Status) {
                    fnAlert("s", "", result.StatusCode, result.Message);
                    $('#lblCurrentlyServingToken').text("0");
                    clearInterval(myTimer);
                    document.querySelector('#lblTokenTimer').textContent = "00:00";

                    jQuery("#jqgCounter_" + $('#hdvTokenType').val()).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    return true;
                }
                else {
                    fnAlert("e", "", result.StatusCode, result.Message);
                    return false;
                }
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                return false;
            }
        });
    }

}
function fnUpdateTokenToHold(TokenKey, TokenPrefix) {

    bootbox.confirm({
        message: "Do you want to hold this Token " + TokenKey + " ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    TokenKey: TokenKey,
                    TokenPrefix: TokenPrefix
                };

                $.ajax({
                    url: getBaseURL() + '/TokenManagement/UpdateTokenToHold',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    success: function (result) {

                        if (result.Status) {
                            fnAlert("s", "", result.StatusCode, result.Message);
                            jQuery("#jqgCounter_" + TokenPrefix).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            fnAlert("e", "", result.StatusCode, result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        fnAlert("e", "", error.StatusCode, error.statusText);
                        return false;
                    }
                });
            }
        }
    });

}
function fnUpdateTokenToRelease(TokenKey, TokenPrefix) {

    bootbox.confirm({
        message: "Do you want to hold this Token " + TokenKey + " ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    TokenKey: TokenKey,
                    TokenPrefix: TokenPrefix
                };

                $.ajax({
                    url: getBaseURL() + '/TokenManagement/UpdateTokenToRelease',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    success: function (result) {

                        if (result.Status) {
                            fnAlert("s", "", result.StatusCode, result.Message);

                            jQuery("#jqgCounter_" + TokenPrefix).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            fnAlert("e", "", result.StatusCode, result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        fnAlert("e", "", error.StatusCode, error.statusText);
                        return false;
                    }
                });
            }
        }
    });
}
function fnCounterCompleted() {

    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        fnAlert("w", "ETM_08_00", "UI0254", errorMsg.SelectToken_E3);
        return false;
    }
    var TokenPrefix = $('#hdvTokenType').val();
    if (currentlyServingToken.length > 1) {
        fnUpdateTokenStatusToCompleted(currentlyServingToken, TokenPrefix);
    }
}
function fnUpdateTokenStatusToCompleted(TokenKey, TokenPrefix) {
    if ($("#cboFloor").val() === "") {
        fnAlert("w", "ETM_08_00", "UI0253", errorMsg.SelectFloor_E1);
        return false;
    }
    if (TokenKey != $('#lblCurrentlyServingToken').text()) {
        fnAlert("w", "ETM_08_00", "UI0256", errorMsg.CallPatient_E4);
        return false;
    }


    bootbox.confirm({
        message: "Service Completed ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'btn-success'
            },
            cancel: {
                label: 'No',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if (result) {
                var obj = {
                    TokenKey: TokenKey,
                    TokenPrefix: TokenPrefix,
                };

                $.ajax({
                    url: getBaseURL() + '/TokenManagement/UpdateTokenStatusToCompleted',
                    type: 'POST',
                    datatype: 'json',
                    contenttype: 'application/json; charset=utf-8',
                    data: obj,
                    success: function (result) {

                        if (result.Status) {
                            fnAlert("s", "", result.StatusCode, result.Message);
                            clearInterval(myTimer);
                            document.querySelector('#lblTokenTimer').textContent = "Completed";

                            jQuery("#jqgCounter_" + TokenPrefix).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                            return true;
                        }
                        else {
                            fnAlert("e", "", result.StatusCode, result.Message);
                            return false;
                        }
                    },
                    error: function (error) {
                        fnAlert("e", "", error.StatusCode, error.statusText);
                        return false;
                    }
                });
            }
        }
    });



}
function fnNextToken() {
    if ($("#cboFloor").val() === "") {
        fnAlert("w", "ETM_08_00", "UI0253", errorMsg.SelectFloor_E1);
        return false;
    }
    if ($("#cboCounter").val() === "" || $("#cboCounter").val() === "0") {
        fnAlert("w", "ETM_08_00", "UI0254", errorMsg.counter_E2);
        return false;
    }

    var currentlyServingToken = $('#lblCurrentlyServingToken').text();
    if (currentlyServingToken == "0") {
        fnAlert("w", "ETM_08_00", "UI0254", errorMsg.SelectToken_E3);
        return false;
    }
    var obj = {
        TokenKey: currentlyServingToken,
        TokenPrefix: $('#hdvTokenType').val(),
        CallingCounter: $("#cboCounter").val(),
    };

    $.ajax({
        url: getBaseURL() + '/TokenManagement/UpdateToCallingNextToken',
        type: 'POST',
        datatype: 'json',
        contenttype: 'application/json; charset=utf-8',
        data: obj,
        async: false,
        success: function (result) {

            if (result.Status) {
                if (!IsStringNullorEmpty(result.Key)) {
                    //toastr.success("Calling the Token : " + result.Key);
                    fnAlert("s", "", "UI0258", errorMsg.CallingToken_E6 + result.Key);
                    $('#lblCurrentlyServingToken').text(result.Key);
                    var waitMinutes = 60 * 3;
                    display = document.querySelector('#lblTokenTimer');
                    startTimer(waitMinutes, display);
                    jQuery("#jqgCounter_" + $('#hdvTokenType').val()).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');

                    return true;
                }
                else {
                    fnAlert("e", "", result.StatusCode, result.Message);
                    $('#lblCurrentlyServingToken').text(0);
                    clearInterval(myTimer);
                    document.querySelector('#lblTokenTimer').textContent = "00:00";
                    return false;
                }
            }
            else {
                fnAlert("e", "", result.StatusCode, result.Message);
                return false;
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            return false;
        }
    });

}
window.setTimeout(refreshGrid, 10000);
function refreshGrid() {
    for (var i = 0; i < arr_Type.length; i++) {
        jQuery("#jqgCounter_" + arr_Type[i].TokenPrefix).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
    }
}

function fnCallingConfirmation(TokenKey, TokenPrefix, TokenCalling) {

    if ($("#cboFloor").val() === "") {
        fnAlert("w", "ETM_08_00", "UI0253", errorMsg.SelectFloor_E1);
        return false;
    }

    if ($("#cboCounter").val() === "" || $("#cboCounter").val() === "0") {
        fnAlert("w", "ETM_08_00", "UI0254", errorMsg.counter_E2);
        return false;
    }

    if (TokenCalling === "false" || $('#lblCurrentlyServingToken').text() != TokenKey) {
        fnAlert("w", "ETM_08_00", "UI0257", errorMsg.CallToken_E5);
        return false;
    }

    var obj = {
        TokenKey: TokenKey,
        TokenPrefix: TokenPrefix
    };

    if (TokenKey.length > 1) {
        $.ajax({
            url: getBaseURL() + '/TokenManagement/UpdateCallingConfirmation',
            type: 'POST',
            datatype: 'json',
            contenttype: 'application/json; charset=utf-8',
            data: obj,
            success: function (result) {

                if (result.Status) {
                    fnAlert("s", "", result.StatusCode, result.Message);

                    var rowIds = $('#jqgCounter_' + TokenPrefix).jqGrid('getDataIDs');
                    for (i = 0; i < rowIds.length; i++) {

                        rowData = $('#jqgCounter_' + TokenPrefix).jqGrid('getRowData', rowIds[i]);

                        if (rowData["TokenKey"] === TokenKey) {
                            if (rowData["ConfirmationUrl"] != null && rowData["ConfirmationUrl"] != "") {
                                localStorage.setItem("tokenkey", TokenKey);
                                var url = getBaseURL()+'/' + rowData["ConfirmationUrl"];
                                window.open(
                                    url,
                                    '_blank'
                                    // <- This is what makes it open in a new window.
                                    , ''
                                );
                            }
                        }
                    }
                    jQuery("#jqgCounter_" + TokenPrefix).jqGrid('setGridParam', { datatype: 'json' }).trigger('reloadGrid');
                    return true;
                }
                else {
                    fnAlert("e", "", result.StatusCode, result.Message);
                    return false;
                }

            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                return false;
            }
        });
    }
}