$(function () {
    $('#cboEMFormId').selectpicker('refresh');
    fnRadioLoadFormData();
    $("input[name='rdEMform']").on('click',function () {
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
    debugger;
    $('#cboEMFormId').selectpicker('refresh');
    var selectedRadio = $("input[name='rdEMform']:checked");
    if (selectedRadio.length > 0) {
            $.ajax({
                type: "POST",
                url: getBaseURL() + '/ConfigureEmail/Engine/GetFormDetails?rdvalue=' + selectedRadio.val(),

                dataType: "json",
                contentType: 'application/json; charset=utf-8',
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
            { name: "EmailTempid", width: 70, editable: true, align: 'left', hidden: true },
            { name: "FormId", width: 70, editable: true, align: 'left', hidden: true },
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
            { name: "EmailTempid", width: 70, editable: true, align: 'left', hidden: true },
            { name: "FormId", width: 70, editable: true, align: 'left', hidden: true },
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
    fnGridLoadSMSVariable();
    $("#divEmailTemplate").css('display', 'block');
    $("#divEmailParameter").hide(500);
    $('#dvSMSVariable').hide();
    $('#chkIsVariable').parent().removeClass("is-checked");
    $('#hdvFormId').val($("#cboFormId").val());
    $('#hdvEmailId').val('');
    document.getElementById("hdFormName").innerHTML = document.getElementById("cboFormId").options[document.getElementById("cboFormId").selectedIndex].text;
    $("#chkEMTActiveStatus").attr('disabled', true);
}

function fnEditEmailTemplate(e, actiontype) {
    fnClearEmailTemplate();
    document.getElementById("hdFormName").innerHTML = document.getElementById("cboFormId").options[document.getElementById("cboFormId").selectedIndex].text;

    var rowid = $("#jqgEmailParameter").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgEmailParameter').jqGrid('getRowData', rowid);
    fnGridLoadEmailVariable();

    $('#chkIsIsAttachmentReqd').parent().removeClass("is-checked");
    $('#hdvFormId').val($("#cboFormId").val());
    $('#hdvEmailId').val(rowData.Smsid);
    fnFillEmailInformation();
    
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EME_02_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#divEmailTemplate").css('display', 'block');
        $("#divEmailParameter").hide(500);
        $('#dvSMSVariable').hide();
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
        $('#dvSMSVariable').hide();
        fnEnableTemplateDetail(true);
    }
}

function fnFillSMSInformation() {

    $.ajax({
        url: getBaseURL() + '/Engine/GetEmailHeaderInformationByEmailId',
        data: {
            emailTempId: $("#hdvEmailId").val()
        },
        success: function (result) {

            if (result != null) {
                $("#txtEmailTempDesc").val(result.EmailTempDesc);
                $("#txtEmailSubject").val(result.EmailSubject);
                //$("#txtEmailBody").val(result.Smsstatement);

                tinyMCE.activeEditor.setContent('');

                if (data.EmailBody != null) {
                    tinyMCE.activeEditor.setContent(data.EmailBody);


                }
                else {
                    tinyMCE.activeEditor.setContent('');

                }

                if (result.IsAttachmentReqd == true) {
                    $('#chkIsIsAttachmentReqd').parent().addClass("is-checked");
                }
                else
                    $('#chkIsIsAttachmentReqd').parent().removeClass("is-checked");

                $('#dvEmailVariable').hide();
                if (result.IsVariable == true) {
                    $('#chkIsVariable').parent().addClass("is-checked");
                    $('#dvEmailVariable').show();
                }
                else
                    $('#chkIsVariable').parent().removeClass("is-checked");

                if (result.ActiveStatus == true) {
                    $('#chkEMTActiveStatus').parent().addClass("is-checked");
                }
                else
                    $('#chkEMTActiveStatus').parent().removeClass("is-checked");

                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(result.l_SMSParameter);
            }
        }
    });
}

function fnGridLoadSMSVariable() {
    $("#jqgEmailVariable").jqGrid('GridUnload');
    $("#jqgEmailVariable").jqGrid({
        url: getBaseURL() + '/Engine/GetActiveEmailVariableInformation',
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.Variable, localization.Component],
        colModel: [
            { name: "Emavariable", width: 200, editable: true, align: 'left' },
            { name: "Emacomponent", width: 200, editable: false, align: 'left' },
        ],
        pager: "#jqgEmailVariable",
        emptyrecords: "No records",
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
        forceFit: false,
        scrollOffset: 0, caption: localization.SMSVariable,
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgSMSVariable");
        }
    }).jqGrid('navGrid', '#jqgEmailVariable', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveEmailTemplate() {
    if (IsStringNullorEmpty($("#hdvFormId").val())) {
        fnAlert("w", "EME_02_00", "UI0102", errorMsg.FormID_E6);
        return false;
    }

    if (IsStringNullorEmpty($("#txtEmailTempDesc").val())) {
        fnAlert("w", "EME_02_00", "UI0103", errorMsg.SMSDesc_E7);
        return false;
    }
    if (IsStringNullorEmpty($("#txtEmailSubject").val())) {
        fnAlert("w", "EME_02_00", "UI0103", errorMsg.SMSDesc_E7);
        return false;
    }
    if (IsStringNullorEmpty(tinyMCE.get('txtEmailBody').getContent())) {
        fnAlert("w", "EME_02_00", "UI0103", errorMsg_ad.SMSDesc_E7);
        return;
    }
    else {
        var smsParams = eSyaParams.GetJSONValue();

        $("#btnSaveEmailTemplate").attr("disabled", true);

        var URL = getBaseURL() + '/Engine/InsertIntoEmailHeader';
        if (!IsStringNullorEmpty($("#hdvEmailId").val()))
            URL = getBaseURL() + '/Engine/UpdateEmailHeader';

        $.ajax({
            url: URL,
            type: 'POST',
            datatype: 'json',
            data: {
                EmailTempid: !IsStringNullorEmpty($("#hdvEmailId").val()) ? $("#hdvEmailId").val() : '',
                FormId: $("#hdvFormId").val(),
                EmailTempDesc: $("#txtEmailTempDesc").val(),
                EmailSubject: $("#txtEmailSubject").val(),
                EmailBody: tinyMCE.get('txtEmailBody').getContent(),//$("#txtEmailBody").val(),
                IsAttachmentReqd: $("#chkIsIsAttachmentReqd").parent().hasClass("is-checked"),
                ActiveStatus: $("#chkEMTActiveStatus").parent().hasClass("is-checked"),
                l_SMSParameter: smsParams
            },
            async: false,
            success: function (response) {

                if (response.Status == true) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#divEmailParameter").css('display', 'block');
                    $("#divEmailTemplate").hide(500);
                    fnGridRefreshEmailTemplate();
                    $("#btnSaveEmailTemplate").attr("disabled", false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveEmailTemplate").attr("disabled", false);
                }
                $("#btnSaveEmailTemplate").attr("disabled", false);
            },
            error: function (error) {
                fnAlert("e", "", error.StatusCode, error.statusText);
                $("#btnSaveEmailTemplate").attr("disabled", false);
            }
        });
    }
}

function fnRedirectToEmailTemplate() {
    $("#divEmailTemplate").css('display', 'none');
    $("#divEmailParameter").show();
}

function fnGridRefreshEmailTemplate() {
    $("#jqgEmailParameter").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearEmailTemplate() {
    eSyaParams.ClearValue();
    $('#hdvEmailId').val('');
    $("#txtEmailTempID").val('');
    $("#txtEmailTempDesc").val('');
    $("#txtEmailSubject").val('');
    tinyMCE.activeEditor.setContent('');
    //$("#txtEmailBody").val('');
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


function fnIsVariableRequired(elem) {
    if (elem.checked) {
        $('#dvEmailVariable').show();
    }
    else {
        $('#dvEmailVariable').hide();
    }
}