﻿var actiontype = "";
var isUpdate = 0;
$(function () {
    fnGridLoadTriggerEvent();

    $.contextMenu({
        selector: "#btnSMSTriggerEvent",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditTriggerEvent(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditTriggerEvent(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditTriggerEvent(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + " </span>");
});

function fnGridLoadTriggerEvent() {
    $('#jqgSMSTriggerEvent').jqGrid('GridUnload');
    $("#jqgSMSTriggerEvent").jqGrid({
        url: getBaseURL() + '/Notification/GetAllSMSTriggerEvents',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TriggerEventId, localization.TriggerEventDescription, localization.MaxSequenceNumber, localization.Active, localization.Actions],
        colModel: [
            { name: "TEventID", width: 45, editable: true, align: 'left', editoptions: { maxlength: 8 } },
            { name: "TEventDesc", width: 108, editable: true, align: 'left', editoptions: { maxlength: 150 } },
            { name: "MaxSequenceNumber", width: 48, editable: true, align: 'left', editoptions: { maxlength: 150 } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSMSTriggerEvent"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSMSTriggerEvent",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
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
        caption: localization.SMSTriggerEvent,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgSMSTriggerEvent");
        },

        onSelectRow: function (rowid, status, e) {
        },

    }).jqGrid('navGrid', '#jqpSMSTriggerEvent', {
        add: false, edit: false, search: false, del: false, refresh: false
    }).jqGrid('navButtonAdd', '#jqpSMSTriggerEvent', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshTriggerEvent
    }).jqGrid('navButtonAdd', '#jqpSMSTriggerEvent', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTriggerEvent
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshTriggerEvent() {
    $("#jqgSMSTriggerEvent").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtTriggerEventId").val('');
    $("#txtMaxSequenceNumber").val('');
    $("#txtTriggerEventdesc").val('');
    $('#chkActiveStatus').parent().addClass("is-checked");
    $("#btnSaveTriggerEvent").attr('disabled', false);
}

function fnAddTriggerEvent() {
    fnClearFields();
    $("#PopupSMSTriggerEvent").modal('show');
    $('#PopupSMSTriggerEvent').find('.modal-title').text(localization.AddTriggerEvent);
    $("#btnSaveTriggerEvent").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnCancelTriggerEvent").html('<i class="fa fa-times"></i> ' + localization.Cancel);
    $("#txtTriggerEventId").attr('readonly', false);
    $("#txtMaxSequenceNumber").attr('readonly', false);
    isUpdate = 0;
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveTriggerEvent").show();
    $("#btnDeactivateTriggerEvent").hide();
}

function fnEditTriggerEvent(e, actiontype) {

    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgSMSTriggerEvent').jqGrid('getRowData', rowid);
    var rowid = $("#jqgSMSTriggerEvent").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSMSTriggerEvent').jqGrid('getRowData', rowid);
    $('#txtTriggerEventId').val(rowData.TEventID).attr('readonly', true);
    $('#txtTriggerEventdesc').val(rowData.TEventDesc);
    $('#txtMaxSequenceNumber').val(rowData.MaxSequenceNumber);
    if (rowData.ActiveStatus === 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateTriggerEvent").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateTriggerEvent").html(localization.Activate);
    }

    $("#btnSaveTriggerEvent").attr('disabled', false);
    isUpdate = 1;
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupSMSTriggerEvent").modal('show');
        $('#PopupSMSTriggerEvent').find('.modal-title').text(localization.EditTriggerEvent);
        $("#btnSaveTriggerEvent").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnCancelTriggerEvent").html('<i class="fa fa-times"></i> ' + localization.Cancel);
        $("#btnSaveTriggerEvent").show();
        $("#btnDeactivateTriggerEvent").hide();
        $("#chkActiveStatus").attr('disabled', true);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#PopupSMSTriggerEvent").modal('show');
        $('#PopupSMSTriggerEvent').find('.modal-title').text(localization.ViewTriggerEvent);
        $("#btnSaveTriggerEvent,#btnDeactivateTriggerEvent").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSTriggerEvent").on('hidden.bs.modal', function () {
            $("#btnSaveTriggerEvent").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#PopupSMSTriggerEvent").modal('show');
        $('#PopupSMSTriggerEvent').find('.modal-title').text("Active /Deactive Trigger Event");
        $("#btnSaveTriggerEvent").hide();
        $("#btnDeactivateTriggerEvent").show();
        $("input,textarea").attr('readonly', true);
        $("#chkActiveStatus").attr('disabled', true);
        $("#PopupSMSTriggerEvent").on('hidden.bs.modal', function () {
            $("#btnSaveTriggerEvent").show();
            $("input,textarea").attr('readonly', false);
            $("#chkActiveStatus").attr('disabled', false);
        });
    }
}

function fnSaveTriggerEvent() {

    if (IsStringNullorEmpty($("#txtTriggerEventId").val())) {
        fnAlert("w", "ESE_02_00", "UI0100", errorMsg.TriggerEvent_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtTriggerEventdesc").val())) {
        fnAlert("w", "ESE_02_00", "UI0101", errorMsg.TriggerEventDesc_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtMaxSequenceNumber").val())) {
        fnAlert("w", "ESE_02_00", "UI0455", errorMsg.MaxSequenceNumber_E8);
        return false;
    }
    var obj = {
        TEventID: $("#txtTriggerEventId").val(),
        TEventDesc: $("#txtTriggerEventdesc").val(),
        MaxSequenceNumber: $("#txtMaxSequenceNumber").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/Notification/InsertIntoSMSTriggerEvent';
    if (isUpdate == 1) {
        URL = getBaseURL() + '/Notification/UpdateSMSTriggerEvent';
    }
    $("#btnSaveTriggerEvent").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveTriggerEvent").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshTriggerEvent();
                $("#PopupSMSTriggerEvent").modal('hide');

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveTriggerEvent").attr('disabled', false);
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveTriggerEvent").attr("disabled", false);
        }
    });
}

function fnAllowNumbersOnly(input) {
    let value = input.value;
    let numbers = value.replace(/[^0-9]/g, "");
    input.value = numbers;
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteTriggerEvent() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateTriggerEvent").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Notification/ActiveOrDeActiveSMSTriggerEvent?status=' + a_status + '&TriggerEventId=' + $("#txtTriggerEventId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateTriggerEvent").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshTriggerEvent();
                $("#PopupSMSTriggerEvent").modal('hide');
                fnClearFields();
                $("#btnDeactivateTriggerEvent").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateTriggerEvent").attr("disabled", false);
                $("#btnDeactivateTriggerEvent").html(localization.DeActivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateTriggerEvent").attr("disabled", false);
            $("#btnDeactivateTriggerEvent").html(localization.DeActivate);
        }
    });
}