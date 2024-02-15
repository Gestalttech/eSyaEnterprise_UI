
function fnBusinessLocation_onChange() {
    fnLoadPatientCategoryAttribute();
}

var _isClicked = '';
$(function () {
    fnLoadPatientCategoryAttribute();
    $.contextMenu({
        selector: "#btnPatientCategoryAttribute",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditPatientCategoryAttribute(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditPatientCategoryAttribute(event, 'view') } },
            //jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditPatientCategoryAttribute(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    //$(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
})

function fnLoadPatientCategoryAttribute() {
    $("#jqgPatientCategoryAttribute").jqGrid('GridUnload');
    $("#jqgPatientCategoryAttribute").jqGrid({
        url: getBaseURL() + '/PatientType/GetAllPatientCategoryBusinessLink?businesskey=' + $("#cboBusinessLocation").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.PatientType, localization.PatientCategory, localization.ActiveStatus, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeDesc", width: 250, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "PatientCategoryDesc", width: 250, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "ActiveStatus", editable: false, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnPatientCategoryAttribute"> <i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpPatientCategoryAttribute",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        //scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: false,
        caption: localization.PatientCategoryAttribute,
        // editurl: 'url',
        // cellsubmit: 'clientArray',

        loadComplete: function (data) {
            $("#jqgPatientCategoryAttribute").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
        },
        onSelectRow: function (rowid, status, e) {
            _isClicked = 1;
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

        },

    }).jqGrid('navGrid', '#jqpPatientCategoryAttribute', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpPatientCategoryAttribute', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshPatientCategoryAttribute
    }).jqGrid('navButtonAdd', '#jqpPatientCategoryAttribute', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddPatientCategoryAttribute
    });
    fnAddGridSerialNoHeading();
}

function fnAddPatientCategoryAttribute(id) {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        fnAlert("w", "EPT_03_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }

    if (_isClicked == 0 || null || undefined) {
        fnAlert("w", "EPT_03_00", "UIC13", errorMsg.SelectRow_E2);
    }

    else {

        var rowid = $("#jqgPatientCategoryAttribute").jqGrid('getGridParam', 'selrow');

        if (rowid == null) {
            fnAlert("w", "EPT_03_00", "UIC13", errorMsg.SelectRow_E2);
            return;
        }

        $("#sectionGrid").css('display', 'none');
        $('#sectionTabs').css('display', 'block');
        _isClicked = 0;
        var rowData = $('#jqgPatientCategoryAttribute').jqGrid('getRowData', rowid);
        $("#cardPatientType").empty();
        $("#cardPatientType").append(rowData.PatientTypeDesc);
        $("#cardPatientCategory").empty();
        $("#cardPatientCategory").append(rowData.PatientCategoryDesc);
        $("#hdPatientTypeId").val(rowData.PatientTypeId);
        $("#hdPatientCategoryId").val(rowData.PatientCategoryId);
        fnGetCareCardDetails(rowData);
        $("#btnClearCareCard").show();
        $("#btnSaveCareCard").show();
        $("#btnSaveCareCard").html('<i class="fa fa-save"></i>  ' + localization.Save);
        $("#btnSaveServiceType").html('<i class="fa fa-save"></i>  ' + localization.Save);
        $("#btnClearServiceType").show();
        $("#btnSaveCareCard").attr('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("#chkActiveStatus").parent().addClass("is-checked");
        //$("#chkActiveStatus").prop('disabled', true);
    }
}

function fnGridRefreshPatientCategoryAttribute() {
    $("#jqgPatientCategoryAttribute").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $('td,tr').removeClass('ui-state-highlight ui-state-hover').removeAttr("aria-selected");
}

function fnClosePatientCategoryAttributeGrid() {
    $("#sectionGrid").show();
    $('#sectionTabs').css('display', 'none');
    $('.tab-pane').removeClass('active show');
    $("#careCard").addClass('active show');
    $('#v-pills-tab a').removeClass('active');
    $('#careCard-tab').addClass('active');
    fnGridRefreshPatientCategoryAttribute();
    $("#btnSaveDoctorProfile,#btnSaveDocumentSubmission,#btncareCard,#btnSaveSpecialty,#btnSaveRateTypes,#btnSaveDependent,#btnClearCareCard,#btnClearRateTypes,#btnClearSpecialty,#btnClearDependent,#btnClearDocumentSubmission").css('display', 'inline-block');
    $('#hdPatientTypeId').val('');
    $('#hdPatientCategoryId').val('');
}

function fnEditPatientCategoryAttribute(e, actiontype) {
    var rowid = $("#jqgPatientCategoryAttribute").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgPatientCategoryAttribute').jqGrid('getRowData', rowid);
    $("#cardPatientType").empty();
    $("#cardPatientType").append(rowData.PatientTypeDesc);
    $("#cardPatientCategory").empty();
    $("#cardPatientCategory").append(rowData.PatientCategoryDesc);
    $("#hdPatientTypeId").val(rowData.PatientTypeId);
    $("#hdPatientCategoryId").val(rowData.PatientCategoryId);
    fnGetCareCardDetails(rowData);

    if (actiontype.trim() == "edit") {
        $("#btnSaveDoctorProfile,#btnSaveDocumentSubmission,#btnSaveServiceType,#btncareCard,#btnSaveSpecialty,#btnSaveServiceType,#btnSaveDependent").html("<i class='fa fa-sync'></i> Update");
        $("#btnClearCareCard").show();
        $("#btnSaveCareCard").show();
        $("#btnSaveCareCard").attr('disabled', false);
        $("#btnSaveCareCard").html('<i class="fa fa-sync"></i> ' + localization.Update);
        $("input,textarea").attr('readonly', false);
        $("#sectionGrid").css('display', 'none');
        $('#sectionTabs').css('display', 'block');
        $("#btnSaveServiceType").show();
        $("#btnClearServiceType").show();
    }
    if (actiontype.trim() == "view") {
        $("#btnSaveDoctorProfile,#btnSaveDocumentSubmission,#btncareCard,#btnSaveSpecialty,#btnSaveServiceType,#btnClearServiceType,#btnSaveRateTypes,#btnSaveDependent,#btnClearCareCard,#btnSaveServiceType,#btnClearSpecialty,#btnClearDependent,#btnClearDocumentSubmission").css('display', 'none');
        $("#sectionGrid").css('display', 'none');
        $('#sectionTabs').css('display', 'block');
        $("#btnClearCareCard").hide();
        $("#btnSaveCareCard").hide();
        $("#btnSaveServiceType").hide();
        $("#btnClearServiceType").hide();
        $("input,textarea").attr('readonly', true);
    }
}

function fnClearCareCard() {
    $('#txtCardPattern').val('');
}

function fnGetCardNumber() {

    $.ajax({
        url: getBaseURL() + '/PatientType/GetCardNumber',
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response != null) {
                $('#txtCurrentCard').val('MH' + '-' + response.CareCardNumber);
            }
            else {
                $('#txtCurrentCard').val('');

            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

}

function fnGetCareCardDetails(rowData) {

    $.ajax({
        url: getBaseURL() + '/PatientType/GetCareCardPattern?businesskey=' + rowData.BusinessKey + '&PatientTypeId=' + rowData.PatientTypeId + '&PatientCategoryId=' + rowData.PatientCategoryId,
        type: 'POST',
        datatype: 'json',
        success: function (response) {

            if (response != null) {
                $('#txtCurrentCard').val('MH' + '-' + response.CareCardNumber);
                $('#txtCardPattern').val(response.CareCardIdpattern);
                $('#txtCardNo').val(response.CareCardNumber);
                if (response.ActiveStatus == 1) {
                    $("#chkActiveStatus").parent().addClass("is-checked");
                }
                else {
                    $("#chkActiveStatus").parent().removeClass("is-checked");

                }
            }
            else {
                $('#txtCurrentCard').val('');
                $('#txtCardPattern').val('');
                $('#txtCardNo').val('');
                fnGetCardNumber();

            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

}

function fnSaveCareCards() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        fnAlert("w", "EPT_03_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientTypeId').val())) {
        fnAlert("w", "EPT_03_00", "UI0274", errorMsg.SelectRowToSelectPatientType_E3);
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientCategoryId').val())) {
        fnAlert("w", "EPT_03_00", "UI0275",errorMsg.SelectRowToSelectPatientCategory_E4);
        return;
    }
    if (IsStringNullorEmpty($('#txtCardPattern').val())) {
        fnAlert("w", "EPT_03_00", "",errorMsg.CardPattern_E5);
        $('#txtCardPattern').focus();
        return;
    }

    $("#btnSaveCareCard").attr("disabled", true);

    var obj = {
        BusinessKey: $('#cboBusinessLocation').val(),
        PatientTypeId: $('#hdPatientTypeId').val(),
        PatientCategoryId: $('#hdPatientCategoryId').val(),
        CareCardNumber: $('#txtCardNo').val(),
        CareCardIdpattern: $('#txtCardPattern').val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $.ajax({
        url: getBaseURL() + '/PatientType/InsertOrUpdateCareCardPattern',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#btnSaveCareCard").attr('disabled', false);
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnSaveCareCard").attr('disabled', false);
                }
            }
            else {
                 fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveCareCard").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCareCard").attr("disabled", false);
        }
    });
    $("#btnSaveCareCard").attr('disabled', false);
}