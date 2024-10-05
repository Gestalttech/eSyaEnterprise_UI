$(function () {
    fnGridLoadCityList();
    $.contextMenu({
        selector: "#btnCityList",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCityCodes(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCityCodes(event, 'view') } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCityCodes(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});


var actiontype = "";

function fnGridLoadCityList() {
    var IsdcCountry = $("#cboCityCountry").val();
    var statecode = $("#cboStateCode").val();

    $("#jqgCityCode").jqGrid('GridUnload');
    $("#jqgCityCode").jqGrid({
        url: getBaseURL() + '/Address/GetCitiesbyStateCode?isdCode=' + IsdcCountry + '&stateCode=' + statecode,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.StateCode, localization.CityCode, localization.Stdcode, localization.StateDesc, localization.CityDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "Isdcode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "StateCode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "CityCode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "Stdcode", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "StateDesc", width: 120, editable: true, align: 'left', resizable: false, hidden: true, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "CityDesc", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCityList"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpCityCode",
        rowNum: 10,
        rowList: [10, 20, 50],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption: localization.CityList,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgCityCode");
        },
    }).jqGrid('navGrid', '#jqpCityCode', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCityCode', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCityCodes
        }).jqGrid('navButtonAdd', '#jqpCityCode', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCityCodes
    });
    fnAddGridSerialNoHeading();
}

function fnAddCityCodes() {
    debugger;
    var id = $("#cboCityCountry").val();
    var sid = $("#cboStateCode").val();
    if (id === 0 || id === "0" || IsStringNullorEmpty($("#cboCityCountry").val())) {
        fnAlert("w", "EPS_16_00", "UI0041", errorMsg.CountrySelect_E6);
    }
    else if (sid === 0 || sid === "0" || IsStringNullorEmpty($("#cboStateCode").val()))
    {
        fnAlert("w", "EPS_16_00", "UI0044", errorMsg.StateSelect_E7);
    }
    else
    {
        fnClearFields();
        $('#PopupCityCode').modal('show');
        $('#PopupCityCode').modal({ backdrop: 'static', keyboard: false });
        $('#PopupCityCode').find('.modal-title').text(localization.AddCityCode);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCityCode").html('<i class="fa fa-save"></i>  ' + localization.Save);
        $("#btnSaveCityCode").show();
    }
}

function fnEditCityCodes(e, actiontype) {

    var rowid = $("#jqgCityCode").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCityCode').jqGrid('getRowData', rowid);

    $("#txtCityCode").val(rowData.CityCode);
    $("#txtSTDCode").val(rowData.Stdcode);
    $("#txtCityDescription").val(rowData.CityDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveCityCode").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_16_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupCityCode').modal('show');
        $('#PopupCityCode').find('.modal-title').text(localization.UpdateCityCode);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCityCode").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveCityCode").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_16_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupCityCode').modal('show');
        $('#PopupCityCode').find('.modal-title').text(localization.ViewCityCode);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCityCode").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}

function fnGridRefreshCityCodes() {
    $("#jqgCityCode").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtCityCode").val("");
    $("#txtSTDCode").val("");
    $("#txtCityDescription").val("");
    $("#btnSaveCityCode").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

$("#btnCancelCityCode").click(function () {
    fnClearFields();
    $("#jqgCityCode").jqGrid('resetSelection');
    $('#PopupCityCode').modal('hide');
});

function fnSaveCityCodes() {

    if ($("#cboCityCountry").val() === 0 || $("#cboCityCountry").val() === "0" || IsStringNullorEmpty($("#cboCityCountry").val())) {
        fnAlert("w", "EPS_16_00", "UI0041", errorMsg.CountrySelect_E6);
        return;
    }
    if ($("#cboStateCode").val() === 0 || $("#cboStateCode").val() === "0" || IsStringNullorEmpty($("#cboStateCode").val())) {
        fnAlert("w", "EPS_16_00", "UI0044", errorMsg.StateSelect_E7);
        return;
    }
    if (IsStringNullorEmpty($("#txtSTDCode").val()) || $("#txtSTDCode").val() == "0" ) {
        fnAlert("w", "EPS_16_00", "UI0425", errorMsg.StdCode_E10);
        return;
    }
     

    if (IsStringNullorEmpty($("#txtCityDescription").val())) {
        fnAlert("w", "EPS_16_00", "UI0045", errorMsg.CityDesc_E9);
        return;
    }

    $("#btnSaveCityCode").attr('disabled', true);
    obj = {

        Isdcode: $("#cboCityCountry").val(),
        CityCode: $("#txtCityCode").val() === '' ? 0 : $("#txtCityCode").val(),
        Stdcode: $("#txtSTDCode").val().toString(),
        //StdcodeFormat: $("#txtSTDCode").val().toString(),
        StateCode: $("#cboStateCode").val(),
        CityDesc: $("#txtCityDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveCityCode").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Address/InsertOrUpdateIntoCities',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveCityCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveCityCode").attr('disabled', false);
                fnGridRefreshCityCodes();
                $('#PopupCityCode').modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveCityCode").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCityCode").attr("disabled", false);
        }
    });
}


function fnISDCountryCode_onChange() {

    BindStatesCodes();
    fnGridLoadCityList();
}

function BindStatesCodes() {
    var IsdcCountry = $("#cboCityCountry").val();
    $("#cboStateCode").empty();
    $.ajax({
        url: getBaseURL() + '/Address/GetActiveStatesbyISDCode?isdCode=' + IsdcCountry,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboStateCode").empty();

                $("#cboStateCode").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboStateCode").append($("<option></option>").val(response[i]["StateCode"]).html(response[i]["StateDesc"]));
                }
                $('#cboStateCode').selectpicker('refresh');
            }
            else {
                $("#cboStateCode").empty();
                $("#cboStateCode").append($("<option value='0'> Select </option>"));
                $('#cboStateCode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}