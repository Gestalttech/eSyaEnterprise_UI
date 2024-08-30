$(function () {
    $('#cboEMFormId').selectpicker('refresh');
    fnRadioLoadFormData();
    $("input[name='rdEMform']").change(function () {
        //reload dropdownlist
        fnRadioLoadFormData();
    })
    $.contextMenu({
        selector: "#btnEmailParameter",
        trigger: 'left',
        items: {
            jqgEdit: { name: "Edit", icon: "edit", callback: function (key, opt) { fnEditEmailTemplate(event, 'edit') } },
            jqgView: { name: "View", icon: "view", callback: function (key, opt) { fnEditEmailTemplate(event, 'view') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + "Edit" + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + "View" + " </span>");
});

function fnRadioLoadFormData() {
    $('#cboEMFormId').selectpicker('refresh');

    $("input[name='rdform']").each(function () {
        if ($(this).is(":checked")) {
            $.ajax({
                type: "Post",
                url: getBaseURL() + '/Engine/GetFormDetails?rdvalue=' + $(this).val(),

                dataType: "json",
                success: function (data) {

                    $('#cboEMFormId').empty();
                    $("#cboEMFormId").append($("<option value='0'>Select Form</option>"));

                    for (var i = 0; i < data.length; i++) {

                        $("#cboEMFormId").append($("<option></option>").val(data[i]["FormID"]).html(data[i]["FormName"]));
                    }
                    $('#cboEMFormId').val($("#cboEMFormId option:first").val());
                    $('#cboEMFormId').selectpicker('refresh');

                    fnGridLoadEmailEmptyParameter();
                },

                error: function (xhr, ajaxOptions, thrownError) {
                    alert('Failed to retrieve Forms.');
                }
            });
        }
    });
    //fnGridLoadEmailParameter(); 
}

function fnGridLoadEmailEmptyParameter() {
    $("#jqgEmailParameter").jqGrid('GridUnload');
    $("#jqgEmailParameter").jqGrid({
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.EmailTempID, localization.FormID, localization.EmailTempDescription, localization.EmailSubject, localization.EmailBody,localization.IsAttachmentReqd, localization.Active, localization.Actions],
        colModel: [
            { name: "EmailTempID", width: 70, editable: true, align: 'left',hidden:true },
            { name: "FormID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "EmailTempDesc", width: 70, editable: false, align: 'left', resizable: true },
            { name: "EmailSubject", width: 70, editable: false, align: 'left', resizable: true },
            { name: "EmailBody", width: 170, editable: false, align: 'left', resizable: true },
            { name: "IsAttachmentReqd", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEmailParameter"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpEmailParameter",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
        scrollOffset: 0, caption: localization.EmailParameter,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgEmailParameter");
        },

    }).jqGrid('navGrid', '#jqpEmailParameter', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEmailParameter', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmailTemplate
    }).jqGrid('navButtonAdd', '#jqpEmailParameter', {
        caption: '<span class="fa fa-plus btn-pager"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmailTemplate
    });
    fnAddGridSerialNoHeading();
}


function fnGridLoadEmailParameter() {
    $("#jqgEmailParameter").jqGrid('GridUnload');
    $("#jqgEmailParameter").jqGrid({
        url: getBaseURL() + '/Engine/GetEmailHeaderInformationByFormId?formId=' + $("#cboFormId").val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.EmailTempID, localization.FormID, localization.EmailTempDescription, localization.EmailSubject, localization.EmailBody, localization.IsAttachmentReqd, localization.Active, localization.Actions],
        colModel: [
            { name: "EmailTempID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "FormID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "EmailTempDesc", width: 70, editable: false, align: 'left', resizable: true },
            { name: "EmailSubject", width: 70, editable: false, align: 'left', resizable: true },
            { name: "EmailBody", width: 170, editable: false, align: 'left', resizable: true },
            { name: "IsAttachmentReqd", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnEmailParameter"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpEmailParameter",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
        scrollOffset: 0, caption: localization.EmailParameter,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgEmailParameter");
        },

    }).jqGrid('navGrid', '#jqpEmailParameter', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEmailParameter', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshEmailTemplate
    }).jqGrid('navButtonAdd', '#jqpEmailParameter', {
        caption: '<span class="fa fa-plus btn-pager"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddEmailTemplate
    });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnAddEmailTemplate() {
    if ($("#cboEMFormId").val() === "" || $("#cboEMFormId").val() === '' || $("#cboEMFormId").val() === '0') {
        fnAlert("w", "EME_02_00", "UI0108", errorMsg.FormSelect_E10);
        return;
    }
    fnClearEmailTemplate();
    $("#btnSaveEmailTemplate").show();
    $("#btnSaveEmailTemplate").html("<i class='fa fa-save'></i> " + localization.Save);
    fnEnableTemplateDetail(false);
    $("#divEmailTemplate").css('display', 'block');
    $("#divEmailParameter").hide(500);
     
    $('#hdvEmailId').val('');
    $("#chkEMTActiveStatus").attr('disabled', true);
}

function fnEditEmailTemplate(e, actiontype) {
    fnClearEmailTemplate();
    
    var rowid = $("#jqgEmailParameter").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgEmailParameter').jqGrid('getRowData', rowid);
    
     
     
    
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EME_02_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#divEmailTemplate").css('display', 'block');
        $("#divEmailParameter").hide(500);
        $("#btnSaveEmailTemplate").show();
        fnEnableTemplateDetail(false);
        $("#chkEMTActiveStatus").attr('disabled', true);
        $("#btnSaveEmailTemplate").html("<i class='fa fa-sync'></i> " + localization.Update);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EME_02_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#divEmailTemplate").css('display', 'block');
        $("#divEmailParameter").hide(500);
        $("#btnSaveEmailTemplate").hide();
        fnEnableTemplateDetail(true);
    }
}
 
function fnSaveEmailTemplate() {
    
}

function fnRedirectToEmailTemplate() {
    $("#divEmailTemplate").css('display', 'none');
    $("#divEmailParameter").show();
}

function fnGridRefreshEmailTemplate() {
    $("#jqgEmailParameter").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearEmailTemplate() {
    $("#txtEmailTempID").val('');
    $("#txtEmailTempDesc").val('');
    $("#txtEmailSubject").val('');
    $("#txtEmailBody").val('');
    $('#chkEMTActiveStatus').parent().addClass("is-checked");
    $("#btnSaveEmailTemplate").attr('disabled', false);
}

function fnCloseEmailTemplate() {
    $("#divEmailParameter").css('display', 'block');
    $("#divEmailTemplate").hide(500);
    fnClearEmailTemplate();
}

function fnEnableTemplateDetail(val) {
    $("input,textarea").attr('readonly', val);
    $("#chkEMTActiveStatus").attr('disabled', val);
}