﻿var actiontype = "";
var actionSubledgerType = "";
$(function () {
    fnGridLoadSubledgerType();
    $.contextMenu({
        selector: "#btnSubledgerType",
        trigger: 'left',
        items: {
            jqgAddViewParameter: { name: localization.AddViewSubledgerGroup, icon: "add", callback: function (key, opt) { fnSubledgerGroupInfoPopup(event) } },
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditSubledgerType('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditSubledgerType('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditSubledgerType('delete') } },
        }
    });
    $(".context-menu-icon-add").html("<span class='icon-contextMenu'><i class='fa fa-plus'></i>" + localization.AddViewSubledgerGroup + " </span>");
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
    $(".context-menu-list").css('width', '200px');
});

var data = [{ SubledgerType: 'Patient', Sltdesc: 'Patient Type', ActiveStatus: '', edit :''}]
function fnGridLoadSubledgerType() {
    $('#jqgSubledgerType').jqGrid('GridUnload');
    $("#jqgSubledgerType").jqGrid({
        url: getBaseURL() + '/Subledger/GetSubledgerTypes',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.SubledgerType, localization.SltDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "SubledgerType", width: 45, align: 'left', editable: false, editoptions: { maxlength: 4 } },
            { name: "Sltdesc", width: 155, editable: false, align: 'left', editoptions: { maxlength: 50 } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 65, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSubledgerType"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSubledgerType",
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
        scrollOffset: 0, caption: localization.SubledgerType,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgSubledgerType");
        },
    }).
        jqGrid('navGrid', '#jqpSubledgerType', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpSubledgerType', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSubledgerType
        }).
        jqGrid('navButtonAdd', '#jqpSubledgerType', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshSubledgerType
        });
    fnAddGridSerialNoHeading();
}

function fnAddSubledgerType() {
    fnClearSubledgerTypeFields();
    $("#PopupSubledgerType").modal('show');
    $('#PopupSubledgerType').find('.modal-title').text(localization.AddSubledgerType);
    $('#txtSubledgerType').attr('disabled', false);
    $("#btnSaveSubledgerType").html("<i class='fa fa-save'></i> " + localization.Save);
    $("#chkSLTActiveStatus").parent().addClass("is-checked");
    $("#chkSLTActiveStatus").prop('disabled', true);
    actionParameterType = "I";
    $("#btnDeactivateSubledgerType").hide();
}

function fnEditSubledgerType(actiontype) {
    var rowid = $("#jqgSubledgerType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSubledgerType').jqGrid('getRowData', rowid);

    $('#txtSubledgerType').val(rowData.SubledgerType).attr('disabled', true);
    $('#txtSubledgerTypeDescription').val(rowData.Sltdesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkSLTActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkSLTActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveSubledgerType").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_21_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupSubledgerType").modal('show');
        $("#chkSLTActiveStatus").prop('disabled', true);
        $('#PopupSubledgerType').find('.modal-title').text(localization.UpdateSubledgerType);
        $("#btnSaveSubledgerType").html("<i class='fa fa-sync'></i> " + localization.Update);
        $("#btnDeactivateSubledgerType").hide();
        actionParameterType = "U";
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_21_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#PopupSubledgerType").modal('show');
        $('#PopupSubledgerType').find('.modal-title').text(localization.ViewSubledgerType);
        $("#btnSaveSubledgerType").hide();
        $("input,textarea").attr('readonly', true);
        //$("input[type=checkbox]").attr('disabled', true);
        $("#chkSLTActiveStatus").prop('disabled', true);
        $("#btnDeactivateSubledgerType").hide();
        actionParameterType = "V";
        $("#PopupSubledgerType").on('hidden.bs.modal', function () {
            $("#btnSaveSubledgerType").show();
            $("#chkSLTActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            //$("input[type=checkbox]").attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_21_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#PopupSubledgerType").modal('show');
        $('#PopupSubledgerType').find('.modal-title').text(localization.ActiveDeactiveSubledgerType);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateSubledgerType").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateSubledgerType").html(localization.Activate);
        }

        $("#btnSaveSubledgerType").hide();
        $("#btnDeactivateSubledgerType").show();
        $("input,textarea").attr('readonly', true);
        $("#chkSLTActiveStatus").prop('disabled', true);
        actionParameterType = "V";
        $("#PopupSubledgerType").on('hidden.bs.modal', function () {
            $("#btnSaveSubledgerType").show();
            $("#chkSLTActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSubledgerGroupInfoPopup(e) {
    debugger;
    fnClearSubledgerGroup();
    $("#divSubledgerGroup").css('display', 'none');
    var rowid = $("#jqgSubledgerType").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSubledgerType').jqGrid('getRowData', rowid);
    $("#PopupSubledgerGroup").modal('show');
    $("#txtHDSubledgerType").val(rowData.SubledgerType);
    $("#txtHDSubledgerGroup").val('');
    $("#lblSubledgerType").text(rowData.Sltdesc);
    $("#chkSLGActiveStatus").parent().addClass("is-checked");
    fnGridLoadSubledgerGroup(rowData.SubledgerType);
}

function fnClearSubledgerTypeFields() {
    $("#txtSubledgerType").val('');
    $("#txtSubledgerTypeDescription").val('');
    $("#chkSLTActiveStatus").prop('disabled', false);
    $("#chkSLTActiveStatus").parent().removeClass("is-checked");
    $("#btnSaveSubledgerType").attr('disabled', false);
}

function fnSaveSubledgerType() {

    if ($("#txtSubledgerType").val() == 0) {
        fnAlert("w", "EPS_21_00", "UI0387", errorMsg.SubledgerType_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#txtSubledgerTypeDescription").val())) {
        fnAlert("w", "EPS_21_00", "UI0388", errorMsg.SubledgerTypeDesc_E6);
        return false;
    }

    var Subledger_h = {
        SubledgerType: $("#txtSubledgerType").val(),
        Sltdesc: $("#txtSubledgerTypeDescription").val(),
        ActiveStatus: $("#chkSLTActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveSubledgerType").attr('disabled', true);

    var URL = getBaseURL() + '/Subledger/InsertIntoSubledgerType';
    if (actionParameterType == "U")
        URL = getBaseURL() + '/Subledger/UpdateSubledgerType';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj: Subledger_h },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnClearSubledgerTypeFields();
                fnGridRefreshSubledgerType();
                $("#btnSaveSubledgerType").attr('disabled', false);
                $("#PopupSubledgerType").modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveSubledgerType").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveSubledgerType").attr("disabled", false);
        }
    });
}


function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteSubledgerType() {
    debugger;
    var a_status;
    //Activate or De Activate the status
    if ($("#chkSLTActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateSubLedgerType").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Subledger/ActiveOrDeActiveSubledgerType?status=' + a_status + '&stype=' + $("#txtSubledgerType").val(),
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateSubLedgerType").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupSubledgerType').modal('hide');
                fnClearSubledgerTypeFields();
                fnGridRefreshSubledgerType();
                $("#btnDeactivateSubLedgerType").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateSubLedgerType").attr("disabled", false);
                $("#btnDeactivateSubLedgerType").html(localization.Deactivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateSubLedgerType").attr("disabled", false);
            $("#btnDeactivateSubLedgerType").html(localization.Deactivate);
        }
    });
}

// Add/View SubLedgerGroup
function fnGridLoadSubledgerGroup(SLType) {
    $('#jqgSubledgerGroup').jqGrid('GridUnload');
    $("#jqgSubledgerGroup").jqGrid({
        url: getBaseURL() + '/Subledger/GetSubledgerGroupInformationBySubledgerType?stype=' + SLType,
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SubledgerType, localization.SubledgerGroup, localization.SubledgerDescription, localization.Coahead, localization.Active, localization.Actions],
        colModel: [
            { name: "SubledgerType", width: 50, editable: true, align: 'left', editoptions: { maxlength: 4 }, hidden: true },
            { name: "SubledgerGroup", width: 50, editable: true, align: 'left', editoptions: { maxlength: 4 } },
            { name: "SubledgerDesc", width: 180, editable: true, align: 'left', editoptions: { maxlength: 50 } },
            { name: "Coahead", width: 40, editable: true, align: 'left', editoptions: { maxlength: 50 } },
            { name: "ActiveStatus", width: 55, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'action', search: false, align: 'left', width: 80, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" onclick="return fnEditSubledgerGroup(event,\'edit\')"><i class="fas fa-pen"></i></button>' +
                        '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSubledgerGroup(event,\'view\')"><i class="far fa-eye"></i></button>'

                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50, 100],
        rownumWidth: 55,
        emptyrecords: "No records to View",
        pager: "#jqpSubledgerGroup",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        scrollOffset: 0, caption: localization.SubledgerGroup,
        loadComplete: function () {
            fnJqgridSmallScreen("jqgSubledgerGroup");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
    }).jqGrid('navGrid', '#jqpSubledgerGroup', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSubledgerGroup', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshSubledgerGroup
    }).jqGrid('navButtonAdd', '#jqpSubledgerGroup', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'custAdd', position: 'first', onClickButton: fnAddSubledgerGroup
    });
    fnAddGridSerialNoHeading();
}

function fnAddSubledgerGroup() {
    debugger;
    fnClearSubledgerGroup();
    fnUserAction(false);
    $('#PopupSubledgerGroup').find('.modal-title').text(localization.AddSubLedgerGroup);
    $("#chkSLGActiveStatus").parent().addClass("is-checked");
    $("#chkSLGActiveStatus").prop('disabled', false);
    $("#btnSaveSubledgerGroup").html(localization.Save).show();
    $("#divSubledgerGroup").css('display', 'flex');
    $("#txtSubledgerDescription").attr('disabled',false);
    $("#txtCOAHead").attr('disabled', false);
}

function fnEditSubledgerGroup(e,actiontype) {
    fnClearSubledgerGroup();
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgSubledgerGroup').jqGrid('getRowData', rowid);
    $("#divSubledgerGroup").css('display', 'flex');
    $("#txtHDSubledgerType").val(rowData.SubledgerType);
    $("#txtHDSubledgerGroup").val(rowData.SubledgerGroup);
    $("#txtSubledgerDescription").val(rowData.SubledgerDesc);
    $("#txtCOAHead").val(rowData.Coahead);

    $('#lblSubledgerType').text(rowData.Sltdesc);
   
    if (rowData.ActiveStatus == 'true') {
        $("#chkSLGActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkSLGActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveSubLedgerType").attr('disabled', false);
    fnUserAction(false);
    if (actiontype.trim() == "edit") {
        $("#chkSLGActiveStatus").prop('disabled', false);
        $("#btnSaveSubledgerType").html('Update').show();
        $("#txtSubledgerDescription").attr('disabled', false);
        $("#txtCOAHead").attr('disabled', false);
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveSubledgerType").hide();
        $("#chkSLGActiveStatus").prop('disabled', true);
        fnUserAction(true);
        $("#txtSubledgerDescription").attr('disabled', true);
        $("#txtCOAHead").attr('disabled', true);
    }
}

function fnUserAction(val) {
    $("input,textarea").attr('readonly', val);
    $("select").next().attr('disabled', val);
    //$("input[type=checkbox]").attr('disabled', val);
}

function fnSaveSubledgerGroup() {

    if (IsStringNullorEmpty($("#txtHDSubledgerType").val())) {
        fnAlert("w", "EPS_21_00", "UI0387", errorMsg.SubledgerType_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#txtSubledgerDescription").val())) {
        fnAlert("w", "EPS_21_00", "UI0389", errorMsg.SubledgerGroupDesc_E7);
        return false;
    }

    var sub_group = {
        SubledgerType: $("#txtHDSubledgerType").val(),
        SubledgerGroup: $("#txtHDSubledgerGroup").val() === '' ? 0 : $("#txtHDSubledgerGroup").val(),
        SubledgerDesc: $("#txtSubledgerDescription").val(),
        Coahead: $("#txtCOAHead").val(),
        ActiveStatus: $("#chkSLGActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveSubledgerType").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Subledger/InsertOrUpdateSubledgerGroup',
        type: 'POST',
        datatype: 'json',
        data: { obj: sub_group },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveSubledgerType").attr('disabled', false);
                $("#txtParameterDescription").val('');
                fnClearSubledgerGroup();
                fnGridRefreshSubledgerGroup();
                //$("#PopupParameters").modal('hide');

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveSubledgerType").attr('disabled', false);
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveSubledgerType").attr("disabled", false);
        }
    });
}

function fnGridRefreshSubledgerType() {
    $("#jqgSubledgerType").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridRefreshSubledgerGroup() {
    $("#divSubledgerGroup").css('display', 'none');
    $("#jqgSubledgerGroup").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearSubledgerGroup() {
    $("#txtHDSubledgerGroup").val('');
    $("#txtSubledgerDescription").val('');
    $("#txtCOAHead").val('');
    $("#chkSLGActiveStatus").prop('disabled', false);
    $("#chkSLGActiveStatus").parent().removeClass("is-checked");
    $("#btnSaveSubledgerGroup").attr('disabled', false);

}