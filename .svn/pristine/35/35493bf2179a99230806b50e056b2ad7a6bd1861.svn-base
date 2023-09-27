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
   
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit+" </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View+" </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete+" </span>");
    $(".divTblParameter").css('max-height', '269px');
    $("#tbParameter td:last-child").css('width', '70px');
});

function fnLoadDocumentCtrlGrid() {

    $("#jqvDocContManagement").jqGrid('GridUnload');
    //var gridData = [{
    //    DocumentId: '1000', DocumentDesc: 'Test', ShortDesc: '', DocumentType: '', SchemeName: '', IsFinancialYearAppl: '', IsStoreLinkAppl: '', IsTransactionModeAppl: '', IsCustomerGroupAppl: '', UsageStatus: '', ActiveStatus: '', edit: ''
    //}];
    $("#jqvDocContManagement").jqGrid({
      
       url: getBaseURL() + '/Control/GetDocumentControlMaster',
       mtype: 'GET',
        datatype: 'json',
       // data: gridData,
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DocumentId, localization.DocumentDescription, localization.ShortDesc, localization.DocumentType, localization.Scheme, localization.UsageStatus, localization.Active,localization.Actions],
        colModel: [
            { name: "DocumentId", width: 30, editable: true, align: 'left', hidden: false },
            { name: "DocumentDesc", width: 220, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "ShortDesc", width: 45, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "DocumentType", width: 35, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "SchemeId", width: 35, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "UsageStatus", width: 30, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 30, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 30, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {

                    return '<button class="mr-1 btn btn-outline" id="btnDocContManagement"><i class="fa fa-ellipsis-v"></i></button>' 
                        //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditDocumentControl(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + '</button>' +
                        //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnViewDocumentControl(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + '</button>' +
                        //'<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnPopUpDeleteDocumentControl(event,\'delete\')" > <i class="fas fa-trash"></i>' + localization.Delete + '</button>'
            }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
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
        scrollOffset: 0,caption:'Document Control Management',
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
           // fnEditDocumentControl(JSON.stringify(rowData._id_));
            //alert("full row data:\n\n" + JSON.stringify(rowData._id_));
            //    return RowAction(rowData);
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
   // $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnsaveDocContrManagement").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnsaveDocContrManagement").show();
    $("#btnDeactivateDocumentControl").hide();

}

function fnEditDocumentControl(e) {
    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "EPS_08_00", "", errorMsg.editauth_E3);
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
            $("#cboSchemeName").val(rowData.SchemeId);
            $('#cboSchemeName').selectpicker('refresh');
            $("#txtDocumentDesc").val(rowData.DocumentDesc);
            $("#txtDocumentCategory").val(rowData.DocumentCategory);
            $("#txtCategoryDescription").val(rowData.DocCatgDesc);

    $.ajax({
        url: getBaseURL() + '/Control/GetDocumentParametersByID',
        data: {
            documentID: rowData.DocumentId
        },
        success: function (result) {
            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result);
        }
    });

        
            Isadd = 0;
            $('#PopupDocContrManagement').modal('show');
            $('#PopupDocContrManagement').find('.modal-title').text(localization.UpdateDocumentControl);
            $("#btnsaveDocContrManagement").html('<i class="fa fa-sync"></i>' + localization.Update);
            $("#btnsaveDocContrManagement").attr('disabled', false);
            $("#btnsaveDocContrManagement").show();
            $("#btnDeactivateDocumentControl").hide();
    $("#chkActiveStatus").prop('disabled', true);

    if (rowData.UsageStatus === "true") {
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
        })
    }
      
}

function fnSaveDocumentControl() {

    if (fnValidateDocumentControl() === false) {
        return;
    }
    var dPar = eSyaParams.GetJSONValue();
    var obj = {
            DocumentId: $("#txtDocumentId").val(),
            DocumentType: $("#txtDocumentType").val(),
            ShortDesc: $("#txtShortDesc").val(),
            DocumentDesc: $("#txtDocumentDesc").val(),
            SchemeId: $("#cboSchemeName").val(),
            UsageStatus: $("#chkUsageStatus").parent().hasClass("is-checked"),

            Isadd: Isadd,
            l_DocumentParameter:dPar
        };
    
    $("#btnsaveDocContrManagement").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Control/AddOrUpdateDocumentControl',
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
    
    //if ($("#cboformId").val() === "0" || $("#cboformId").val() === '0') {
    //    toastr.warning("Please Select Form");
    //    return false;
    //}
    if (IsStringNullorEmpty($("#txtDocumentId").val())) {
        fnAlert("w", "EPS_08_00", "UI0017", errorMsg.DocumentID_E1);
        return false;
    }
    
    if (IsStringNullorEmpty($("#txtDocumentType").val())) {
        fnAlert("w", "EPS_08_00", "UI0018", errorMsg.DocumenType_E2);
        return false;
    }
    if (IsStringNullorEmpty($("#txtShortDesc").val())) {
        fnAlert("w", "EPS_08_00", "UI0019", errorMsg.ShortDesc_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#cboSchemeName").val())) {
        fnAlert("w", "EPS_08_00", "UI0020", errorMsg.SelectScheme_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtDocumentDesc").val())) {
        fnAlert("w", "EPS_08_00", "UI0021", errorMsg.DocumentDesc_E8);
        return false;
    }
   
   
}

function fnRefreshDocumentControlGrid() {
    $("#jqvDocContManagement").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnViewDocumentControl(e) {
    if (_userFormRole.IsView === false) {
        fnAlert("w", "EPS_08_00", "UIC04", errorMsg.vieweauth_E4);
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
    $("#cboSchemeName").val(rowData.SchemeId);
    $('#cboSchemeName').selectpicker('refresh');
    $("#txtDocumentDesc").val(rowData.DocumentDesc);
    $("#txtDocumentCategory").val(rowData.DocumentCategory);
    $("#txtCategoryDescription").val(rowData.DocCatgDesc);

    $.ajax({
        url: getBaseURL() + '/Control/GetDocumentParametersByID',
        data: {
            documentID: rowData.DocumentId
        },
        success: function (result) {
            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result);
        }
    });


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
    })
}

function fnPopUpDeleteDocumentControl(e) {
    if (_userFormRole.IsDelete === false) {
        fnAlert("w", "", "", errorMsg.deleteauth_E5);
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
    $("#cboSchemeName").val(rowData.SchemeId);
    $('#cboSchemeName').selectpicker('refresh');
    $("#txtDocumentDesc").val(rowData.DocumentDesc);
    $("#txtDocumentCategory").val(rowData.DocumentCategory);
    $("#txtCategoryDescription").val(rowData.DocCatgDesc);

    $.ajax({
        url: getBaseURL() + '/Control/GetDocumentParametersByID',
        data: {
            documentID: rowData.DocumentId
        },
        success: function (result) {
            eSyaParams.ClearValue();
            eSyaParams.SetJSONValue(result);
        }
    });


    Isadd = 0;
    $('#PopupDocContrManagement').modal('show');
    $('#PopupDocContrManagement').find('.modal-title').text("Active/De Active Document Control");
    $("#btnsaveDocContrManagement").hide();
    $("#btnDeactivateDocumentControl").show();
    $("#chkActiveStatus").prop('disabled', true);
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("input[id*=chk]").attr('disabled', true);
    $("#PopupDocContrManagement").on('hidden.bs.modal', function () {
        $("#btnsaveDocContrManagement").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("input[id*=chk]").attr('disabled', false);
        $("#btnsaveDocContrManagement").attr('disabled', false);
    })
}

//$(document).on('click', function (e) {
//    console.log(e.target);
//    console.log(e.target.value);
//    if (e.target.id == 'chkIsVoucherTypeApplicable' && e.target.value == "on") {
        
//        $("#chkIsVoucherTypeApplicable").parent().addClass("is-checked");
//        $("#chkIsPaymentAndVoucherType").parent().removeClass("is-checked");
//        $(this).bind('click');
//    }
//    if (e.target.id == 'chkIsPaymentAndVoucherType' && e.target.value == "on") {
//        $('input[type="checkbox"]').prop('checked',false);
//        $("#chkIsPaymentAndVoucherType").parent().addClass("is-checked"); 
//        $("#chkIsVoucherTypeApplicable").parent().removeClass("is-checked");
//        $(this).bind('click');
//    }
//})

//function fnChkIsVoucherTypeApplicable(ele) {
//    debugger;
//    console.log(ele);
//    if (ele.checked) {
//        $('input[name="PaymentAndVoucherType"]').prop('checked', false);
//        $("#chkIsPaymentAndVoucherType").parent().removeClass("is-checked");
//        $("#chkIsVoucherTypeApplicable").parent().addClass("is-checked");
       

//    }
//    else {
//        $("#chkIsVoucherTypeApplicable").parent().removeClass("is-checked");
//    }
       
    
    
// }
//function fnChkIsPaymentAndVoucherType(ele) {
//    console.log(ele);
//    if (ele.checked) {
//        $('input[name="VoucherType"]').prop('checked', false);
//        $("#chkIsVoucherTypeApplicable").parent().removeClass("is-checked");
//        $("#chkIsPaymentAndVoucherType").parent().addClass("is-checked");
        
//    }
     
//   }

function fnClearFields() {
    $("#txtDocumentId").val('');
    $("#txtDocumentType").val('');
    $("#txtShortDesc").val('');
    $("#cboSchemeName").val('');
    $('#cboSchemeName').selectpicker('refresh');
    $("#txtDocumentDesc").val('');
    $("#chkUsageStatus").parent().removeClass("is-checked");

    $("#btnsaveDocContrManagement").attr('disabled', false);
    eSyaParams.ClearValue();
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
        url: getBaseURL() + '/Control/ActiveOrDeActiveDocumentControl?status=' + a_status + '&documentId=' + $("#txtDocumentId").val(),
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






