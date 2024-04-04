var Isadd = 0;

$(document).ready(function () {

    fnLoadDocumentCtrlGrid();

    //var edit = _userFormRole.IsEdit;
    //var edit = false;
    //var vie = _userFormRole.IsView;
    //var del = _userFormRole.IsDelete;

    $.contextMenu({

        // define which elements trigger this menu
        selector: "#btnDocContManagement",
        trigger: 'left',
        // define the elements of the menu

        items: {
            jqgEdit:
            {
                name: localization.Edit, icon: "edit", id: "jqgEdit", callback: function (key, opt) {
                    fnEditDocumentControl(event, key)
                }
                //,
                //visible: function () {
                //    return edit;
                //}

            },
            jqgView: { name: localization.View, icon: "view", "id": "jqgView", callback: function (key, opt) { fnViewDocumentControl(event) } },
            //jqgDelete:
            //{
            //    name: localization.Delete, icon: "delete", "id": "jqgDelete", callback: function (key, opt) {
            //        fnPopUpDeleteDocumentControl(event)
            //    }
            //    ////,
            //    ////visible: function () {
            //    ////    return del;
            //    ////}
            //},

        }
        // there's more, have a look at the demos and docs...
    });

    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
    $(".divTblParameter").css('max-height', '269px');
    $("#tbParameter td:last-child").css('width', '70px');
});

function fnLoadDocumentCtrlGrid() {

    $("#jqvDocContManagement").jqGrid('GridUnload');
   
    $("#jqvDocContManagement").jqGrid({

        url: getBaseURL() + '/CalendarControl/GetDocumentControlMaster',
        mtype: 'GET',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DocumentId, localization.GenLogic, localization.CalendarType, localization.IsTransationMode, localization.IsStoreCode, localization.IsPaymentMode, localization.SchemaId,localization.ComboId, localization.DocumentDescription, localization.ShortDesc, localization.DocumentType, localization.UsageStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "DocumentId", width: 30, editable: true, align: 'left', hidden: false },
            { name: "GeneLogic", width: 40, editable: true, align: 'left', resizable: false, hidden: false, formatter: 'select', edittype: 'select', editoptions: { value: "C:Continuos;Y:Yearwise;M:Monthwise;D:Datewise" }},
            { name: "CalendarType", width: 40, editable: true, align: 'left', resizable: false, hidden: false, formatter: 'select', edittype: 'select', editoptions: { value: "NA:NotApplicable;FY:FinancialYear;CY:CalendarYear" } },
            { name: "IsTransationMode", width: 30, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "IsStoreCode", width: 30, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "IsPaymentMode", width: 30, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "SchemaId", width: 60, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "ComboId", width: 30, editable: true, align: 'left', resizable: false, hidden: true },
            { name: "DocumentDesc", width: 220, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "ShortDesc", width: 45, editable: true, align: 'left', resizable: false, hidden: true },
            { name: "DocumentType", width: 35, editable: true, align: 'left', resizable: false, hidden: true },
            { name: "UsageStatus", width: 30, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
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
        pager: "#jqpDocContManagement",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: localization.DocumentControlManagement,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqvDocContManagement");
        },
        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }
            
        },

    }).jqGrid('navGrid', '#jqpDocContManagement', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDocContManagement', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDocumentControlGrid
    }).jqGrid('navButtonAdd', '#jqpDocContManagement', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDocumentControl
    });
    fnAddGridSerialNoHeading();
}

function fnAddDocumentControl() {
    fnClearFields();
    Isadd = 1;
    $("#txtDocumentId").prop('readonly', false);
    $('#PopupDocContrManagement').modal('show');
    $('#PopupDocContrManagement').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDocContrManagement').find('.modal-title').text(localization.AddDocumentControl);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnsaveDocContrManagement").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnsaveDocContrManagement").show();
    $("#btnDeactivateDocumentControl").hide();

}

function fnEditDocumentControl(e) {
    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "ECD_02_00", "UIC02", errorMsg.editauth_E3);
        return;
    }

    var rowid = $("#jqvDocContManagement").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqvDocContManagement').jqGrid('getRowData', rowid);
    
    $("#txtDocumentId").val(rowData.DocumentId);
    $("#txtDocumentId").prop('readonly', true);
    $("#txtShortDesc").val(rowData.ShortDesc);
    $("#txtDocumentType").val(rowData.DocumentType);
    $("#txtSchemaName").val(rowData.SchemaId);
    $("#txtDocumentDesc").val(rowData.DocumentDesc);
    $("#cboGenLogin").val(rowData.GeneLogic).selectpicker('refresh');
    $("#cboCalendarType").val(rowData.CalendarType).selectpicker('refresh');
    $("#txtcomboId").val(rowData.ComboId);

    Isadd = 0;
    $('#PopupDocContrManagement').modal('show');
    $('#PopupDocContrManagement').find('.modal-title').text(localization.UpdateDocumentControl);
    $("#btnsaveDocContrManagement").html('<i class="fa fa-sync"></i>' + localization.Update);
    $("#btnsaveDocContrManagement").attr('disabled', false);
    $("#btnsaveDocContrManagement").show();
    $("#btnDeactivateDocumentControl").hide();
    $("#chkActiveStatus").prop('disabled', true);

    if (rowData.IsTransationMode === "true") {

        $("#chkIsTransactionMode").parent().addClass("is-checked");
    } else {
        $("#chkIsTransactionMode").parent().removeClass("is-checked");
    }

    if (rowData.IsStoreCode === "true") {

        $("#chkIsStoreCode").parent().addClass("is-checked");
    } else {
        $("#chkIsStoreCode").parent().removeClass("is-checked");
    }

    if (rowData.IsPaymentMode === "true") {

        $("#chkIsPaymentMode").parent().addClass("is-checked");
    } else {
        $("#chkIsPaymentMode").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus === "true") {

        $("#chkActiveStatus").parent().addClass("is-checked");
    } else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    $('#PopupDocContrManagement').find('.modal-title').text(localization.UpdateDocumentControl);
    $("#btnsaveDocContrManagement").show();
    $("#btnDeactivateDocumentControl").hide();
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("input[id*=chk]").attr('disabled', false);
    $("#txtDocumentId").prop('readonly', true);
    $("#PopupDocContrManagement").on('hidden.bs.modal', function () {
        $("#btnsaveDocContrManagement").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("input[id*=chk]").attr('disabled', false);
        $("#btnsaveDocContrManagement").attr('disabled', false);
    });
  

}

function fnSaveDocumentControl() {

    if (fnValidateDocumentControl() === false) {
        return;
    }
    var obj = {
        DocumentId: $("#txtDocumentId").val(),
        GeneLogic: $("#cboGenLogin").val(),
        CalendarType: $("#cboCalendarType").val(),
        DocumentType: $("#txtDocumentType").val(),
        ShortDesc: $("#txtShortDesc").val(),
        DocumentDesc: $("#txtDocumentDesc").val(),
        SchemaId: $("#txtSchemaName").val(),
        IsTransationMode: $("#chkIsTransactionMode").parent().hasClass("is-checked"),
        IsStoreCode: $("#chkIsStoreCode").parent().hasClass("is-checked"),
        IsPaymentMode: $("#chkIsPaymentMode").parent().hasClass("is-checked"),
        UsageStatus: false,
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
        Isadd: Isadd,
        ComboId: $("#txtcomboId").val()
    };

    $("#btnsaveDocContrManagement").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/CalendarControl/AddOrUpdateDocumentControl',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnsaveDocContrManagement").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDocContrManagement').modal('hide');
                fnRefreshDocumentControlGrid();
                fnClearFields()
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnsaveDocContrManagement").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnsaveDocContrManagement").attr('disabled', false);
        }
    });



}

function fnValidateDocumentControl() {

    if (IsStringNullorEmpty($("#txtDocumentId").val())) {
        fnAlert("w", "ECD_02_00", "UI0017", errorMsg.DocumentID_E1);
        return false;
    }

    if (IsStringNullorEmpty($("#txtDocumentType").val())) {
        fnAlert("w", "ECD_02_00", "UI0018", errorMsg.DocumenType_E2);
        return false;
    }
    if (IsStringNullorEmpty($("#txtShortDesc").val())) {
        fnAlert("w", "ECD_02_00", "UI0019", errorMsg.ShortDesc_E6);
        return false;
    }
    if ($("#cboGenLogin").val() == 0) {
        fnAlert("w", "ECD_02_00", "UI0304", errorMsg.GeneLogin_E9);
        return false;
    }
    if ($("#cboCalendarType").val() == 0) {
        fnAlert("w", "ECD_02_00", "UI0214", errorMsg.CalendarType_E10);
        return false;
    }
    if (IsStringNullorEmpty($("#txtSchemaName").val())) {
        fnAlert("w", "ECD_02_00", "UI0020", errorMsg.EnterSchema_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtDocumentDesc").val())) {
        fnAlert("w", "ECD_02_00", "UI0021", errorMsg.DocumentDesc_E8);
        return false;
    }


}

function fnRefreshDocumentControlGrid() {
    $("#jqvDocContManagement").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnViewDocumentControl(e) {
    if (_userFormRole.IsView === false) {
        fnAlert("w", "ECD_02_00", "UIC04", errorMsg.vieweauth_E4);
        return;
    }
    var rowid = $("#jqvDocContManagement").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqvDocContManagement').jqGrid('getRowData', rowid);
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqvDocContManagement').jqGrid('getRowData', rowid);
    $("#txtDocumentId").val(rowData.DocumentId);
    $("#txtDocumentId").prop('readonly', true);
    $("#txtShortDesc").val(rowData.ShortDesc);
    $("#txtDocumentType").val(rowData.DocumentType);
    $("#txtSchemaName").val(rowData.SchemaId);
    $("#txtDocumentDesc").val(rowData.DocumentDesc);
    $("#txtcomboId").val(rowData.ComboId);
    $("#cboGenLogin").val(rowData.GeneLogic).selectpicker('refresh');
    $("#cboCalendarType").val(rowData.CalendarType).selectpicker('refresh');
    if (rowData.IsTransationMode === "true") {

        $("#chkIsTransactionMode").parent().addClass("is-checked");
    } else {
        $("#chkIsTransactionMode").parent().removeClass("is-checked");
    }

    if (rowData.IsStoreCode === "true") {

        $("#chkIsStoreCode").parent().addClass("is-checked");
    } else {
        $("#chkIsStoreCode").parent().removeClass("is-checked");
    }

    if (rowData.IsPaymentMode === "true") {

        $("#chkIsPaymentMode").parent().addClass("is-checked");
    } else {
        $("#chkIsPaymentMode").parent().removeClass("is-checked");
    }
    if (rowData.ActiveStatus === "true") {

        $("#chkActiveStatus").parent().addClass("is-checked");
    } else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    Isadd = 0;
    $('#PopupDocContrManagement').modal('show');
    $('#PopupDocContrManagement').find('.modal-title').text(localization.ViewDocumentControl);
    $("#btnsaveDocContrManagement").hide();
    $("#btnDeactivateDocumentControl").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("input[id*=chk]").attr('disabled', true);
    $("#PopupDocContrManagement").on('hidden.bs.modal', function () {
        $("#btnsaveDocContrManagement").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("input[id*=chk]").attr('disabled', false);
        $("#btnsaveDocContrManagement").attr('disabled', false);
    });
}


function fnClearFields() {
    
    $("#txtcomboId").val('');
    $("#txtDocumentId").val('');
    $("#txtDocumentType").val('');
    $("#txtShortDesc").val('');
    $("#txtSchemaName").val('');
    $("#txtDocumentDesc").val('');
    $("#cboGenLogin").val('0').selectpicker('refresh');
    $("#cboCalendarType").val('0').selectpicker('refresh');
    $("#chkIsTransactionMode").parent().removeClass("is-checked");
    $("#chkIsStoreCode").parent().removeClass("is-checked");
    $("#chkIsPaymentMode").parent().removeClass("is-checked");

    $("#chkUsageStatus").parent().removeClass("is-checked");
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnsaveDocContrManagement").attr('disabled', false);
}

function fnDeleteDocumentControl() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateDocumentControl").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/CalendarControl/ActiveOrDeActiveDocumentControl?status=' + a_status + '&documentId=' + $("#txtDocumentId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateDocumentControl").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupDocContrManagement').modal('hide');
                fnClearFields();
                fnRefreshDocumentControlGrid();
                $("#btnDeactivateDocumentControl").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateDocumentControl").attr("disabled", false);
                $("#btnDeactivateDocumentControl").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateDocumentControl").attr("disabled", false);
            $("#btnDeactivateDocumentControl").html('De Activate');
        }
    });
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}


//function fnPopUpDeleteDocumentControl(e) {
//    if (_userFormRole.IsDelete === false) {
//        fnAlert("w", "ECD_02_00", "UIC03", errorMsg.deleteauth_E5);
//        return;
//    }
//    var rowid = $("#jqvDocContManagement").jqGrid('getGridParam', 'selrow');
//    var rowData = $('#jqvDocContManagement').jqGrid('getRowData', rowid);
//    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
//    //var rowData = $('#jqvDocContManagement').jqGrid('getRowData', rowid);
//    $("#txtDocumentId").val(rowData.DocumentId);
//    $("#txtDocumentId").prop('readonly', true);
//    $("#txtShortDesc").val(rowData.ShortDesc);
//    $("#txtDocumentType").val(rowData.DocumentType);
//    $("#txtSchemaName").val(rowData.SchemeId);
//    $("#txtDocumentDesc").val(rowData.DocumentDesc);
//    if (rowData.UsageStatus === "true") {

//        $("#chkUsageStatus").parent().addClass("is-checked");
//    } else {
//        $("#chkUsageStatus").parent().removeClass("is-checked");
//    }
//    if (rowData.ActiveStatus === "true") {

//        $("#chkActiveStatus").parent().addClass("is-checked");
//    } else {
//        $("#chkActiveStatus").parent().removeClass("is-checked");
//    }
//    Isadd = 0;
//    $('#PopupDocContrManagement').modal('show');
//    $('#PopupDocContrManagement').find('.modal-title').text("Active/De Active Document Control");
//    $("#btnsaveDocContrManagement").hide();
//    $("#btnDeactivateDocumentControl").show();
//    $("#chkActiveStatus").prop('disabled', true);
//    $("input,textarea").attr('readonly', true);
//    $("select").next().attr('disabled', true);
//    $("input[id*=chk]").attr('disabled', true);
//    $("#PopupDocContrManagement").on('hidden.bs.modal', function () {
//        $("#btnsaveDocContrManagement").show();
//        $("input,textarea").attr('readonly', false);
//        $("select").next().attr('disabled', false);
//        $("input[id*=chk]").attr('disabled', false);
//        $("#btnsaveDocContrManagement").attr('disabled', false);
//    });
//}



