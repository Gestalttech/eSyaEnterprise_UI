$(document).ready(function () {

    fnLoadUnitofMeasureGrid();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUnitofMeasure",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditUnitofMeasure(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditUnitofMeasure(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditUnitofMeasure(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnLoadUnitofMeasureGrid() {

    $("#jqgUnitofMeasure").GridUnload();

    $("#jqgUnitofMeasure").jqGrid({
        url: getBaseURL() + '/Admin/Rules/GetUnitofMeasurements',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.UnitofMeasure, localization.UnitofPurchase, localization.UompurchaseDescription, localization.UOMStock, localization.UomStockDescription, localization.UsageStatus,localization.ConvFactor, localization.Active, localization.Actions],

        colModel: [

            { name: "UnitOfMeasure", width: 40, editable: true, align: 'left', hidden: true },
            { name: "Uompurchase", width: 80, editable: true, align: 'left', hidden: true },
            { name: "Uompdesc", width: 80, editable: true, align: 'left', hidden: false },
            { name: "Uomstock", width: 30, editable: true, align: 'left', hidden: true },
            { name: "Uomsdesc", width: 80, editable: true, align: 'left', hidden: false },
            { name: "UsageStatus", width: 30, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ConversionFactor", width: 45, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", width: 30, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUnitofMeasure"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpUnitofMeasure",
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
            fnAddGridSerialNoHeading();
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpUnitofMeasure', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpUnitofMeasure', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUnitofMeasure
    }).jqGrid('navButtonAdd', '#jqpUnitofMeasure', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddUnitofMeasure
    });
    fnAddGridSerialNoHeading();
}

function fnAddUnitofMeasure() {
    fnClearFields();
    $("#txtUnitofMeasure").val('');
    $("#PopupUnitofMeasure").modal('show');
    $(".modal-title").text(localization.AddUnitofMeasure);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").attr('disabled', true);
    $("#btnSaveUnitofMeasure").html('<i class="fa fa-save"></i>' + localization.Save);
    $("#btnSaveUnitofMeasure").show();
    $("#btnDeactivateUnitofMeasure").hide();
}

function fnEditUnitofMeasure(e, actiontype) {
    fnClearFields();
    var rowid = $("#jqgUnitofMeasure").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUnitofMeasure').jqGrid('getRowData', rowid);
    
    $("#txtUnitofMeasure").val(rowData.UnitOfMeasure)
    $("#cboUOMPurchase").val(rowData.Uompurchase).selectpicker('refresh');
    $("#cboUOMStock").val(rowData.Uomstock).selectpicker('refresh');
    $("#txtConversionFactor").val(rowData.ConversionFactor);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateUnitofMeasure").html(localization.Deactivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateUnitofMeasure").html(localization.Activate);
    }
    
    $("#chkActiveStatus").prop('disabled', false);
    $(".modal-title").text(localization.EditUnitofMeasure);
    $("#btnSaveUnitofMeasure").html('<i class="fa fa-sync"></i>' + localization.Update);
    $("#btnSaveUnitofMeasure").attr("disabled", false);
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EAD_06_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupUnitofMeasure").modal('show');
        $("#btnSaveUnitofMeasure").show();
        fnEnableUnitofMeasure(false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveUnitofMeasure").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveUnitofMeasure").show();
        $("#btnDeactivateUnitofMeasure").hide();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EAD_06_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#PopupUnitofMeasure").modal('show');
        $("#btnSaveUnitofMeasure,#btnDeactivateUnitofMeasure").hide();
        fnEnableUnitofMeasure(true);
        $("#chkActiveStatus").prop('disabled', true);
        $(".modal-title").text(localization.ViewUnitofMeasure);
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EAD_06_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $("#PopupUnitofMeasure").modal('show');
        $("#btnSaveUnitofMeasure").hide();
        fnEnableUnitofMeasure(true);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnDeactivateUnitofMeasure").show();
        $(".modal-title").text(localization.ActiveOrDeactiveUnitofMeasure);
    }
    $("#PopupUnitofMeasure").on('hidden.bs.modal', function () {
        $("#btnSaveUnitofMeasure").show();
        fnEnableUnitofMeasure(false);
    });
}

function fnSaveUnitofMeasure() {

    if (validationUnitofMeasure() === false) {
        return;
    }
    uoms = {
        UnitOfMeasure: $("#txtUnitofMeasure").val() === '' ? 0 : $("#txtUnitofMeasure").val(),
        Uompurchase: $("#cboUOMPurchase").val(),
        Uomstock: $("#cboUOMStock").val(),
        UsageStatus:false,
        ConversionFactor: $("#txtConversionFactor").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $("#btnSaveUnitofMeasure").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Admin/Rules/InsertOrUpdateUnitofMeasurement',
        type: 'POST',
        datatype: 'json',
        data: { uoms },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveUnitofMeasure").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupUnitofMeasure").modal('hide');
                fnClearFields();
                fnLoadUnitofMeasureGrid();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveUnitofMeasure").attr("disabled", false);
                return false;
            }
            $("#btnSaveUnitofMeasure").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUnitofMeasure").attr("disabled", false);
        }
    });



}

function validationUnitofMeasure() {
    if ($("#cboUOMPurchase").val() == 0 || $("#cboUOMPurchase").val() == '0' || IsStringNullorEmpty($("#cboUOMPurchase").val())) {
        fnAlert("w", "EAD_06_00", "UI0170", errorMsg.UnitOfPurchase_E6)
        return false;
    }
    if ($("#cboUOMStock").val() == 0 || $("#cboUOMStock").val() == '0' || IsStringNullorEmpty($("#cboUOMStock").val())) {
        fnAlert("w", "EAD_06_00", "UI0172", errorMsg.UnitOfStock_E8)
        return false;
    }

    if (IsStringNullorEmpty($("#txtConversionFactor").val())) {
        fnAlert("w", "EAD_06_00", "UI0174", errorMsg.ConversionFactor_E10)
        return false;
    }
}

function fnGridRefreshUnitofMeasure() {

    $("#jqgUnitofMeasure").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#cboUOMPurchase").val('0').selectpicker('refresh');
    $("#cboUOMStock").val('0').selectpicker('refresh');
    $("#txtConversionFactor").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveUnitofMeasure").attr("disabled", false);
}

function fnEnableUnitofMeasure(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkActiveStatus").attr('disabled', val);
    $("#cboUOMPurchase").attr('disabled', val).selectpicker('refresh');
    $("#cboUOMStock").attr('disabled', val).selectpicker('refresh');
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnDeleteUnitofMeasure() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateUnitofMeasure").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Admin/Rules/ActiveOrDeActiveUnitofMeasure?status=' + a_status + '&unitId=' + $("#txtUnitofMeasure").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateUnitofMeasure").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupUnitofMeasure").modal('hide');
                fnGridRefreshUnitofMeasure();
                fnClearFields();
                $("#btnDeactivateUnitofMeasure").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateUnitofMeasure").attr("disabled", false);
                $("#btnDeactivateUnitofMeasure").html(localization.Deactivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateUnitofMeasure").attr("disabled", false);
            $("#btnDeactivateUnitofMeasure").html(localization.Deactivate);
        }
    });
}


