var Isadd = 0;
$(document).ready(function () {
    fnGridLoadCalendarDetails();
    $.contextMenu({
        selector: "#btnCalendarDetails",
        trigger: 'left',
        jqgEdit: { name: localization.Save, icon: "edit", callback: function (key, opt) { fnSaveDocumentcontrolMaster(event, 'edit') } },
        jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnSaveDocumentcontrolMaster(event, 'view') } },
        jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnSaveDocumentcontrolMaster(event, 'delete') } },

      });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});

var actiontype = "";
function fnGridLoadDocumentcontrolMasters() {
    var actiontype = "";
    $("#jqgDocumentControlMaster").jqGrid('GridUnload');

    $("#jqgDocumentControlMaster").jqGrid({

        url: getBaseURL() + '/DocumentControl/GetDocumentControlMaster',
        mtype: 'GET',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DocumentId, localization.ShortDesc, localization.DocumentDescription,  localization.DocumentType, localization.Active, localization.Actions],
        colModel: [
            { name: "DocumentId", width: 30, editable: true, align: 'left', hidden: false },
            { name: "ShortDesc", width: 45, editable: true, align: 'left', resizable: false, hidden: true },
            { name: "DocumentDesc", width: 180, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "DocumentType", width: 35, editable: true, align: 'left', resizable: false, hidden: true },
            { name: "ActiveStatus", width: 30, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 30, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {

                    return '<button class="mr-1 btn btn-outline" id="btnDocContManagement"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpDocumentControlMaster",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: localization.DocumentControlMaster,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgDocumentControlMaster");
        },
        onSelectRow: function (rowid, status, e) { },

    }).jqGrid('navGrid', '#jqpDocumentControlMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDocumentControlMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDocumentControlMaster
    }).jqGrid('navButtonAdd', '#jqpDocumentControlMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDocumentControlMaster
    });
    fnAddGridSerialNoHeading();
}

function fnAddDocumentControlMaster() {
    fnClearFields();
    Isadd = 1;
    $("#txtDocumentId").prop('readonly', false);
    $('#PopupDocumentControlMaster').modal('show');
    $('#PopupDocumentControlMaster').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDocumentControlMaster').find('.modal-title').text(localization.AddDocumentControlMaster);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDocumentControlMaster").html('<i class="fa fa-save"></i>  ' + localization.Save);
    $("#btnSaveDocumentControlMaster").show();
    $("#btnDeactivateDocumentControlMaster").hide();
}
function fnEditDocumentControlMaster(e, actiontype) {
    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "ECD_05_00", "UIC02", errorMsg.editauth_E3);
        return;
    }
    var rowid = $("#jqgDocumentControlMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDocumentControlMaster').jqGrid('getRowData', rowid);
    $("#txtDocumentId").val(rowData.DocumentId);
    $("#txtDocumentId").prop('readonly', true);
    $("#txtShortDesc").val(rowData.ShortDesc);
    $("#txtDocumentType").val(rowData.DocumentType);
    $("#txtDocumentDesc").val(rowData.DocumentDesc);
    Isadd = 0;
    $('#PopupDocumentControlMaster').modal('show');
    $('#PopupDocumentControlMaster').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDocumentControlMaster').find('.modal-title').text(localization.UpdateDocumentControlMaster);
    $("#btnSaveDocumentControlMaster").html('<i class="fa fa-sync"></i>' + localization.Update);
    $("#btnSaveDocumentControlMaster").attr('disabled', false);
    $("#btnSaveDocumentControlMaster").show();
    $("#btnDeactivateDocumentControlMaster").hide();
    $("#chkActiveStatus").prop('disabled', true);
    if (rowData.ActiveStatus === "true") {
         $("#chkActiveStatus").parent().addClass("is-checked");
    } else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    $("#btnSaveDocumentControlMaster").show();
    $("#btnDeactivateDocumentControlMaster").hide();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("input[id*=chk]").attr('disabled', false);
    $("#txtDocumentId").prop('readonly', true);

    $("#PopupDocumentControlMaster").on('hidden.bs.modal', function () {
        $("#btnSaveDocumentControlMaster").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("input[id*=chk]").attr('disabled', false);
        $("#btnSaveDocumentControlMaster").attr('disabled', false);
    });
}

function fnSaveDocumentControlMaster() {
    if (fnValidateDocumentControlMaster() === false) {
        return;
    }
    else {
        var obj = {
            DocumentId: $("#txtDocumentId").val(),
            DocumentType: $("#txtDocumentType").val(),
            ShortDesc: $("#txtShortDesc").val(),
            DocumentDesc: $("#txtDocumentDesc").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            Isadd: Isadd,
        };
        $("#btnSaveDocumentControlMaster").attr('disabled', true);
        $.ajax({
           // url: getBaseURL() + '/CalendarControl/AddOrUpdateDocumentControl',
            type: 'POST',
            datatype: 'json',
            data: { obj },
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#btnSaveDocumentControlMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                    $('#PopupDocumentControlMaster').modal('hide');
                    fnRefreshDocumentControlGrid();
                    fnClearFields()
                    return true;
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnsaveDocumentControlMaster").attr('disabled', false);
                    return false;
                }
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnsaveDocumentControlMaster").attr('disabled', false);
            }
        });
    }
}

function fnValidateDocumentControlMaster() {
   
    if (IsStringNullorEmpty($("#txtShortDesc").val())) {
        fnAlert("w", "ECD_05_00", "UI0019", errorMsg.ShortDesc_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtDocumentDesc").val())) {
        fnAlert("w", "ECD_05_00", "UI0021", errorMsg.DocumentDesc_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#txtDocumentType").val())) {
        fnAlert("w", "ECD_05_00", "UI0018", errorMsg.DocumenType_E2);
        return false;
    }
}

function fnRefreshDocumentControlMaster() {
    $("#jqgDocumentControlMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtDocumentId").val('');
    $("#txtDocumentType").val('');
    $("#txtShortDesc").val('');
    $("#txtDocumentDesc").val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnsaveDocContrManagement").attr('disabled', false);
}


function fnDeleteDocumentControlMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveDocumentControlMaster").attr("disabled", true);
    $.ajax({
        //url: getBaseURL() + '/DocumentControl/ActiveOrDeActiveDocumentControl?status=' + a_status + '&documentId=' + $("#txtDocumentId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveDocumentControlMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDocumentControlMaster').modal('hide');
                fnClearFields();
                fnRefreshDocumentControlGrid();
                $("#btndeActiveDocumentControlMaster").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveDocumentControlMaster").attr("disabled", false);
                $("#btndeActiveDocumentControlMaster").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveDocumentControlMaster").attr("disabled", false);
            $("#btndeActiveDocumentControlMaster").html('De Activate');
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}