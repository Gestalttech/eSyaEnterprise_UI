var Isadd = 0;
$(document).ready(function () {
    fnGridLoadInventoryRules();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnInventoryRules",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditInventoryRules(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditInventoryRules(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditInventoryRules(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadInventoryRules() {

    $("#jqgInventoryRules").jqGrid('GridUnload');
    $("#jqgInventoryRules").jqGrid({
        url: getBaseURL() + '/Admin/Rules/GetInventoryRules',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.InventoryRuleID, localization.RuleDescription, localization.RuleinDays, localization.ApplyToSRN, localization.Active, localization.Actions],
        colModel: [
            { name: "InventoryRuleId", width: 70, editable: true, align: 'left', hidden: false },
            { name: "InventoryRuleDesc", width: 170, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "InventoryRule", width: 45, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ApplyToSrn", editable: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnInventoryRules"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rownumWidth: 55,
        loadonce: false,
        pager: "#jqpInventoryRules",
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
        loadComplete: function (data) {
            SetGridControlByAction();
        },
        onSelectRow: function (rowid, status, e) {
                   },
    }).jqGrid('navGrid', '#jqpInventoryRules', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqgInventoryRules', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshInventoryRules
    }).jqGrid('navButtonAdd', '#jqpInventoryRules', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddInventoryRules
    }); fnAddGridSerialNoHeading();
}

function fnAddInventoryRules() {
    fnClearFields();
    Isadd = 1;
    $('#PopupInventoryRules').modal('show');
    $('#PopupInventoryRules').modal({ backdrop: 'static', keyboard: false });
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $('#PopupInventoryRules').find('.modal-title').text(localization.AddInventoryRules);
    $("#btnSaveInventoryRules").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveInventoryRules").show();
    $("#btnDeactivateInventoryRules").hide();
}

function fnEditInventoryRules(e, actiontype) {
    var rowid = $("#jqgInventoryRules").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgInventoryRules').jqGrid('getRowData', rowid);
    $('#cboInventoryRule').val(rowData.InventoryRuleId);
    $('#cboInventoryRule').selectpicker('refresh');
    $("#cboInventoryRule").prop('disabled', true);
    $('#cboInventoryRule').selectpicker('refresh');
    $('#txtRuleDescription').val(rowData.InventoryRuleDesc);
    $('#txtRuleInDays').val(rowData.InventoryRule);
    if (rowData.ApplyToSrn == 'true') {
        $("#chkApplyToSRN").parent().addClass("is-checked");
    }
    else {
        $("#chkApplyToSRN").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateInventoryRules").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateInventoryRules").html(localization.Activate);
    }
    $("#chkActiveStatus").prop('disabled', true);
    Isadd = 0;
    $('#PopupInventoryRules').find('.modal-title').text(localization.UpdateInventoryRules);
    $("#btnSaveInventoryRules").html('<i class="fa fa-sync"></i>' + localization.Update);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupInventoryRules').modal('show');
        $("#btnSaveInventoryRules").show();
        fnEnableInventoryRules(false);
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveInventoryRules").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveInventoryRules").attr("disabled", false);
        $("#btnSaveInventoryRules").show();
        $("#btnDeactivateInventoryRules").hide();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupInventoryRules').modal('show');
        $("#btnSaveInventoryRules,#btnDeactivateInventoryRules").hide();
        fnEnableInventoryRules(true);
        $(".modal-title").text(localization.ViewInventoryRules);

    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupInventoryRules').modal('show');
        $(".modal-title").text("Active / De Active Inventory Rules");
        fnEnableInventoryRules(true);
        $("#btnSaveInventoryRules").hide();
        $("#btnDeactivateInventoryRules").show();

    }
    $("#PopupInventoryRules").on('hidden.bs.modal', function () {
        $("#btnSaveInventoryRules").show();
        fnEnableInventoryRules(false);

    });
}

function fnSaveInventoryRules() {

    if (validateInventoryRules() === false) {
        return;
    }
    if (Isadd === 1) {
        rule = {
            InventoryRuleId: $('#cboInventoryRule').val(),
            InventoryRuleDesc: $("#txtRuleDescription").val(),
            InventoryRule: $("#txtRuleInDays").val(),
            ApplyToSrn: $("#chkApplyToSRN").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            Isadd: 1
        };

    }

    if (Isadd === 0) {
        var rule = {
            InventoryRuleId: $('#cboInventoryRule').val(),
            InventoryRuleDesc: $("#txtRuleDescription").val(),
            InventoryRule: $("#txtRuleInDays").val(),
            ApplyToSrn: $("#chkApplyToSRN").parent().hasClass("is-checked"),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            Isadd: 0
        };
    }
    $("#btnSaveInventoryRules").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Admin/Rules/InsertOrUpdateInventoryRules',
        type: 'POST',
        datatype: 'json',
        data: { rule },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveInventoryRules").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupInventoryRules').modal('hide');
                fnClearFields();
                fnGridLoadInventoryRules();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveInventoryRules").attr("disabled", false);
                return false;
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveInventoryRules").attr("disabled", false);
        }
    });
}

function validateInventoryRules() {

    if ($("#cboInventoryRule").val() === "0" || $("#cboInventoryRule").val() === '0') {
        fnAlert("w", "EAD_04_00", "UI0167", errorMsg.InventoryRule_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtRuleDescription").val())) {
        fnAlert("w", "EAD_04_00", "UI0168", errorMsg.RuleDesc_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtRuleInDays").val())) {
        fnAlert("w", "EAD_04_00", "UI0169", errorMsg.RuleInDays_E8);
        return false;
    }
}

function fnGridRefreshInventoryRules() {
    $("#jqgInventoryRules").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtRuleDescription").val("");
    $("#txtRuleInDays").val("");
    $("#chkApplyToSRN").parent().removeClass("is-checked");
    $("#cboInventoryRule").prop('disabled', false);
    $('#cboInventoryRule').val("0");
    $('#cboInventoryRule').selectpicker('refresh');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveInventoryRules").attr("disabled", false);
}

function fnEnableInventoryRules(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("input[id*='chk']").attr('disabled', val);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteInventoryRules() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateInventoryRules").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Admin/Rules/ActiveOrDeActiveInventoryRules?status=' + a_status + '&InventoryId=' + $("#cboInventoryRule").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateInventoryRules").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupInventoryRules").modal('hide');
                fnGridRefreshInventoryRules();
                fnClearFields();
                $("#btnDeactivateInventoryRules").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateInventoryRules").attr("disabled", false);
                $("#btnDeactivateInventoryRules").html(localization.DeActivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateInventoryRules").attr("disabled", false);
            $("#btnDeactivateInventoryRules").html(localization.DeActivate);
        }
    });
}


