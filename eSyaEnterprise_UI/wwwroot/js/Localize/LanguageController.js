$(document).ready(function () {
    fnGridLoadLanguageController();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnLanguageController",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditLanguageController(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditLanguageController(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditLanguageController(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + " </span>");
});
function fnGridLoadLanguageController() {
    $('#jqgLanguageController').jqGrid('GridUnload');

    $("#jqgLanguageController").jqGrid({
        url: getBaseURL() + '/Controller/GetLanguageControllersbyResource?Resource=' + $('#cboResource').val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.ResourceName, localization.Key, localization.Value, localization.Active, localization.Actions],

        colModel: [

            { name: "ResourceId", width: 50, editable: true, align: 'left', hidden: true },
            { name: "ResourceName", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },
            { name: "Key", width: 70, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },
            { name: "Value", width: 120, editable: true, align: 'left', resizable: false, editoption: { 'text-align': 'left' } },

            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnLanguageController"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        pager: "#jqpLanguageController",
        caption: "Language Controller",
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
            SetGridControlByAction(); fnJqgridSmallScreen("jqgLanguageController");
        },

        onSelectRow: function (rowid, status, e) {
            
        },

    }).jqGrid('navGrid', '#jqpLanguageController', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpLanguageController', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshLanguageControllerGrid
    }).jqGrid('navButtonAdd', '#jqpLanguageController', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddLanguageController
    });
    fnAddGridSerialNoHeading();

}

function fnAddLanguageController() {
    fnClearFields();
    if ($("#cboResource").val() === "" || $("#cboResource").val() === "All") {
        $('#cboPopupResource').val("0").selectpicker('refresh');
        $("#PopupLanguageController").modal('show');
        $('#PopupLanguageController').find('.modal-title').text(localization.AddLanguageController);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveLanguageController").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveLanguageController").show();
        $("#btnDeactivateLanguageController").hide();
    }
    else {

        $('#cboPopupResource').val($("#cboResource").val()).selectpicker('refresh');
        $("#PopupLanguageController").modal('show');
        $('#PopupLanguageController').find('.modal-title').text(localization.AddLanguageController);
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#chkActiveStatus").attr('disabled', true);
        $("#btnSaveLanguageController").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnSaveLanguageController").show();
        $("#btnDeactivateLanguageController").hide();
    }
}

function fnEditLanguageController(e, actiontype) {
    fnClearFields();
    var rowid = $("#jqgLanguageController").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgLanguageController').jqGrid('getRowData', rowid);
    $('#txtResourceId').val(rowData.ResourceId);
    $('#cboPopupResource').val(rowData.ResourceName).selectpicker('refresh');
    $('#txtKey').val(rowData.Key);
    $('#txtValue').val(rowData.Value);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateLanguageController").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateLanguageController").html(localization.Activate);
    }

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupLanguageController").modal('show');
        $("#chkActiveStatus").prop('disabled', true);
        $('#PopupLanguageController').find('.modal-title').text(localization.UpdateLanguageController);
        $("#btnSaveLanguageController").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("#btnSaveLanguageController").attr("disabled", false);
        $("#btnSaveLanguageController").show();
        $("#btnDeactivateLanguageController").hide();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#PopupLanguageController").modal('show');
        $('#PopupLanguageController').find('.modal-title').text(localization.ViewLanguageController);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveLanguageController,#btnDeactivateLanguageController").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $("#PopupLanguageController").on('hidden.bs.modal', function () {
            $("#btnSaveLanguageController").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#PopupLanguageController").modal('show');
        $('#PopupLanguageController').find('.modal-title').text("Active / De Active Language Controller");
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveLanguageController").hide();
        $("#btnDeactivateLanguageController").show();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $("#PopupLanguageController").on('hidden.bs.modal', function () {
            $("#btnSaveLanguageController").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);
        });
    }
}

function fnSaveLanguageController() {

    if (validateLanguageController() === false) {
        return;
    }

    lobj = {
        ResourceId: $("#txtResourceId").val() === '' ? 0 : $("#txtResourceId").val(),
        ResourceName: $("#cboPopupResource").val(),
        Key: $("#txtKey").val().replace(/ /g, ''),
        Value: $("#txtValue").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveLanguageController").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Controller/InsertOrUpdateLanguageController',
        type: 'POST',
        datatype: 'json',
        data: { lobj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveLanguageController").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupLanguageController').modal('hide');
                fnRefreshLanguageControllerGrid();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveLanguageController").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveLanguageController").attr("disabled", false);
        }
    });
}

function validateLanguageController() {

    if ($("#cboPopupResource").val() === "0" || IsStringNullorEmpty($("#cboPopupResource").val())) {
        fnAlert("w", "ELE_03_00", "UI0083", errorMsg.Resource_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtKey").val())) {
        fnAlert("w", "ELE_03_00", "UI0084", errorMsg.Key_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtValue").val())) {
        fnAlert("w", "ELE_03_00", "UI0085", errorMsg.Value_E8);
        return false;
    }
}

function fnRefreshLanguageControllerGrid() {
    $("#jqgLanguageController").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function AvoidSpace(event) {
    var k = event ? event.which : window.event.keyCode;
    if (k == 32) return false;
}

function fnClearFields() {
    $('#txtResourceId').val('');
    $("#cboPopupResource").val("0").selectpicker('refresh');
    $("#txtKey").val('');
    $("#txtValue").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveLanguageController").attr("disabled", false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteLanguageController() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateLanguageController").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Controller/ActiveOrDeActiveLanguageController?status=' + a_status + '&ResourceId=' + $("#txtResourceId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateLanguageController").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupLanguageController').modal('hide');
                fnRefreshLanguageControllerGrid();
                fnClearFields();
                $("#btnDeactivateLanguageController").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateLanguageController").attr("disabled", false);
                $("#btnDeactivateLanguageController").html(localization.DeActivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateLanguageController").attr("disabled", false);
            $("#btnDeactivateLanguageController").html(localization.DeActivate);
        }
    });
}