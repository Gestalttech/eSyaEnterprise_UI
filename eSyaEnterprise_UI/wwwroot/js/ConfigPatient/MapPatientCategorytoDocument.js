var RateTypelist = [];

$(document).ready(function () {

    RateTypelist.push(0 + ': Select');
    $.each(RateTypes, function (i, data) { RateTypelist.push(data.ApplicationCode + ':' + data.CodeDesc); })
    RateTypelist = RateTypelist.join(';')
    fnLoadPatientTypeCategoryMapBusinessLink();

});

function fnBusinessLocation_onChange() {
    fnLoadPatientTypeCategoryMapBusinessLink();
}

function fnLoadPatientTypeCategoryMapBusinessLink() {
    $("#jqgMapPatientCategoryDocument").jqGrid('GridUnload');
    $("#jqgMapPatientCategoryDocument").jqGrid({
        url: getBaseURL() + '/Document/GetAllPatientCategoryBusinessLink?businesskey=' + $("#cboBusinessLocation").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.PatientTypeId, localization.PatientCategoryId, localization.PatientType, localization.PatientCategory, localization.PatientCategoryDocId, localization.Select],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeDesc", width: 250, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "PatientCategoryDesc", width: 250, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "PatientCatgDocId", editable: true, width: 150, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: RateTypelist } },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpMapPatientCategoryD",
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
        cellsubmit: 'clientArray',

        onSelectRow: function (id) {

            if (id) { $('#jqgMapPatientCategoryDocument').jqGrid('editRow', id, true); }
        },
        caption: localization.MapPatientCategoryDocument,
        loadComplete: function () {
            fnJqgridSmallScreen("jqgMapPatientCategoryDocument");
        },
    }).jqGrid('navGrid', '#jqpMapPatientCategoryDocument', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSavePatientCategoryBusinessLink() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        fnAlert("w", "EPM_03_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }

    $("#jqgMapPatientCategoryDocument").jqGrid('editCell', 0, 0, false);

    var obj = [];
    var gvT = $('#jqgMapPatientCategoryDocument').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        var blink = {
            BusinessKey: $('#cboBusinessLocation').val(),
            PatientTypeId: gvT[i]['PatientTypeId'],
            PatientCategoryId: gvT[i]['PatientCategoryId'],
            PatientCatgDocId: gvT[i]['PatientCatgDocId'],
            ActiveStatus: gvT[i]['ActiveStatus']
        }
        obj.push(blink);

    }

    $("#btnSavePatientCategoryBusinessLink").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/Document/InsertOrUpdatePatientCategoryBusinessLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefresh();
                $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
        }
    });

    $("#btnSavePatientCategoryBusinessLink").attr("disabled", false);
}

function fnGridRefresh() {
    $("#jqgMapPatientCategoryDocument").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearPatientCategoryBusinessLink() {

    fnGridRefresh();
}