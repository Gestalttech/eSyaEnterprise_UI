﻿var isInsert = 0;

$(document).ready(function () {
    fnGridLoadTaxIdentification();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnTaxIdentification",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditTaxIdentification(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditTaxIdentification(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditTaxIdentification(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});


function fnISDCountryCode_onChange() {
    fnGridLoadTaxIdentification();
}
function fnGridLoadTaxIdentification() {
    var ISDCode = $("#cboCountryCode").val();
    var URL = getBaseURL() + '/Country/GetTaxIdentificationByISDCode?ISDCode=' + ISDCode;
    $("#jqgTaxIdentification").jqGrid('GridUnload');
    $("#jqgTaxIdentification").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["ISD Code", localization.TaxIdentificationID, localization.TaxIdentificationDescription, localization.StateCode, localization.IsUt, localization.Active, localization.Actions],
        colModel: [
            { name: "Isdcode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "TaxIdentificationId", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "TaxIdentificationDesc", editable: true, width: 120, align: 'left', resizable: false },
            { name: "StateCode", editable: true, width: 60, align: 'left', resizable: false },
            { name: "IsUt", editable: true, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnTaxIdentification"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpTaxIdentification",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
        forceFit: true, caption:localization.TaxIdentification,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgTaxIdentification");
        },
        onSelectRow: function (rowid, status, e) {
            },
    }).jqGrid('navGrid', '#jqpTaxIdentification', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpTaxIdentification', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshTaxIdentification
    }).jqGrid('navButtonAdd', '#jqpTaxIdentification', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddTaxIdentification
        });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}

function fnGridAddTaxIdentification() {
    fnClearFields();
    var id = $("#cboCountryCode").val();
    if (id == 0) {
        fnAlert("w", "EPS_19_00", "UI0056", errorMsg.ISDCode_E6);
    }
    else {
        isInsert = 0;
        $('#PopupTaxIdentification').modal('show');
        $('#PopupTaxIdentification').modal({ backdrop: 'static', keyboard: false });
        $('#PopupTaxIdentification').find('.modal-title').text(localization.AddTaxIdentification);
        fnClearFields();
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTaxIdentification").show();
        $("#btnDeactivateTaxIdentification").hide();
        $("#btnSaveTaxIdentification").html('<i class="fa fa-save"></i> '+localization.Save);
    }
}

function fnGridRefreshTaxIdentification() {
    $("#jqgTaxIdentification").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditTaxIdentification(e, actiontype) {
    var rowid = $("#jqgTaxIdentification").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgTaxIdentification').jqGrid('getRowData', rowid);
    fnClearFields();
    $('#txtTaxIdentificationID').val(rowData.TaxIdentificationId);
    $("#txtTaxDescription").val(rowData.TaxIdentificationDesc);
    $("#txtStateCode").val(rowData.StateCode); 
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if (rowData.IsUt === "true") {
        $("#chkIsUT").parent().addClass("is-checked");
    }
    else {
        $("#chkIsUT").parent().removeClass("is-checked");
    }
    $("select").next().attr('disabled', true);
    $("#btnSaveTaxIdentification").attr('disabled', false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_19_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupTaxIdentification').modal('show');

        isInsert = 1;
        
        $("#txtTaxIdentificationID").attr('readonly', true);
        $('#PopupTaxIdentification').find('.modal-title').text(localization.EditTaxIdentification);
        $("#btnSaveTaxIdentification").html('<i class="fa fa-sync"></i> '+localization.Update);
        fnEnableControl(false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTaxIdentification").show();
        $("#btnDeactivateTaxIdentification").hide();
        $("#txtTaxIdentificationID").attr('readonly', true);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_19_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupTaxIdentification').modal('show');

        $('#PopupTaxIdentification').find('.modal-title').text(localization.ViewTaxIdentification);
        $("#btnSaveTaxIdentification").hide();
        $("#btnDeactivateTaxIdentification").hide();
        fnEnableControl(true);
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_19_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupTaxIdentification').modal('show');

        $('#PopupTaxIdentification').find('.modal-title').text("Active/De Active TaxIdentification");
        $("#btnSaveTaxIdentification").hide();
        
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateTaxIdentification").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateTaxIdentification").html(localization.Activate);
        }
        $("#btnDeactivateTaxIdentification").show();
        fnEnableControl(true);
    }
    $("#PopupTaxIdentification").on('hidden.bs.modal', function () {
        $("#btnSaveTaxIdentification").show();
        fnEnableControl(false);
    })
}

function fnEnableControl(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("#chkIsSplitApplicable").attr('disabled', val);
    $("select").next().attr('disabled', val);
}

function fnSaveTaxIdentification() {
    debugger;
    if (validateTaxIdentification() === false) {
        return;
    }

    $("#btnSaveTaxIdentification").attr('disabled', true);

    var tax_Ident = {
        Isdcode: $("#cboCountryCode").val(),
        TaxIdentificationId: $("#txtTaxIdentificationID").val(),
        TaxIdentificationDesc: $("#txtTaxDescription").val(),
        StateCode:$("#txtStateCode").val(),
        InsertStatus: isInsert,
        IsUt: $("#chkIsUT").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }

    $.ajax({
        url: getBaseURL() + '/Country/InsertOrUpdateTaxIdentification',
        type: 'POST',
        datatype: 'json',
        data: { tax_Ident },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveTaxIdentification").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshTaxIdentification();
                $("#btnSaveTaxIdentification").attr('disabled', false);
                $("#PopupTaxIdentification").modal('hide');

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveTaxIdentification").attr('disabled', false);
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveTaxIdentification").attr("disabled", false);
        }
    });
}

function validateTaxIdentification() {
    if (IsStringNullorEmpty($("#txtTaxIdentificationID").val()) || $("#txtTaxIdentificationID").val() == "0") {
        fnAlert("w", "EPS_19_00", "UI0065", errorMsg.TaxIdentification_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtTaxDescription").val())) {
        fnAlert("w", "EPS_19_00", "UI0066", errorMsg.TaxIdentificationDesc_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#txtStateCode").val())) {
        fnAlert("w", "EPS_19_00", "UI0067", errorMsg.StateCode_E9);
        return false;
    } 
    
}

function fnClearFields() {
    $("#txtTaxIdentificationID").val("");
    $("#txtTaxDescription").val("");
    $("#txtStateCode").val("");
    //$("#cboTaxDescription").val("P").selectpicker('refresh');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveTaxIdentification").attr('disabled', false);
    $("select").next().attr('disabled', false);
    fnEnableControl(false);
}

function fnDeleteTaxIdentification() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateTaxIdentification").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Country/ActiveOrDeActiveTaxIdentification?status=' + a_status + '&Isd_code=' + $("#cboCountryCode").val() + '&TaxIdentificationId=' + $("#txtTaxIdentificationID").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateTaxIdentification").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupTaxIdentification').modal('hide');
                fnClearFields();
                fnGridRefreshTaxIdentification();
                $("#btnDeactivateTaxIdentification").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateTaxIdentification").attr("disabled", false);
                $("#btnDeactivateTaxIdentification").html(localization.DeActivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateTaxIdentification").attr("disabled", false);
            $("#btnDeactivateTaxIdentification").html(localization.DeActivate);
        }
    });
}