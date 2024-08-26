var actiontype = "";
var isUpdate = 0;
$(function () {

    fnGridLoadCOAParameters();

    $.contextMenu({
        selector: "#btnCOAParameters",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCOAParameters('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCOAParameters('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCOAParameters('delete') } },
        }
       
    });
    
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadCOAParameters() {
    $('#jqgCOAParameters').jqGrid('GridUnload');
    $("#jqgCOAParameters").jqGrid({
        //url: getBaseURL() + '',
        url: getBaseURL() + '/Parameter/GetAccountGLType',
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.ParameterID, localization.ParameterDescription, localization.UsageStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "ParameterID", width: 45, align: 'left', editable: false, editoptions: { maxlength: 4 } },
            { name: "ParameterDesc", width: 155, editable: false, align: 'left', editoptions: { maxlength: 50 } },
            { name: "UsageStatus", width: 40, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCOAParameters"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpCOAParameters",
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
        scrollOffset: 0, caption: localization.Parameters,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgCOAParameters");
        },
    }).
        jqGrid('navGrid', '#jqpCOAParameters', { add: false, edit: false, search: false, searchtext: 'Search', del: false, refresh: false })
       .jqGrid('navButtonAdd', '#jqpCOAParameters', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCOAParameters
        }).
        jqGrid('navButtonAdd', '#jqpCOAParameters', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnRefreshGridCOAParameters
        });
    fnAddGridSerialNoHeading();
}

function fnAddCOAParameters() {
    fnClearCOAParameters();
    $("#PopupCOAParameters").modal('show');
    $('#PopupCOAParameters').find('.modal-title').text(localization.AddParameters);
    $("#btnSaveCOAParameters").html("<i class='fa fa-save'></i> " + localization.Save);
    $("#chkCOAActiveStatus").parent().addClass("is-checked");
    $("#chkCOAActiveStatus").prop('disabled', true);
    $("#btnDeactivateCOAParameters").hide();
    isUpdate = 0;
}

function fnEditCOAParameters(actiontype) {
    var rowid = $("#jqgCOAParameters").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCOAParameters').jqGrid('getRowData', rowid);

    $('#txtCOAParametersId').val(rowData.ParameterID).attr('readonly', true);
    $('#txtCOAParametersDesc').val(rowData.ParameterDesc);
    if (rowData.ActiveStatus == 'true') {
        $("#chkCOAActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkCOAActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveCOAParameters").attr('disabled', false);
    isUpdate = 1;
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EAC_04_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupCOAParameters").modal('show');
        $("#chkCOAActiveStatus").prop('disabled', true);
        $('#PopupCOAParameters').find('.modal-title').text(localization.EditParameters);
        $("#btnSaveCOAParameters").html("<i class='fa fa-sync'></i> " + localization.Update);
        $("#btnDeactivateCOAParameters").hide();
       
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EAC_04_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#PopupCOAParameters").modal('show');
        $('#PopupCOAParameters').find('.modal-title').text(localization.ViewParameters);
        $("#btnSaveCOAParameters").hide();
        $("input,textarea").attr('readonly', true);
        $("#chkCOAActiveStatus").prop('disabled', true);
        $("#btnDeactivateCOAParameters").hide();
       
        $("#PopupCOAParameters").on('hidden.bs.modal', function () {
            $("#btnSaveCOAParameters").show();
            $("#chkCOAActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
           
        });
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EAC_04_00", "UIC04", errorMsg.deleteauth_E5);
            return;
        }
        $("#PopupCOAParameters").modal('show');
        $('#PopupCOAParameters').find('.modal-title').text(localization.ActivateDeactivateParameters);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateCOAParameters").html(localization.Deactivate);
        }
        else {
            $("#btnDeactivateCOAParameters").html(localization.Activate);
        }

        $("#btnSaveCOAParameters").hide();
        $("#btnDeactivateCOAParameters").show();
        $("input,textarea").attr('readonly', true);
        $("#chkCOAActiveStatus").prop('disabled', true);
       
        $("#PopupCOAParameters").on('hidden.bs.modal', function () {
            $("#btnSaveCOAParameters").show();
            $("#chkCOAActiveStatus").prop('disabled', true);
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnClearCOAParameters() {
    $("#txtCOAParametersId").val('');
    $("#txtCOAParametersDesc").val('');
    $("#chkCOAActiveStatus").prop('disabled', false);
    $("#chkCOAActiveStatus").parent().removeClass("is-checked");
    $("#chkCOAUsageStatus").parent().removeClass("is-checked");
    $("#btnSaveCOAParameters").attr('disabled', false);
}

function fnSaveCOAParameters() {

    if (IsStringNullorEmpty($("#txtCOAParametersId").val())) {
        fnAlert("w", "EFA_01_00", "UI0371", errorMsg.ParamterId_E6);
        return false;
    }
    if ($("#txtCOAParametersId").val() == 0) {
        fnAlert("w", "EFA_01_00", "UI0015", errorMsg.ParameterId_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCOAParametersDesc").val())) {
        fnAlert("w", "EFA_01_00", "UI0016", errorMsg.ParameterDesc_E8);
        return false;
    }

    var obj = {
        ParameterID: $("#txtCOAParametersId").val(),
        ParameterDesc: $("#txtCOAParametersDesc").val(),
        UsageStatus: $("#chkCOAUsageStatus").parent().hasClass("is-checked"),
        ActiveStatus: $("#chkCOAActiveStatus").parent().hasClass("is-checked")
    }

    var URL = getBaseURL() + '/Parameter/InsertAccountGLType';
    if (isUpdate == 1) {
        URL = getBaseURL() + '/Parameter/UpdateAccountGLType';
    }

    $("#btnSaveCOAParameters").attr('disabled', true);

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnClearCOAParameters();
                fnRefreshGridCOAParameters();
                $("#btnSaveCOAParameters").attr('disabled', false);
                $("#PopupCOAParameters").modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveCOAParameters").attr('disabled', false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCOAParameters").attr("disabled", false);
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteParameters() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkCOAActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateCOAParameters").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Parameter/DeleteAccountGLType?status=' + a_status + '&ParameterID=' + $("#txtCOAParametersId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateCOAParameters").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupCOAParameters').modal('hide');
                fnClearCOAParameters();
                fnRefreshGridCOAParameters();
                $("#btnDeactivateCOAParameters").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateCOAParameters").attr("disabled", false);
                $("#btnDeactivateCOAParameters").html(localization.Deactivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateCOAParameters").attr("disabled", false);
            $("#btnDeactivateCOAParameters").html(localization.Deactivate);
        }
    });
}


function fnRefreshGridCOAParameters() {
    $("#jqgCOAParameters").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}