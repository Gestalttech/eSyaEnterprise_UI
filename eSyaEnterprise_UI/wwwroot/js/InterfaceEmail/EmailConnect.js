$(function () {
    fnLoadGridEmailConnect();
    $.contextMenu({
        selector: "#btnEmailConnect",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditEmailConnect(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditEmailConnect(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditEmailConnect(event, 'delete') } },
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

    fnLoadGridEmailConnect();
    BindLocationsbyBusinessID();
}

function fnLoadGridEmailConnect() {
    $("#jqgEmailConnect").jqGrid('GridUnload');
    $("#jqgEmailConnect").jqGrid({
        url: getBaseURL() + '/Connect/GetEmailConnectbyBusinessID?BusinessId=' + $("#cboBusinessEntity").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessLocation, localization.ISDCode, localization.OutgoingMailServer, localization.Port, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden: false },
            { name: "ISDCode", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "OutgoingMailServer", width: 170, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Port", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnEmailConnect"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            }
        ],
        pager: "#jqpEmailConnect",
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
        caption: localization.EmailConnect,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgEmailConnect");
        },
    }).jqGrid('navGrid', '#jqpEmailConnect', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEmailConnect', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmailConnect
    }).jqGrid('navButtonAdd', '#jqpEmailConnect', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmailConnect
    });
    fnAddGridSerialNoHeading();
}
function fnBusinessKeyOnchange() {

    fnGetISDCodeByBusinessKey();
}

function BindLocationsbyBusinessID() {

    $("#cboBusinessKey").empty();
    $.ajax({
        url: getBaseURL() + '/Connect/GetBusinessLocationByBusinessID?BusinessId=' + $("#cboBusinessEntity").val(),
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
        url: getBaseURL() + '/Connect/GetLocationISDCodeByBusinessKey?BusinessKey=' + $("#cboBusinessKey").val(),
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
function fnAddEmailConnect() {
    if ($("#cboBusinessEntity").val() === "0" || $("#cboBusinessEntity").val() === "") {
        fnAlert("w", "EIF_02_00", "UI0049", errorMsg.BusinessEntity_E15);
        return false;
    }

    fnClearFields();
    BindLocationsbyBusinessID();
    $("#cbolocISD").val('0').selectpicker('refresh');
    $("#cbolocISD").trigger("change");
    $("#txtOutgoingMailServer").attr('readonly', false);
    $("#txtPort").attr('readonly', false);
    $('#PopupEmailConnect').modal('show');
    $('#PopupEmailConnect').modal({ backdrop: 'static', keyboard: false });
    $('#PopupEmailConnect').find('.modal-title').text(localization.AddEmailConnect);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btndeActiveEmailConnect").hide();
    $("#btnSaveEmailConnect").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnEditEmailConnect(e, actiontype) {

    var rowid = $("#jqgEmailConnect").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgEmailConnect').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);

    BindLocationsbyBusinessID();
    $("#cboBusinessKey").val(rowData.BusinessKey);
    $("#cboBusinessKey").selectpicker('refresh');
    fnGetISDCodeByBusinessKey();
    $('#txtOutgoingMailServer').val(rowData.OutgoingMailServer);
    $('#txtPort').val(rowData.Port);
    $('#locISD').val(rowData.ISDCode).selectpicker('refresh');
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }



    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EIF_02_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupEmailConnect').modal('show').css({ top: firstRow.top + 31 });
        $('#PopupEmailConnect').find('.modal-title').text(localization.UpdateEmailConnect);
        $("#btnSaveEmailConnect").html('<i class="fa fa-sync mr-1"></i>' + localization.Update);
        $("#chkActiveStatus").prop('disabled', true);

        $("#btndeActiveEmailConnect").hide();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveEmailConnect").show();
        $("#txtOutgoingMailServer").attr('readonly', true);
        $("#cboBusinessKey").next().attr('disabled', true);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EIF_02_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupEmailConnect').modal('show');
        $('#PopupEmailConnect').find('.modal-title').text(localization.ViewEmailConnect);
        $("#btnSaveEmailConnect").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveEmailConnect").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btndeActiveEmailConnect").hide();
        $("#PopupEmailConnect").on('hidden.bs.modal', function () {
            $("#btnSaveEmailConnect").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_17_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }

        $('#PopupEmailConnect').modal('show');
        $('#PopupEmailConnect').find('.modal-title').text("Activate/De Activate Busienss Location");
        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveEmailConnect").html(localization.DActivate);
        }
        else {
            $("#btndeActiveEmailConnect").html('Activate');
            $("#btndeActiveEmailConnect").html(localization.Activate);
        }
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveEmailConnect").hide();

        $("#btndeActiveEmailConnect").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupEmailConnect").on('hidden.bs.modal', function () {
            $("#btnSaveEmailConnect").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveEmailConnect() {

    if (fnValidateEmailConnect() === false) {
        return;
    }
    else {
        obj = {
            BusinessKey: $("#cboBusinessKey").val(),
            OutgoingMailServer: $("#txtOutgoingMailServer").val(),
            Port: $("#txtPort").val(),
            ISDCode: $("#cbolocISD").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),

        }
        $("#btnSaveEmailConnect").attr('disabled', true);
        $.ajax({
            url: getBaseURL() + '/Connect/InsertOrUpdateEmailConnect',
            type: 'POST',
            datatype: 'json',
            data: { obj },
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#btnSaveEmailConnect").html('<i class="fa fa-spinner fa-spin"></i> wait');

                    $("#btnSaveEmailConnect").attr('disabled', false);
                    fnGridRefreshEmailConnect();
                    $('#PopupEmailConnect').modal('hide');
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveEmailConnect").attr('disabled', false);
                }
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveEmailConnect").attr("disabled", false);
            }
        });
    }
}
function fnGridRefreshEmailConnect() {
    $("#jqgEmailConnect").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnValidateEmailConnect() {
    if ($("#cboBusinessKey").val() === "0" || $("#cboBusinessKey").val() === "") {
        fnAlert("w", "EIF_02_00", "UI0064", errorMsg.BusinessLocation_E6);
        return false;
    }


    if (IsStringNullorEmpty($("#txtOutgoingMailServer").val())) {
        fnAlert("w", "EIF_02_00", "UI0211", errorMsg.OutgoingMailServer_E16);
        return false;
    }
    if (IsStringNullorEmpty($("#txtPort").val())) {
        fnAlert("w", "EIF_02_00", "UI0212", errorMsg.Port_E17);
        return false;
    }



}

function fnClearFields() {
    $("#cboBusinessKey").val('0').selectpicker('refresh');
    $("#cbolocISD").val('0').selectpicker('refresh');
    $("#cbolocISD").trigger("change");
    $('#txtOutgoingMailServer').val('');
    $('#txtPort').val('');
    $("#cboBusinessEntity").next().attr('disabled', false);
    $("#txtOutgoingMailServer").attr('readonly', false);
    $("#cboBusinessKey").next().attr('disabled', false);
}


function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

$("#btnCancelEmailConnect").click(function () {
    fnClearFields();
    $("#jqgEmailConnect").jqGrid('resetSelection');
    $('#PopupEmailConnect').modal('hide');
    $("#cboBusinessEntity").next().attr('disabled', false);
});

function fnDeleteEmailConnect() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveEmailConnect").attr("disabled", true);

    objdel = {
        BusinessKey: $("#cboBusinessKey").val(),
        OutgoingMailServer: $("#txtOutgoingMailServer").val(),
        Port: $("#txtPort").val(),
        ISDCode: $("#cbolocISD").val(),
        status: a_status
    }
    $.ajax({
        url: getBaseURL() + '/Connect/ActiveOrDeActiveEmailConnect',
        type: 'POST',
        datatype: 'json',
        data: { status: a_status, obj: objdel },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                //$("#btndeActiveEmailConnect").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupEmailConnect').modal('hide');
                fnClearFields();
                fnGridRefreshEmailConnect();
                $("#btndeActiveEmailConnect").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveEmailConnect").attr("disabled", false);
                $("#btndeActiveEmailConnect").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveEmailConnect").attr("disabled", false);
            $("#btndeActiveEmailConnect").html('De Activate');
        }
    });
}