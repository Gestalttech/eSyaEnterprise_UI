//var _isClicked = '';
$(function () {
    //fnLoadDocumentSubmission();
    $.contextMenu({
        selector: "#btnDocumentSubmission",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDocumentSubmission(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDocumentSubmission(event, 'view') } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDocumentSubmission(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
})

function fnAddDocumentDetailsTab() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        fnAlert("w", "EPT_03_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }

    //if (_isClicked == 0 || null || undefined) {
    //    toastr.warning("Please select any row on the grid");
    //}

    else {

        var rowid = $("#jqgPatientCategoryAttribute").jqGrid('getGridParam', 'selrow');

        if (rowid == null) {
            fnAlert("w", "EPT_03_00", "UIC13", errorMsg.SelectRow_E2);
            return;
        }

        $("#sectionGrid").css('display', 'none');
        $('#sectionTabs').css('display', 'block');
        //_isClicked = 0;
        var rowData = $('#jqgPatientCategoryAttribute').jqGrid('getRowData', rowid);
        $("#DocumentPatientType").empty();
        $("#DocumentPatientType").append(rowData.PatientTypeDesc);
        $("#DocumentPatientCategory").empty();
        $("#DocumentPatientCategory").append(rowData.PatientCategoryDesc);
        $("#hdPatientTypeId").val(rowData.PatientTypeId);
        $("#hdPatientCategoryId").val(rowData.PatientCategoryId);
        fnLoadDocumentSubmission(rowData);
        $("#btnClearDocumentdetails").show();
        $("input,textarea").attr('readonly', false);
    }
}

function fnLoadDocumentSubmission(rowData) {
    $("#jqgDocumentSubmission").jqGrid('GridUnload');
    $("#jqgDocumentSubmission").jqGrid({
        url: getBaseURL() + '/PatientTypes/GetDocumentDetails?businesskey=' + rowData.BusinessKey + '&PatientTypeId=' + rowData.PatientTypeId + '&PatientCategoryId=' + rowData.PatientCategoryId,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DocumentID, localization.DocumentDesc, localization.ActiveStatus, localization.Actions],

        colModel: [

            { name: "DocumentId", width: 250, editable: false, align: 'left', hidden: true },
            { name: "DocumentDesc", width: 350, editable: false, align: 'left' },
            {
                name: "ActiveStatus", width: 200, editable: true, align: 'center', hidden: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true }
            },
            {
                name: 'edit', search: false, align: 'center', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDocumentSubmission"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpDocumentSubmission",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        caption: localization.DocumentSubmission,
        loadComplete: function (data) {
            $("#jqgDocumentSubmission").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        }
    }).jqGrid('navGrid', '#jqpDocumentSubmission', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDocumentSubmission', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDocumentSubmission
    }).jqGrid('navButtonAdd', '#jqpDocumentSubmission', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddjqpDocumentSubmission
    });

    fnAddGridSerialNoHeading();
}

function fnAddjqpDocumentSubmission() {
    $("#PopupDocumentSubmission").modal('show');
    $('#PopupDocumentSubmission').modal({ backdrop: 'static', keyboard: false });
    $('#PopupDocumentSubmission').find('.modal-title').text(localization.AddDocument);
    fnClearDocumentFields();
    $("#chkdocActiveStatus").parent().addClass("is-checked");
    $("#chkdocActiveStatus").prop('disabled', true);
    $("#btnSaveDocumentSubmission").html('<i class="fa fa-save"></i>  ' + localization.Save);
    $("#btnSaveDocumentSubmission").show();
    //$("#btnDeactivateApplicationCode").hide();
}
function fnEditDocumentSubmission(e, actiontype) {
    var rowid = $("#jqgDocumentSubmission").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDocumentSubmission').jqGrid('getRowData', rowid);


    $('#txtDocumentID').val(rowData.DocumentId);
    $("#txtDocumentDescription").val(rowData.DocumentDesc);

    if (rowData.ActiveStatus == 'true') {
        $("#chkdocActiveStatus").parent().addClass("is-checked");

    }
    else {
        $("#chkdocActiveStatus").parent().removeClass("is-checked");

    }
    $("#btnSaveDocumentSubmission").attr('disabled', false);
    if (actiontype.trim() == "edit") {
        //if (_userFormRole.IsEdit === false) {
        //    toastr.warning("your Not Authorized to Edit");
        //    return;
        //}
        $('#PopupDocumentSubmission').modal('show');
        $('#PopupDocumentSubmission').find('.modal-title').text(localization.UpdateDocument);
        $("#chkdocActiveStatus").prop('disabled', false);
        $("#btnSaveDocumentSubmission").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
        $("#btnSaveDocumentSubmission").show();
    }
    if (actiontype.trim() == "view") {
        //if (_userFormRole.IsView === false) {
        //    toastr.warning("your Not Authorized to View");
        //    return;
        //}
        $('#PopupDocumentSubmission').modal('show');
        $('#PopupDocumentSubmission').find('.modal-title').text(localization.ViewDocument);
        $("#chkdocActiveStatus").prop('disabled', true);
        $("#btnSaveDocumentSubmission").hide();
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }

}
function fnGridRefreshDocumentSubmission() {
    $("#jqgDocumentSubmission").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearDocumentFields() {
    $("#txtDocumentID").val("");
    //$("#chkActiveStatus").prop('disabled', false);
    $("#txtDocumentDescription").val("");
    $("#btnSaveDocumentSubmission").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
}

function fnSaveDocumentSubmission() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
       fnAlert("w", "EPT_03_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientTypeId').val())) {
        fnAlert("w", "EPT_03_00", "UI0274", errorMsg.SelectRowToSelectPatientType_E3);
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientCategoryId').val())) {
       fnAlert("w", "EPT_03_00", "UI0275", errorMsg.SelectRowToSelectPatientCategory_E4);
        return;
    }
    if (IsStringNullorEmpty($('#txtDocumentDescription').val())) {
        fnAlert("w", "EPT_03_00", "UI0021", errorMsg.DocumentDescription_E6);
        $('#txtDocumentDescription').focus();
        return;
    }

    $("#btnSaveDocumentSubmission").attr('disabled', true);
    var obj = {
        BusinessKey: $('#cboBusinessLocation').val(),
        PatientTypeId: $('#hdPatientTypeId').val(),
        PatientCategoryId: $('#hdPatientCategoryId').val(),
        DocumentId: $("#txtDocumentID").val() === '' ? 0 : $("#txtDocumentID").val(),
        DocumentDesc: $('#txtDocumentDescription').val(),
        ActiveStatus: $("#chkdocActiveStatus").parent().hasClass("is-checked")
    };
    $.ajax({
        url: getBaseURL() + '/PatientTypes/InsertOrUpdateDocumentDetails',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveDocumentSubmission").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#btnSaveDocumentSubmission").attr('disabled', false);
                fnGridRefreshDocumentSubmission();
                $('#PopupDocumentSubmission').modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDocumentSubmission").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDocumentSubmission").attr("disabled", false);
        }
    });
}