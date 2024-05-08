var DocumentTypelist = [];

$(document).ready(function () {

    DocumentTypelist.push(0 + ': Select');
    $.each(DocumentSerializeList, function (i, data) { DocumentTypelist.push(data.ApplicationCode + ':' + data.CodeDesc); })
    DocumentTypelist = DocumentTypelist.join(';')


});

function fnBusinessKeyChange() {
    var _businesskey = $("#cboBusinessKey").val();
    var _patienttype = $("#cboPatientTypes").val();
    if (_businesskey == 0 || _patienttype == 0) {
        $("#jqgMapPatientCategoryDocument").jqGrid('GridUnload');
    }
    else {
        fnLoadPatientTypeCategoryMapDocumentLink();
    }
}

function fnLoadPatientTypeCategoryMapDocumentLink() {
    $("#jqgMapPatientCategoryDocument").jqGrid('GridUnload');
    $("#jqgMapPatientCategoryDocument").jqGrid({
        url: getBaseURL() + '/ConfigPatient/Document/GetAllPatientCategoryDocumentLink?businesskey=' + $("#cboBusinessKey").val() + '&patienttypeId=' + $("#cboPatientTypes").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.PatientType, localization.PatientCategory, localization.Document, localization.Status],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeDesc", width: 100, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "PatientCategoryDesc", width: 100, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "PatientCatgDocId", editable: true, cellEdit: true, width: 100, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: DocumentTypelist } },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        rowNum: 100000,
        pgtext: null,
        pgbutton: null,
        rownumWidth: '55',
        loadonce: true,
        pager: "#jqpMapPatientCategoryDocument",
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
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',

        onSelectRow: function (id) {
            if (id) { $('#jqgMapPatientCategoryDocument').jqGrid('editRow', id, true); }
        },
        caption: localization.MapPatientCategoryDocument,
        loadComplete: function () {
            fnJqgridSmallScreen("jqgMapPatientCategoryDocument");
        },
    }).jqGrid('navGrid', '#jqpMapPatientCategoryDocument', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}

function fnSavePatientCategoryDocumentLink() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $('#cboBusinessKey').val() == '' || $('#cboBusinessKey').val() == '0') {
        fnAlert("w", "EPM_02_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboPatientTypes").val()) || $('#cboPatientTypes').val() == '' || $('#cboPatientTypes').val() == '0') {
        fnAlert("w", "EPM_02_00", "UI0064", "Select Patient Type");
        return;
    }

    $("#jqgMapPatientCategoryDocument").jqGrid('editCell', 0, 0, false);


    var $grid = $("#jqgMapPatientCategoryDocument");
    var obj = [];
    var ids = jQuery("#jqgMapPatientCategoryDocument").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgMapPatientCategoryDocument').jqGrid('getRowData', rowId);

        if (rowData.PatientCatgDocId != "0") {
            obj.push({
                BusinessKey: $('#cboBusinessKey').val(),
                PatientTypeId: $("#cboPatientTypes").val(),
                PatientCatgDocId: rowData.PatientCatgDocId,
                PatientCategoryId: rowData.PatientCategoryId,
                ActiveStatus: rowData.ActiveStatus,

            });
        }
    }


    $("#btnSavePatientCategoryDocumentLink").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/ConfigPatient/Document/InsertOrUpdatePatientCategoryDocumentLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefresh();
                $("#btnSavePatientCategoryDocumentLink").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSavePatientCategoryDocumentLink").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSavePatientCategoryDocumentLink").attr("disabled", false);
        }
    });

    $("#btnSavePatientCategoryDocumentLink").attr("disabled", false);
}

function fnGridRefresh() {
    $("#jqgMapPatientCategoryDocument").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearPatientCategoryDocumentLink() {

    fnGridRefresh();
}