var actiontype = "";
var isUpdate = 0;
$(function () {
    fnGridLoadEmailVariable();
    $.contextMenu({
        selector: "#btnEmailVariable",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditEmailVariable('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditEmailVariable('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditEmailVariable('delete') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + " </span>");
});

function fnGridLoadEmailVariable() {
    $('#jqgEmailVariable').jqGrid('GridUnload');
    $("#jqgEmailVariable").jqGrid({
        url: getBaseURL() + '/Engine/GetEmailVariableInformation',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.EmailVariable, localization.EmailComponent, localization.Active, localization.Actions],
        colModel: [
            { name: "Emavariable", width: 45, editable: true, align: 'left', editoptions: { maxlength: 4 } },
            { name: "Emacomponent", width: 108, editable: true, align: 'left', editoptions: { maxlength: 4 } },
            { name: "ActiveStatus", editable: true, width: 35, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEmailVariable"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpEmailVariable",
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
        caption: localization.EmailVariable,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgEmailVariable");
        },

        onSelectRow: function (rowid, status, e) {
        },

    }).jqGrid('navGrid', '#jqpEmailVariable', {
        add: false, edit: false, search: false, del: false, refresh: false
    }).jqGrid('navButtonAdd', '#jqpEmailVariable', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmailVariable
    }).jqGrid('navButtonAdd', '#jqpEmailVariable', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmailVariable
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshEmailVariable() {
    $("#jqgEmailVariable").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearEmailVariable() {
    $("#txtEmailVariable").val('');
    $("#txtEmailComponent").val('');
    $('#chkEmailActiveStatus').parent().addClass("is-checked");
    $("#btnSaveEmailVariable").attr('disabled', false);
}

function fnAddEmailVariable() {
    fnClearEmailVariable();
    $("#PopupEmailVariable").modal('show');
    $('#PopupEmailVariable').find('.modal-title').text(localization.AddEmailVariable);
    $("#btnCancelEmailVariable").html('<i class="fa fa-times"></i> ' + localization.Cancel);
    $("#txtEmailVariable").attr('readonly', false);
    $("#chkEmailActiveStatus").parent().addClass("is-checked");
    $("#chkEmailActiveStatus").attr('disabled', true);
    $("#btnSaveEmailVariable").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnSaveEmailVariable").show();
    $("#btnDeactivateEmailVariable").hide();
    isUpdate = 0;
}

function fnEditEmailVariable(actiontype) {
     var rowid = $("#jqgEmailVariable").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgEmailVariable').jqGrid('getRowData', rowid);
    $('#txtEmailVariable').val(rowData.Emavariable).attr('readonly', true);
    $('#txtEmailComponent').val(rowData.Emacomponent);
    if (rowData.ActiveStatus === 'true') {
        $("#chkEmailActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateEmailVariable").html(localization.Deactivate);
    }
    else {
        $("#chkEmailActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateEmailVariable").html(localization.Activate);
    }
    $("#btnSaveEmailVariable").attr('disabled', false);
    isUpdate = 1;
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EME_01_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupEmailVariable").modal('show');
        $('#PopupEmailVariable').find('.modal-title').text(localization.EditEmailVariable);
        $("#btnCancelEmailVariable").html('<i class="fa fa-times"></i> ' + localization.Cancel);
        $("#chkEmailActiveStatus").prop('disabled', true);
        $("#btnSaveEmailVariable").html('<i class="fa fa-sync"></i>  ' + localization.Update);
        $("#btnSaveEmailVariable").attr("disabled", false);
        $("#btnSaveEmailVariable").show();
        $("#btnDeactivateEmailVariable").hide();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EME_01_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#PopupEmailVariable").modal('show');
        $('#PopupEmailVariable').find('.modal-title').text(localization.ViewEmailVariable);
        $("#btnSaveEmailVariable,#btnDeactivateEmailVariable").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkEmailActiveStatus").attr('disabled', true);
        $("#PopupEmailVariable").on('hidden.bs.modal', function () {
            $("#btnSaveEmailVariable").show();
            $("input,textarea").attr('readonly', false);
            $("#chkEmailActiveStatus").attr('disabled', false);
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EME_01_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#PopupEmailVariable").modal('show');
        $('#PopupEmailVariable').find('.modal-title').text("Active / De Active Email Variable");
        $("#btnSaveEmailVariable").hide();
        $("#btnDeactivateEmailVariable").show();
        $("input,textarea").attr('readonly', true);
        $("#chkEmailActiveStatus").attr('disabled', true);
        $("#PopupEmailVariable").on('hidden.bs.modal', function () {
            $("#btnSaveEmailVariable").show();
            $("input,textarea").attr('readonly', false);
            $("#chkEmailActiveStatus").attr('disabled', false);
        });
    }
}

function fnSaveEmailVariable() {

    if (IsStringNullorEmpty($("#txtEmailVariable").val())) {
        fnAlert("w", "EME_01_00", "UI0390", errorMsg.EmailVariable_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtEmailComponent").val())) {
        fnAlert("w", "EME_01_00", "UI0391", errorMsg.EmailComponent_E7);
        return false;
    }

    var obj = {
        Emavariable: $("#txtEmailVariable").val(),
        Emacomponent: $("#txtEmailComponent").val(),
        ActiveStatus: $("#chkEmailActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/Engine/InsertIntoEmailVariable';
    if (isUpdate == 1) {
        URL = getBaseURL() + '/Engine/UpdateEmailVariable';
    }

    $("#btnSaveEmailVariable").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveEmailVariable").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshEmailVariable();
                $("#PopupEmailVariable").modal('hide');

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveEmailVariable").attr('disabled', false);
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveEmailVariable").attr("disabled", false);
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteEmailVariable() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkEmailActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateEmailVariable").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Engine/ActiveOrDeActiveEmailVariable?status=' + a_status + '&smsvariable=' + $("#txtSMSVariable").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateEmailVariable").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupEmailVariable').modal('hide');
                fnGridRefreshEmailVariable();
                fnClearEmailVariable();
                $("#btnDeactivateEmailVariable").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateEmailVariable").attr("disabled", false);
                $("#btnDeactivateEmailVariable").html(localization.Deactivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateEmailVariable").attr("disabled", false);
            $("#btnDeactivateEmailVariable").html(localization.Deactivate);
        }
    });
}