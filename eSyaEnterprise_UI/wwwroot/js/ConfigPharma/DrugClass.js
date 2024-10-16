﻿
$(document).ready(function () {
    fnGridLoadDrugClass();
    $.contextMenu({
        selector: "#btnDrugClass",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugClass(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDrugClass(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDrugClass(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
var actiontype = "";
var _isInsert = true;
function fnGridLoadDrugClass() {
    $("#jqgDrugClass").jqGrid('GridUnload');
    $("#jqgDrugClass").jqGrid({
        url: getBaseURL() + '/DrugClass/GetAllDrugClass',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DrugClass, localization.DrugClassDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "DrugClass", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DrugClassDesc", width: 250, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', formatoptions: { disabled: true }, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnDrugClass"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            },],
        pager: "#jpgDrugClass",
        rowList:[10,20,50,100],
        rowNum: 10,
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
        scrollOffset: 0, caption: localization.DrugClass,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgDrugClass");
        },
    }).jqGrid('navGrid', '#jpgDrugClass', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jpgDrugClass', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDrugClass
    }).jqGrid('navButtonAdd', '#jpgDrugClass', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDrugClass
    });
    fnAddGridSerialNoHeading();
}

function fnAddDrugClass() {
    fnClearFieldsDrugClass();
    _isInsert = true;
    $('#PopupDrugClass').modal('show');
    $("#txtDrugClass").val("");
    $("#btnSaveDrugClass").show();
    $("#btnSaveDrugClass").html(localization.Save);
    $("#btnDeactivateDrugClass").hide();
    $('#PopupDrugClass').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDrugClass').find('.modal-title').text(localization.AddDrugClass);
    $("#chkActiveStatus").parent().addClass("is-checked");
}
function fnEditDrugClass(e, actiontype) {
    var rowid = $("#jqgDrugClass").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugClass').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);

    $('#txtDrugClass').val(rowData.DrugClass);
    
    $("#txtDrugClassDescription").val(rowData.DrugClassDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDrugClass").attr('disabled', false);

    _isInsert = false;
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPH_02_00", "UIC02", errorMsg.editauth_E3);
            return;
        }
        $('#PopupDrugClass').modal('show').css({ top: firstRow.top + 31 });
        $('#PopupDrugClass').find('.modal-title').text(localization.UpdateDrugClass);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDrugClass").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactivateDrugClass").hide();
        $("input,textarea").attr('readonly', false);
        $("#btnSaveDrugClass").show();
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPH_02_00", "UIC03", errorMsg.vieweauth_E4);
            return;
        }
        $('#PopupDrugClass').modal('show');
        $('#PopupDrugClass').find('.modal-title').text(localization.ViewDrugClass);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDrugClass,#btnDeactivateDrugClass").hide();
        $("input,textarea").attr('readonly', true);

    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPH_02_00", "UIC04", errorMsg.deleteauth_E5);
            return;
        }
        $('#PopupDrugClass').modal('show');
        $('#PopupDrugClass').find('.modal-title').text(localization.ActiveDeactiveDrugClass);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateDrugClass").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateDrugClass").html('Activate');
            $("#btnDeactivateDrugClass").html(localization.Activate);
        }
        $("#btnSaveDrugClass").hide();
        $("#btnDeactivateDrugClass").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }

}


function fnSaveDrugClass() {
    if (IsStringNullorEmpty($("#txtDrugClassDescription").val())) {
        fnAlert("w", "EPH_02_00", "UI0289", errorMsg.DrugClassDesc_E1);
        return;
    }
     
    
    $("#btnSaveDrugClass").attr('disabled', true);
    drug_codes = {
        DrugClass: $("#txtDrugClass").val() === '' ? 0 : $("#txtDrugClass").val(),
        DrugClassDesc: $("#txtDrugClassDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveDrugClass").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/DrugClass/InsertOrUpdateDrugClass',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: drug_codes },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveDrugClass").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveDrugClass").attr('disabled', false);
                fnGridRefreshDrugClass();
                $('#PopupDrugClass').modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDrugClass").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDrugClass").attr("disabled", false);
        }
    });
}

function fnGridRefreshDrugClass() {
    $("#jqgDrugClass").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelDrugClass").click(function () {
    fnClearFieldsDrugClass();
    $("#jqgDrugClass").jqGrid('resetSelection');
    $('#PopupDrugClass').modal('hide');
});




function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnClearFieldsDrugClass() {
    $("#txtDrugClassDescription").val("");
    $("#txtDrugClass").val("");
    $("#btnSaveDrugClass").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
}


function fnDeleteDrugClass() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateDrugClass").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/DrugClass/ActiveOrDeActiveDrugClass?status=' + a_status + '&drugclassId=' + $("#txtDrugClass").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateDrugClass").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDrugClass').modal('hide');
                fnClearFieldsDrugClass();
                fnGridRefreshDrugClass();
                $("#btnDeactivateDrugClass").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateDrugClass").attr("disabled", false);
                $("#btnDeactivateDrugClass").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateDrugClass").attr("disabled", false);
            $("#btnDeactivateDrugClass").html('De Activate');
        }
    });
}