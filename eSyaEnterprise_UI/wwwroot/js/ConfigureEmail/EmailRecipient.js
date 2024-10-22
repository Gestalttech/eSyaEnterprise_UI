var isUpdate = 0;
$(document).ready(function () {
    $('#cboBusinessLocation').selectpicker('refresh');
    $('#cboFormId').selectpicker('refresh');
    //fnGridLoadEmailToWhom();
    fnGridLoadEmptyGridEmailToWhom();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnEmailToWhom",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditEmailRecipient(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditEmailRecipient(event, 'view') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");

    $.contextMenu({
        selector: "#btnEmailRecipient",
        trigger: 'left',
         items: {
             jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditEmailRecipient_popup(event, 'edit') } },
             jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditEmailRecipient_popup(event, 'view') } },
        }
     });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");

});
function fnOnFormIdChange() {
    fnGridLoadEmailToWhom();
    fnFillEmailDescription();
}
function fnGridLoadEmptyGridEmailToWhom() {
    $("#jqgEmailToWhom").jqGrid('GridUnload');
    $("#jqgEmailToWhom").jqGrid({
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["EmailTemp ID", "EmailType","EmailTemp Desc", localization.Active, localization.Actions], //, "Select"
        colModel: [
            { name: "EmailTempid", width: 70, editable: true, align: 'left' },
            { name: "EmailType", width: 270, editable: false, align: 'left', resizable: true, hidden:true },
            { name: "EmailTempDesc", width: 105, align: 'left', resizable: true, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 38, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEmailToWhom"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpEmailToWhom",
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
        caption: localization.EmailToWhom,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            fnJqgridSmallScreen("jqgEmailToWhom");
        },

       
    }).jqGrid('navGrid', '#jqpEmailToWhom', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEmailToWhom', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", position: "first", onClickButton: fnGridRefresh
    }).jqGrid('navButtonAdd', '#jqpEmailToWhom', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', position: 'first', onClickButton: fnAddEmailRecipient
    });
    fnAddGridSerialNoHeading();
}

function fnGridLoadEmailToWhom() {
    $("#jqgEmailToWhom").jqGrid('GridUnload');
    $("#jqgEmailToWhom").jqGrid({
        url: getBaseURL() + '/Engine/GetEmailHeaderForRecipientByFormIdandParamId?formId=' + $("#cboFormId").val() + '&parameterId=5',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.EmailTempID, localization.EmailType, localization.EmailTemplateDescription,  localization.Active, localization.Actions], 
        colModel: [
            { name: "EmailTempid", width: 70, editable: true, align: 'left' },
            { name: "EmailType", width: 270, editable: false, align: 'left', resizable: true,hidden:true },
            { name: "EmailTempDesc", width: 105, align: 'left', resizable: true, editoption: { 'text-align': 'left', maxlength: 250 } },
            { name: "ActiveStatus", editable: true, width: 38, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEmailToWhom"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpEmailToWhom",
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
        caption: localization.EmailToWhom,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading(); fnJqgridSmallScreen("jqgEmailToWhom");
        },
    }).jqGrid('navGrid', '#jqpEmailToWhom', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEmailToWhom', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefresh
    }).jqGrid('navButtonAdd', '#jqpEmailToWhom', {
        caption: '<span class="fa fa-plus btn-pager" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmailRecipient
    });
   
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnFillEmailDescription() {

   
    if ($('#cboFormId').val() != '' || $('#cboFormId').val() != null || $('#cboFormId').val() != '0') {
        $.getJSON(getBaseURL() + '/Engine/GetEmailHeaderForRecipientByFormIdandParamId?formId=' + $('#cboFormId').val() + '&parameterId=5', function (result) {
            var options = $("#cboEmailDescription");
            $("#cboEmailDescription").empty();
            options.append($("<option />").val('0').text(localization.Select));
            $.each(result, function () {
                options.append($("<option />").val(this.EmailTempid).text(this.EmailTempDesc));
            });
            $('#cboEmailDescription').selectpicker('refresh');
        });
    }
}

function fnGridLoadEmailRecipient() {
  
    $("#jqgEmailRecipient").jqGrid('GridUnload');
    $("#jqgEmailRecipient").jqGrid({
        url: getBaseURL() + '/Engine/GetEmailRecipientByBusinessKeyAndEmailTempId?businessKey=' + $("#cboBusinessLocation").val() + '&emailTempId=' + $("#cboEmailDescription").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.RecipientName, localization.EmailTempID, localization.EmailID, localization.Remarks, localization.Active, localization.Actions],
        colModel: [
            { name: "RecipientName", width: 165, editable: true, align: 'left' },
            { name: "EmailTempid", width: 150, editable: false, align: 'left', resizable: true },
            { name: "Emailid", width: 150, editable: false, align: 'left', resizable: true },
            { name: "Remarks", width: 195, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 25 } },
            { name: "ActiveStatus", editable: true, width: 148, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            {
                name: 'edit', search: false, align: 'left', width: 55, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEmailRecipient"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpEmailRecipient",
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
        scrollOffset: 0, caption: localization.EmailRecipient,
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgEmailRecipient");
        },
        onSelectRow: function (rowid) {
           
        },
    }).jqGrid('navGrid', '#jqpEmailRecipient', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEmailRecipient', {
        caption: '<span class="fa fa-plus"></span> Add', buttonicon: "none", id: "custAdd", position: "first", onClickButton: fnAddEmailRecipient_popup
    });
    fnAddGridSerialNoHeading();
}

function fnAddEmailRecipient() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        fnAlert("w", "EME_04_00", "UI0106", errorMsg.BusinessLocationRecipient_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboFormId").val())) {
        fnAlert("w", "EME_04_00", "UI0108", errorMsg.FormName_E7);
        return;
    }
    $('#PopupEmailToWhom').find('.modal-title').text(localization.AddRecipient);
    $("#PopupEmailToWhom").modal("show");
    $('#txtEmailId').attr('disabled', false);
    $("#btnSaveRecipient").show();
    fnGridLoadEmailRecipient();
    isUpdate = 0;
    $('#txtRecipientName').attr('disabled', false);
    $('#txtRemarks').attr('disabled', false);
    $("#secEmailRecipient").hide();
}
$("#PopupEmailToWhom").on('hidden.bs.modal', function () {
    $("#secEmailRecipient").hide();
    $('#txtRecipientName').attr('disabled', false);
    $('#txtEmailId').attr('disabled', false);
    $('#txtRemarks').attr('disabled', false);
    $("#jqgEmailToWhom").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#cboEmailDescription").val('0').selectpicker('refresh');
    $("#jqgEmailRecipient").jqGrid('GridUnload');
});
function fnAddEmailRecipient_popup() {
    if (IsStringNullorEmpty($("#cboEmailDescription").val()) || $("#cboEmailDescription").val() == "0") {
        fnAlert("w", "EME_04_00", "UI0449", errorMsg.Emailtemplate_E15);
        return;
    }
    $('#txtRecipientName').val('');
    $('#txtEmailId').val('');
    $('#txtRemarks').val('');
    $("#chkEmailRecActiveStatus").parent().removeClass("is-checked");
    $("#secEmailRecipient").show();
    $("input,textarea").attr('disabled', false);
    $("select").next().attr('disabled', false);
    $("#btnSaveRecipient").show();
    $("#chkEmailRecActiveStatus").prop('disabled', false);
    isUpdate = 0;
    fnGridRefreshEmailRecipient();
}
function fnEditEmailRecipient_popup(e, actiontype) {
    var rowid = $("#jqgEmailRecipient").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgEmailRecipient').jqGrid('getRowData', rowid);
    $('#txtRecipientName').val(rowData.RecipientName);
    $('#txtEmailId').val(rowData.Emailid).attr('disabled',true);
    $('#txtRemarks').val(rowData.Remarks);
    if (rowData.ActiveStatus == 'true') {
        $("#chkEmailRecActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkEmailRecActiveStatus").parent().removeClass("is-checked");
    }
    $("#secEmailRecipient").show();

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EME_04_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
         
        $("#btnSaveRecipient").show();
        $("#chkEmailRecActiveStatus").prop('disabled', false);
        $('#txtEmailId').attr('disabled', true);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EME_04_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#txtRecipientName').attr('disabled', true);
        $('#txtEmailId').attr('disabled', true);
        $('#txtRemarks').attr('disabled', true);

        $("#btnSaveRecipient").hide();
        $("#chkEmailRecActiveStatus").prop('disabled', true); 
    }
    isUpdate = 1;
}


function fnSaveEmailRecipient() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val())) {
        fnAlert("w", "EME_04_00", "UI0106", errorMsg.BusinessLocation_E8);
        return ;
    }
    if (IsStringNullorEmpty($("#cboFormId").val())) {
        fnAlert("w", "EME_04_00", "UI0108", errorMsg.FormName_E9);
        return ;
    }
    if (IsStringNullorEmpty($("#txtEmailId").val())) {
        fnAlert("w", "EME_04_00", "UI0139", errorMsg.EmailID_E14);
        return;
    }
    if (!IsValidateEmail($("#txtEmailId").val())) {
        fnAlert("w", "EME_04_00", "UI0140", errorMsg.ValidEmailID_E14);
        return;
    }
    if (IsStringNullorEmpty($("#cboEmailDescription").val()) || $("#cboEmailDescription").val() == "0") {
        fnAlert("w", "EME_04_00", "UI0449", errorMsg.Emailtemplate_E15);
        return ;
    }
    if (IsStringNullorEmpty($("#txtRecipientName").val())) {
        fnAlert("w", "EME_04_00", "UI0110", errorMsg.RecipientName_E11);
        return ;
    }
    if (IsStringNullorEmpty($("#txtRemarks").val())) {
        fnAlert("w", "EME_04_00", "UI0450", errorMsg.EmailRemarks_E16);
        return;
    }
   
        $("#btnSaveRecipient").attr("disabled", true);

        var sm_sr = {
            BusinessKey: $("#cboBusinessLocation").val(),
            EmailTempid: $("#cboEmailDescription").val(),
            Emailid: $("#txtEmailId").val(),
            RecipientName: $("#txtRecipientName").val(),
            Remarks: $("#txtRemarks").val(),
            ActiveStatus: $("#chkEmailRecActiveStatus").parent().hasClass("is-checked")
        }

          var URL = getBaseURL() + '/Engine/InsertIntoEmailRecipient';
           if (isUpdate == 1)
            URL = getBaseURL() + '/Engine/UpdateEmailRecipient';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: { obj:sm_sr },
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    fnGridRefreshEmailRecipient();
                    fnClearFields();
                    isUpdate = 0;
                    $("#secEmailRecipient").hide();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveRecipient").attr('disabled', false);
                }

            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveRecipient").attr("disabled", false);
            }
        });
    
}

function fnEditEmailRecipient(e, actiontype) {
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgEmailToWhom').jqGrid('getRowData', rowid);
    var rowid = $("#jqgEmailToWhom").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgEmailToWhom').jqGrid('getRowData', rowid);
    $("#cboEmailDescription").attr('disabled', true);
    $('#cboEmailDescription').val(rowData.EmailTempid);
    $('#cboEmailDescription').selectpicker('refresh');
    fnGridLoadEmailRecipient();

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EME_04_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#PopupEmailToWhom").modal("show");
        $("#btnSaveRecipient").show();
        $('#PopupEmailToWhom').find('.modal-title').text(localization.EditRecipient);
        fnEnableRecipientDetail(false);
        isUpdate = 1;
    }
    if (actiontype.trim() == "view") {

        if (_userFormRole.IsView === false) {
            fnAlert("w", "EME_04_00", "UIC03", errorMsg.vieweauth_E3);

            return;
        }
        $("#PopupEmailToWhom").modal("show");
        $("#btnSaveRecipient").hide();
        $('#PopupEmailToWhom').find('.modal-title').text(localization.ViewRecipient);
        fnEnableRecipientDetail(true);
        isUpdate = 1;
    }
}

function fnGridRefresh() {
    $("#jqgEmailToWhom").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnGridRefreshEmailRecipient() {
    $("#jqgEmailRecipient").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#txtRecipientName").val('');
    $("#txtEmailId").val('');
    $("#txtRemarks").val('');
    $('#chkEmailRecActiveStatus').parent().addClass("is-checked");
    $("#btnSaveRecipient").attr('disabled', false);
    $("#cboEmailDescription").attr('disabled', false);
    $('#cboEmailDescription').selectpicker('refresh');
    fnEnableRecipientDetail(false);
}

function fnEnableRecipientDetail(val) {
    $("#txtRecipientName").attr('readonly', val);
    $("#txtEmailId").attr('readonly', val);
    $("#txtRemarks").attr('readonly', val);
    $("#chkEmailRecActiveStatus").attr('disabled', val);
}