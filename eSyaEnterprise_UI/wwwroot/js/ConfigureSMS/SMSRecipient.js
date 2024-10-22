var isUpdate = 0;
$(document).ready(function () {
    $('#cboBusinessLocation').selectpicker('refresh');
    $('#cboFormId').selectpicker('refresh');
    //fnGridLoadSMSToWhom();
    fnGridLoadEmptyGridSMSToWhom();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnSMSToWhom",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditSMSRecipient(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditSMSRecipient(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $.contextMenu({
        selector: "#btnSMSRecipient",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditSMSRecipient_popup(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditSMSRecipient_popup(event, 'view') } },
        }
    });
   
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");
});
function fnOnFormIdChange() {
    fnGridLoadSMSToWhom();
    fnFillSMSDescription();
}
function fnGridLoadEmptyGridSMSToWhom() {
    $("#jqgSMSToWhom").jqGrid('GridUnload');
    $("#jqgSMSToWhom").jqGrid({
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSID, localization.SMSDescription, localization.SMSStatement, localization.Active, localization.Actions], //, "Select"
        colModel: [
            { name: "Smsid", width: 70, editable: true, align: 'left' },
            { name: "Smsdescription", width: 270, editable: false, align: 'left', resizable: true },
            { name: "Smsstatement", width: 105, align: 'left', resizable: true, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 38, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
            //{
            //    name: 'Actions', search: false, align: 'left', width: 74, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" ><i class="far fa-eye"></i> ' + localization.View + ' </button>' 

            //    }
            //}
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSMSToWhom"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSMSToWhom",
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
        caption: localization.SMSToWhom,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgSMSToWhom");
        },

        onSelectRow: function (rowid, status, e) {
          
        },
    }).jqGrid('navGrid', '#jqpSMSToWhom', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", position: "first", onClickButton: fnGridRefresh
    }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', position: 'first', onClickButton: fnAddSMSRecipient
    });
    fnAddGridSerialNoHeading();
}

function fnGridLoadSMSToWhom() {
    $("#jqgSMSToWhom").jqGrid('GridUnload');
    $("#jqgSMSToWhom").jqGrid({
        url: getBaseURL() + '/Engine/GetSMSHeaderForRecipientByFormIdandParamId?formId=' + $("#cboFormId").val() + '&parameterId=5',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.SMSID, localization.SMSDescription, localization.SMSStatement, localization.Active, localization.Actions], //, "Select"
        colModel: [
            { name: "Smsid", width: 70, editable: true, align: 'left' },
            { name: "Smsdescription", width: 270, editable: false, align: 'left', resizable: true },
            { name: "Smsstatement", width: 105, align: 'left', resizable: true, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 38, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            //{
            //    name: 'Actions', search: false, align: 'left', width: 74, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        //return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditSMSRecipient(event,\'edit\')"><i class="fas fa-pen"></i> Edit </button>' +
            //        //    '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnEditSMSRecipient(event,\'view\')"><i class="far fa-eye"></i> View </button>'
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit", onclick="return fnEditSMSRecipient(event,\'edit\')"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title ="View" id = "jqgView", onclick = "return fnEditSMSRecipient(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View + ' </button>' 

            //    }
            //}

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSMSToWhom"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSMSToWhom",
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
        caption: localization.SMSToWhom,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgSMSToWhom");
        },
        onSelectRow: function (rowid, status, e) {
           
        },
    }).jqGrid('navGrid', '#jqpSMSToWhom', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefresh
    }).jqGrid('navButtonAdd', '#jqpSMSToWhom', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddSMSRecipient
    });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnFillSMSDescription() {

    if ($('#cboFormId').val() != '' && $('#cboFormId').val() != null) {
        $.getJSON(getBaseURL() + '/Engine/GetSMSHeaderForRecipientByFormIdandParamId?formId=' + $('#cboFormId').val() + '&parameterId=5', function (result) {
            var options = $("#cboSMSDescription");
            $("#cboSMSDescription").empty();
            options.append($("<option />").val('0').text('Select'));
            $.each(result, function () {
                options.append($("<option />").val(this.Smsid).text(this.Smsdescription));
            });
            $('#cboSMSDescription').selectpicker('refresh');
        });
    }
}

function fnGridLoadSMSRecipient() {
    $("#jqgSMSRecipient").jqGrid('GridUnload');
    $("#jqgSMSRecipient").jqGrid({
        url: getBaseURL() + '/Engine/GetSMSRecipientByBusinessKeyAndSMSId?businessKey=' + $("#cboBusinessLocation").val() + '&smsId=' + $("#cboSMSDescription").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.RecipientName, localization.ISDCode, localization.MobileNumber, localization.Remarks, localization.Active, localization.Actions],
        colModel: [
            { name: "RecipientName", width: 165, editable: true, align: 'left' },
            { name: "Isdcode", width: 150, editable: false, align: 'left', resizable: true },
            { name: "MobileNumber", width: 150, editable: false, align: 'left', resizable: true },
            { name: "Remarks", width: 195, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 25 } },
            { name: "ActiveStatus", editable: true, width: 148, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 55, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnSMSRecipient"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpSMSRecipient",
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
        scrollOffset: 0, caption: localization.SMSRecipient,
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgSMSRecipient");
        },
        onSelectRow: function (rowid) {
           
        },
    }).jqGrid('navGrid', '#jqpSMSRecipient', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpSMSRecipient', {
        caption: '<span class="fa fa-plus"></span> Add', buttonicon: "none", id: "custAdd", position: "first", onClickButton: fnAddSMSRecipient_popup
    });
    fnAddGridSerialNoHeading();
}

function fnAddSMSRecipient() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        fnAlert("w", "ESE_05_00", "UI0106", errorMsg.BusinessLocationRecipient_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboFormId").val())) {
        fnAlert("w", "ESE_05_00", "UI0108", errorMsg.FormName_E7);
        return;
    }
    $('#PopupSMSToWhom').find('.modal-title').text(localization.AddRecipient);
    $("#secSMSRecipient").hide();
    $("#PopupSMSToWhom").modal("show");
    $('#cboMobileNumber').attr('disabled', false).selectpicker('refresh');
    $('#txtMobileNumber').attr('disabled', false);
    $("#btnSMSSaveRecipient").show();
    fnGridLoadSMSRecipient();
    isUpdate = 0;
    $('#cboMobileNumber').attr('disabled', false).selectpicker('refresh');
    $('#txtMobileNumber').attr('disabled', false);
}


function fnAddSMSRecipient_popup() {
    if (IsStringNullorEmpty($("#cboSMSDescription").val()) || $("#cboSMSDescription").val() == "0") {
        fnAlert("w", "ESE_05_00", "UI0109", errorMsg.SMSDesc_E10);
        return false;
    }
    $('#txtRecipientName').val('');
    $('#txtMobileNumber').val('');
    $('#txtRemarks').val('');
    $("#chkSMSRecActiveStatus").parent().removeClass("is-checked");
    $("#secSMSRecipient").show();
    $("input,textarea").attr('disabled', false);
    $("select").next().attr('disabled', false);
    $("#btnSMSSaveRecipient").show();
    $("#chkSMSRecActiveStatus").prop('disabled', false);
    isUpdate = 0;
    fnGridRefreshSMSRecipient();
}
function fnEditSMSRecipient_popup(e, actiontype) {
    var rowid = $("#jqgSMSRecipient").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSMSRecipient').jqGrid('getRowData', rowid);

    $('#txtRecipientName').val(rowData.RecipientName);
    $('#cboMobileNumber').val(rowData.Isdcode).selectpicker('refresh');
    $('#txtMobileNumber').val(rowData.MobileNumber);
    $('#cboMobileNumber').attr('disabled', true).selectpicker('refresh');
    $('#txtRemarks').val(rowData.Remarks);

    if (rowData.ActiveStatus == 'true') {
        $("#chkSMSRecActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkSMSRecActiveStatus").parent().removeClass("is-checked");
    }
    $("#secSMSRecipient").show();

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ESE_05_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#txtRecipientName,#txtRemarks').attr('disabled', false);
        $("#btnSMSSaveRecipient").show();
        $("#chkSMSRecActiveStatus").prop('disabled', false);
        $('#txtMobileNumber').attr('disabled', true);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ESE_05_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#txtRecipientName,#txtRemarks,#txtMobileNumber').attr('disabled', true);
         $("#btnSMSSaveRecipient").hide();
        $("#chkSMSRecActiveStatus").prop('disabled', true);
    }
    isUpdate = 1;
}
$("#PopupSMSToWhom").on('hidden.bs.modal', function () {
    $("#secSMSRecipient").hide();
    fnGridRefresh();
    $('#txtRecipientName').attr('disabled', false);
    $('#txtEmailId').attr('disabled', false);
    $('#txtMobileNumber').attr('disabled', false);
    $("#jqgSMSToWhom").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#cboSMSDescription").val('0').selectpicker('refresh');
    $("#jqgSMSRecipient").jqGrid('GridUnload');
});
function fnSaveSMSRecipient() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        fnAlert("w", "ESE_05_00", "UI0106", errorMsg.BusinessLocation_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#cboFormId").val())) {
        fnAlert("w", "ESE_05_00", "UI0108", errorMsg.FormName_E9);
        return false;
    }

    if (IsStringNullorEmpty($("#cboSMSDescription").val()) || $("#cboSMSDescription").val() == "0") {
        fnAlert("w", "ESE_05_00", "UI0109", errorMsg.SMSDesc_E10);
        return false;
    }
    if (IsStringNullorEmpty($("#txtRecipientName").val())) {
        fnAlert("w", "ESE_05_00", "UI0110", errorMsg.RecipientName_E11);
        return false;
    }
    else if (IsStringNullorEmpty($("#cboMobileNumber").val()) || $("#cboMobileNumber").val() == 0 || $("#cboMobileNumber").val()=='0') {
        fnAlert("w", "ESE_05_00", "UI0056", errorMsg.ISDCode_E13);
        return false;
    }
    else if (IsStringNullorEmpty($("#txtMobileNumber").val())) {
        fnAlert("w", "ESE_05_00", "UI0111", errorMsg.MobileNumber_E12);
        return false;
    }
    else {

        $("#btnSMSSaveRecipient").attr("disabled", true);
       
        var sm_sr = {
            BusinessKey: $("#cboBusinessLocation").val(),
            Smsid: $("#cboSMSDescription").val(),
            Isdcode:$("#cboMobileNumber").val(),
            MobileNumber: $("#txtMobileNumber").val(),
            RecipientName: $("#txtRecipientName").val(),
            Remarks: $("#txtRemarks").val(),
            ActiveStatus: $("#chkSMSRecActiveStatus").parent().hasClass("is-checked")
        }

        var URL = getBaseURL() + '/Engine/InsertIntoSMSRecipient';
        if (isUpdate == 1)
            URL = getBaseURL() + '/Engine/UpdateSMSRecipient';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: { sm_sr },
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupSMSToWhom").modal("hide");
                    fnGridRefreshSMSRecipient();
                    fnClearFields();
                    $('#cboMobileNumber').attr('disabled', false).selectpicker('refresh');
                    $('#txtMobileNumber').attr('disabled', false);
                    isUpdate = 0;
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSMSSaveRecipient").attr('disabled', false);
                }

            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSMSSaveRecipient").attr("disabled", false);
            }
        });
    }
}

function fnEditSMSRecipient(e, actiontype) {
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgSMSToWhom').jqGrid('getRowData', rowid);
    var rowid = $("#jqgSMSToWhom").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgSMSToWhom').jqGrid('getRowData', rowid);
    $("#cboSMSDescription").attr('disabled', true);
    $('#cboSMSDescription').val(rowData.Smsid);
    $('#cboSMSDescription').selectpicker('refresh');
    fnGridLoadSMSRecipient();
   
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ESE_05_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupSMSToWhom").modal("show");
        $("#btnSMSSaveRecipient").show();
        $('#PopupSMSToWhom').find('.modal-title').text(localization.EditRecipient);
        fnEnableRecipientDetail(false);
        isUpdate = 1;
    }
    if (actiontype.trim() == "view") {

        if (_userFormRole.IsView === false) {
            fnAlert("w", "ESE_05_00", "UIC03", errorMsg.vieweauth_E3);
           
            return;
        }
        $("#PopupSMSToWhom").modal("show");
        $("#btnSMSSaveRecipient").hide();
        $('#PopupSMSToWhom').find('.modal-title').text(localization.ViewRecipient);
        fnEnableRecipientDetail(true);
        isUpdate = 1;
    }
}

function fnGridRefresh() {
    $("#jqgSMSToWhom").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridRefreshSMSRecipient() {
    $("#jqgSMSRecipient").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtRecipientName").val('');
    $("#txtMobileNumber").val('');
    $("#txtRemarks").val('');
    $('#chkSMSRecActiveStatus').parent().addClass("is-checked");
    $("#btnSMSSaveRecipient").attr('disabled', false);
    $("#cboSMSDescription").attr('disabled', false);
    $('#cboSMSDescription').selectpicker('refresh');
    fnEnableRecipientDetail(false);
    $('#cboMobileNumber').attr('disabled', false).selectpicker('refresh');
    $('#txtMobileNumber').attr('disabled', false);
}

function fnEnableRecipientDetail(val) {
    $("#txtRecipientName").attr('readonly', val);
    $("#txtMobileNumber").attr('readonly', val);
    $("#txtRemarks").attr('readonly', val);
    $("#chkSMSRecActiveStatus").attr('disabled', val);
}