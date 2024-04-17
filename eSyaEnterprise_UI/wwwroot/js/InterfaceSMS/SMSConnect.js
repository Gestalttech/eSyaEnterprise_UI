var isEdit = 0;
$(function () {
    fnLoadGridSMSConnect();
    var dateToday = new Date();
    $("#txtEffectiveFRMDate").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $("#txtEffectiveTillDate").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });


    $.contextMenu({
        selector: "#btnSMSConnect",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditSMSConnect(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditSMSConnect(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditSMSConnect(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

    $("#cbolocISD").attr('disabled', true);

});
function fnISDCountryCode_onChange() {

}
function fnEntityOnchange() {

    fnLoadGridSMSConnect();
    BindLocationsbyBusinessID();
}
function fnLoadGridSMSConnect() {
    $("#jqgSMSConnect").jqGrid('GridUnload');
    $("#jqgSMSConnect").jqGrid({
        url: getBaseURL() + '/Connect/GetSMSConnectbyBusinessID?BusinessId=' + $("#cboBusinessEntity").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessLocation, localization.ServiceProvider, localization.ISDCode, localization.Api, localization.UserId, localization.Password, localization.SenderId, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ServiceProvider", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ISDCode", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Api", width: 170, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "UserId", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Password", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "SenderId", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            {
                name: "EffectiveFrom", index: 'FromDate', width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", index: 'TillDate', width: 40, hidden: true, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },

            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnSMSConnect"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            }

        ],
        pager: "#jqpSMSConnect",
        rowNum: 10000,
        rownumWidth: '55',
        pgtext: null,
        pgbuttons: null,
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
        caption: localization.SMSConnect,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgSMSConnect");
        },
    }).jqGrid('navGrid', '#jqpSMSConnect', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSConnect', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSMSConnect
    }).jqGrid('navButtonAdd', '#jqpSMSConnect', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSConnect
    });
    fnAddGridSerialNoHeading();
}

function fnBusinessKeyOnchange() {

    fnGetISDCodeByBusinessKey();
}

function BindLocationsbyBusinessID() {

    $("#cboBusinessKey").empty();
    $.ajax({
        url: getBaseURL() + '/InterfaceSMS/Connect/GetBusinessLocationByBusinessID?BusinessId=' + $("#cboBusinessEntity").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboBusinessKey").empty();

                $("#cboBusinessKey").append($("<option value='0'> Choose Business Location </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboBusinessKey").append($("<option></option>").val(response[i]["BusinessKey"]).html(response[i]["LocationDescription"]));
                }
                $('#cboBusinessKey').selectpicker('refresh');
            }
            else {
                $("#cboBusinessKey").empty();
                $("#cboBusinessKey").append($("<option value='0'> Choose Business Location </option>"));
                $('#cboBusinessKey').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function fnGetISDCodeByBusinessKey() {

    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/InterfaceSMS/Connect/GetLocationISDCodeByBusinessKey?BusinessKey=' + $("#cboBusinessKey").val(),
        success: function (response) {
            if (response !== null) {
               
                $("#cbolocISD").val(response.Isdcode);
                $("#cbolocISD").selectpicker('refresh');
                $("#cbolocISD").trigger("change");
            }
            else {
                $("#cbolocISD").val('0').selectpicker('refresh');
                $("#cbolocISD").trigger("change");
            }
        },
        error: function (response) {
        }
    });
}

function fnAddSMSConnect() {
    if ($("#cboBusinessEntity").val() === "0" || $("#cboBusinessEntity").val() === "") {
        fnAlert("w", "EIF_01_00", "UI0213", errorMsg.BusinessEntity_E16);
        return false;
    }
    isEdit = 0;
    fnClearFields();
    BindLocationsbyBusinessID();
    $("#cbolocISD").val('0').selectpicker('refresh');
    $("#cbolocISD").trigger("change");
    document.getElementById("txtEffectiveFRMDate").disabled = false;
    $("#txtServiceProvider").attr('readonly', false);
    $('#PopupSMSConnect').modal('show');
    $('#PopupSMSConnect').modal({ backdrop: 'static', keyboard: false });
    $('#PopupSMSConnect').find('.modal-title').text(localization.AddSMS);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveSMSConnect").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveSMSConnect").show();
    $("#btndeActiveSMSConnect").hide();
    $("#chkActiveStatus").prop('disabled', true);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    document.getElementById("txtEffectiveFRMDate").disabled = false;
}

function fnEditSMSConnect(e, actiontype) {

    var rowid = $("#jqgSMSConnect").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSMSConnect').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);

    isEdit = 1;
    BindLocationsbyBusinessID();
    $("#cboBusinessKey").val(rowData.BusinessKey);
    $("#cboBusinessKey").selectpicker('refresh');
    fnGetISDCodeByBusinessKey();
    $("#txtServiceProvider").val(rowData.ServiceProvider);
    $("#txtAPI").val(rowData.Api);
    $("#txtUserID").val(rowData.UserId);
    $("#txtPassword").val(rowData.Password);
    $("#txtSenderID").val(rowData.SenderId);
    if (rowData.EffectiveFrom !== null) {
        setDate($('#txtEffectiveFRMDate'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#txtEffectiveFRMDate').val('');
    }
    document.getElementById("txtEffectiveFRMDate").disabled = true;
    if (rowData.EffectiveTill !== null) {
        setDate($('#txtEffectiveTillDate'), fnGetDateFormat(rowData.EffectiveTill));
    }
    else {
        $('#txtEffectiveTillDate').val('');
    }

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EIF_01_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupSMSConnect').modal('show').css({ top: firstRow.top + 31 });

        $('#PopupSMSConnect').find('.modal-title').text(localization.UpdateSMSConnect);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveSMSConnect").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btndeActiveSMSConnect").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveSMSConnect").show();
        document.getElementById("txtEffectiveFRMDate").disabled = true;
        $("#txtServiceProvider").attr('readonly', true);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EIF_01_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupSMSConnect').modal('show');
        $('#PopupSMSConnect').find('.modal-title').text(localization.ViewSMSConnect);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveSMSConnect,#btndeActiveSMSConnect").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EIF_01_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupSMSConnect').modal('show');
        $('#PopupSMSConnect').find('.modal-title').text("Active/De Active Application Codes");
        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveSMSConnect").html(localization.DActivate);
        }
        else {
            $("#btndeActiveSMSConnect").html('Activate');
            $("#btndeActiveSMSConnect").html(localization.Activate);
        }
        $("#btnSaveSMSConnect").hide();
        $("#btndeActiveSMSConnect").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);


    }
}

function fnSaveSMSConnect() {

    if (fnValidateSMSConnect() === false) {
        return;
    }
    else {
        obj = {
            BusinessKey: $("#cboBusinessKey").val(),
            ServiceProvider: $("#txtServiceProvider").val(),
            EffectiveFrom: getDate($("#txtEffectiveFRMDate")),
            EffectiveTill: getDate($("#txtEffectiveTillDate")),
            Api: $('#txtAPI').val(),
            UserId: $("#txtUserID").val(),
            Password: $("#txtPassword").val(),
            SenderId: $("#txtSenderID").val(),
            ISDCode: $("#cbolocISD").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            isEdit: isEdit
        }
        $("#btnSaveSMSConnect").attr('disabled', true);
        $.ajax({
            url: getBaseURL() + '/Connect/InsertOrUpdateSMSConnect',
            type: 'POST',
            datatype: 'json',
            data: { obj },
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#btnSaveSMSConnect").html('<i class="fa fa-spinner fa-spin"></i> wait');
                    $("#btnSaveSMSConnect").attr('disabled', false);
                    fnGridRefreshSMSConnect();
                    $('#PopupSMSConnect').modal('hide');
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveSMSConnect").attr('disabled', false);
                }
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveSMSConnect").attr("disabled", false);
            }
        });
    }
}

function fnGridRefreshSMSConnect() {
    $("#jqgSMSConnect").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

}

function fnValidateSMSConnect() {

    if ($("#cboBusinessKey").val() === "0" || $("#cboBusinessKey").val() === "") {
        fnAlert("w", "EIF_01_00", "UI0064", errorMsg.BusinessLocation_E6);
        return false;
    }

    if (IsStringNullorEmpty($("#txtServiceProvider").val())) {
        fnAlert("w", "EIF_01_00", "UI0210", errorMsg.ServiceProvider_E7);
        return false;
    }

    if (IsStringNullorEmpty($("#txtAPI").val())) {
        fnAlert("w", "EIF_01_00", "UI0207", errorMsg.Api_E10);
        return false;
    }
    if (IsStringNullorEmpty($("#txtUserID").val())) {
        fnAlert("w", "EIF_01_00", "UI00208", errorMsg.UserId_E11);
        return false;
    }
    if (IsStringNullorEmpty($("#txtPassword").val())) {
        fnAlert("w", "EIF_01_00", "UI0136", errorMsg.Password_E12);
        return false;
    }
    if (IsStringNullorEmpty($("#txtSenderID").val())) {
        fnAlert("w", "EIF_01_00", "UI0209", errorMsg.SenderId_E13);
        return false;
    }
    if (IsStringNullorEmpty($("#txtEffectiveFRMDate").val())) {
        fnAlert("w", "EIF_01_00", "UI0070", errorMsg.FromDate_E8);
        return false;
    }



}

function fnClearFields() {
    $("#cboBusinessKey").val('0').selectpicker('refresh');
    $("#cbolocISD").val('0').selectpicker('refresh');
    $("#cbolocISD").trigger("change");
    document.getElementById("txtEffectiveFRMDate").disabled = false;
    $("#txtServiceProvider").attr('readonly', false);
    $('#cboBusinessKey').val('');
    $('#txtServiceProvider').val('');
    $('#txtAPI').val('');
    $('#txtUserID').val('');
    $('#txtPassword').val('');
    $('#txtSenderID').val('');
    $('#txtEffectiveFRMDate').val('');
    $('#txtEffectiveTillDate').val('');
    $("#cboBusinessEntity").next().attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

$("#btnCancelSMSConnect").click(function () {
    fnClearFields();
    $("#jqgSMSConnect").jqGrid('resetSelection');
    $('#PopupSMSConnect').modal('hide');
    $("#cboBusinessEntity").next().attr('disabled', false);
});

function fnDeleteSMSConnect() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveSMSConnect").attr("disabled", true);
    objdel = {
        BusinessKey: $("#cboBusinessKey").val(),
        ServiceProvider: $("#txtServiceProvider").val(),
        EffectiveFrom: getDate($("#txtEffectiveFRMDate")),
        EffectiveTill: getDate($("#txtEffectiveTillDate")),
        Api: $('#txtAPI').val(),
        UserId: $("#txtUserID").val(),
        Password: $("#txtPassword").val(),
        SenderId: $("#txtSenderID").val(),
        ISDCode: $("#cbolocISD").val(),
    }
    $.ajax({
        url: getBaseURL() + '/Connect/ActiveOrDeActiveSMSConnect',
        type: 'POST',
        datatype: 'json',
        data: { status: a_status, obj: objdel },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveSMSConnect").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupSMSConnect').modal('hide');
                fnClearFields();
                fnGridRefreshSMSConnect();
                $("#btndeActiveSMSConnect").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveSMSConnect").attr("disabled", false);
                $("#btndeActiveSMSConnect").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveSMSConnect").attr("disabled", false);
            $("#btndeActiveSMSConnect").html('De Activate');
        }
    });
}