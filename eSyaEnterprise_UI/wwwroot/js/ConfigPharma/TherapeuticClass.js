﻿
$(function () {
    fnGridLoadTherapeuticClass();
    $.contextMenu({
        selector: "#btnTherapeuticClass",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditTherapeuticClass(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditTherapeuticClass(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditTherapeuticClass(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + " </span>");
});
var actiontype = "";
var _isInsert = true;
function fnGridLoadTherapeuticClass() {
    $("#jqgTherapeuticClass").jqGrid('GridUnload');
    $("#jqgTherapeuticClass").jqGrid({
        url: getBaseURL() + '/DrugClass/GetAllDrugTherapeutics',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.TherapeuticClass, localization.TherapeuticClassDesc, localization.Active, localization.Actions],
        colModel: [
            { name: "DrugTherapeutic", width: 50, editable: true, align: 'left', hidden: true },
            { name: "DrugTherapeuticDesc", width: 250, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', formatoptions: { disabled: true }, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnTherapeuticClass"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            },],
        pager: "#jpgTherapeuticClass",
        rowList: [10, 20, 50, 100],
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
        scrollOffset: 0, caption: localization.TherapeuticClass,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgTherapeuticClass");
        },
    }).jqGrid('navGrid', '#jpgTherapeuticClass', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jpgTherapeuticClass', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshTherapeuticClass
    }).jqGrid('navButtonAdd', '#jpgTherapeuticClass', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddTherapeuticClass
    });
    fnAddGridSerialNoHeading();
}

function fnAddTherapeuticClass() {
    fnClearFieldsTherapeuticClass();
    _isInsert = true;
    $('#PopupTherapeuticClass').modal('show');
    $("#txtTherapeutic").val("");
    $("#btnSaveTherapeuticClass").show();
    $("#btnSaveTherapeuticClass").html("<i class='fa fa-save'></i> "+ localization.Save);
    $("#btnDeactivateTherapeuticClass").hide();
    $('#PopupTherapeuticClass').modal({ backdrop: 'static', keyboard: false });
    $('#PopupTherapeuticClass').find('.modal-title').text(localization.AddTherapeuticClass);
    $("#chkActiveStatus").parent().addClass("is-checked");
   
}
function fnEditTherapeuticClass(e, actiontype) {
    var rowid = $("#jqgTherapeuticClass").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgTherapeuticClass').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);

    $('#txtTherapeutic').val(rowData.DrugTherapeutic);

    $("#txtTherapeuticClassDescription").val(rowData.DrugTherapeuticDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveTherapeuticClass").attr('disabled', false);

    _isInsert = false;
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPH_02_00", "UIC02", errorMsg.editauth_E3);
            return;
        }
        $('#PopupTherapeuticClass').modal('show').css({ top: firstRow.top + 31 });
        $('#PopupTherapeuticClass').find('.modal-title').text(localization.UpdateTherapeuticClass);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTherapeuticClass").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnDeactivateTherapeuticClass").hide();
        $("input,textarea").attr('readonly', false);
        $("#btnSaveTherapeuticClass").show();
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPH_02_00", "UIC03", errorMsg.vieweauth_E4);
            return;
        }
        $('#PopupTherapeuticClass').modal('show');
        $('#PopupTherapeuticClass').find('.modal-title').text(localization.ViewTherapeuticClass);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveTherapeuticClass,#btnDeactivateTherapeuticClass").hide();
        $("input,textarea").attr('readonly', true);

    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPH_02_00", "UIC04", errorMsg.deleteauth_E5);
            return;
        }
        $('#PopupTherapeuticClass').modal('show');
        $('#PopupTherapeuticClass').find('.modal-title').text(localization.ActiveDeactiveTherapeuticClass);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateTherapeuticClass").html("<i class='fa fa-ban'></i> " +localization.Deactivate);
        }
        else {
            $("#btnDeactivateTherapeuticClass").html("<i class='fa fa-check'></i> " +localization.Activate);
        }
        $("#btnSaveTherapeuticClass").hide();
        $("#btnDeactivateTherapeuticClass").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }

}


function fnSaveTherapeuticClass() {
    if (IsStringNullorEmpty($("#txtTherapeuticClassDescription").val())) {
        fnAlert("w", "EPH_02_00", "UI0290", errorMsg.TherapeuticClassDesc_E1);
        return;
    }


    $("#btnSaveTherapeuticClass").attr('disabled', true);
    Therapeutic_codes = {
        DrugTherapeutic: $("#txtTherapeutic").val() === '' ? 0 : $("#txtTherapeutic").val(),
        DrugTherapeuticDesc: $("#txtTherapeuticClassDescription").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveTherapeuticClass").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/DrugClass/InsertOrUpdateDrugTherapeutic',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: Therapeutic_codes },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveTherapeuticClass").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveTherapeuticClass").attr('disabled', false);
                fnGridRefreshTherapeuticClass();
                $('#PopupTherapeuticClass').modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveTherapeuticClass").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveTherapeuticClass").attr("disabled", false);
        }
    });
}

function fnGridRefreshTherapeuticClass() {
    $("#jqgTherapeuticClass").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$("#btnCancelTherapeuticClass").click(function () {
    fnClearFieldsTherapeuticClass();
    $("#jqgTherapeuticClass").jqGrid('resetSelection');
    $('#PopupTherapeuticClass').modal('hide');
});




function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnClearFieldsTherapeuticClass() {
    $("#txtTherapeuticClassDescription").val("");
    $("#txtTherapeutic").val("");
    $("#btnSaveTherapeuticClass").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
}


function fnDeleteTherapeuticClass() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateTherapeuticClass").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/DrugClass/ActiveOrDeActiveDrugTherapeutic?status=' + a_status + '&drugthrapId=' + $("#txtTherapeutic").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateTherapeuticClass").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupTherapeuticClass').modal('hide');
                fnClearFieldsTherapeuticClass();
                fnGridRefreshTherapeuticClass();
                $("#btnDeactivateTherapeuticClass").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateTherapeuticClass").attr("disabled", false);
                $("#btnDeactivateTherapeuticClass").html("<i class='fa fa-ban'></i> " + localization.Deactivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateTherapeuticClass").attr("disabled", false);
            $("#btnDeactivateTherapeuticClass").html("<i class='fa fa-ban'></i> " + localization.Deactivate);
        }
    });
}