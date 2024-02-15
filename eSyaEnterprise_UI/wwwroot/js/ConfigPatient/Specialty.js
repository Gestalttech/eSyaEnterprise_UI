
function fnAddSpecialtyTab() {

    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $('#cboBusinessLocation').val() == '' || $('#cboBusinessLocation').val() == '0') {
        fnAlert("w", "EPT_03_00", "UI0064", errorMsg.BusinessLocation_E1);
        return;
    }

    else {

        var rowid = $("#jqgPatientCategoryAttribute").jqGrid('getGridParam', 'selrow');

        if (rowid == null) {
            fnAlert("w", "EPT_03_00", "UIC13", errorMsg.SelectRow_E2);
            return;
        }

        $("#sectionGrid").css('display', 'none');
        $('#sectionTabs').css('display', 'block');
        var rowData = $('#jqgPatientCategoryAttribute').jqGrid('getRowData', rowid);
        $("#SpecialtyPatientType").empty();
        $("#SpecialtyPatientType").append(rowData.PatientTypeDesc);
        $("#SpecialtyPatientCategory").empty();
        $("#SpecialtyPatientCategory").append(rowData.PatientCategoryDesc);
        $("#hdPatientTypeId").val(rowData.PatientTypeId);
        $("#hdPatientCategoryId").val(rowData.PatientCategoryId);
        fnLoadPTSpecialtyGrid(rowData);
        $("input,textarea").attr('readonly', false);
        $("#btnSavePTSpecialty").show();
        $("#btnSavePTSpecialty").attr('disabled', false);
        $("#btnSavePTSpecialty").html('<i class="fa fa-save"></i>  ' + localization.Save);
    }
}

function fnLoadPTSpecialtyGrid(rowData) {
    $("#jqgSpecialty").jqGrid('GridUnload');
    $("#jqgSpecialty").jqGrid({
        url: getBaseURL() + '/PatientType/GetPatientTypeCategorySpecialtyLink?businesskey=' + rowData.BusinessKey + '&PatientTypeId=' + rowData.PatientTypeId + '&PatientCategoryId=' + rowData.PatientCategoryId,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["PatientType Id", "PatientCategory Id", "Specialty ID", localization.Specialty, localization.Select],
        colModel: [
            //{ name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientTypeId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "PatientCategoryId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "SpecialtyId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "ServiceTypeDesc", width: 350, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpSpecialty",
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
        caption: localization.Specialty,
        onSelectRow: function (id) {
            if (id) { $('#jqgSpecialty').jqGrid('editRow', id, true); }
        },
        caption: 'Specialty Link',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgSpecialty");
        },
    }).jqGrid('navGrid', '#jqpSpecialty', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSavePTSpecialty() {

    if (IsStringNullorEmpty($('#hdPatientTypeId').val())) {
        fnAlert("w", "EPT_03_00", "UI0274", errorMsg.SelectRowToSelectPatientType_E3);
        return;
    }
    if (IsStringNullorEmpty($('#hdPatientCategoryId').val())) {
        fnAlert("w", "EPT_03_00", "UI0275", errorMsg.SelectRowToSelectPatientCategory_E4);
        return;
    }
    $("#jqgSpecialty").jqGrid('editCell', 0, 0, false);

    var obj = [];
    var svT = $('#jqgSpecialty').jqGrid('getRowData');
    for (var i = 0; i < svT.length; ++i) {

        var sp = {
            PatientTypeId: $('#hdPatientTypeId').val(),
            PatientCategoryId: $('#hdPatientCategoryId').val(),
            SpecialtyId: svT[i]['SpecialtyId'],
            ActiveStatus: svT[i]['ActiveStatus']
        }
        obj.push(sp);
    }

    $("#btnSavePTSpecialty").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/PatientType/InsertOrUpdatePatientTypeCategorySpecialtyLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                fnAlert("s", "", response.StatusCode, response.Message);
                fnPTSpecialtyGridRefresh();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSavePTSpecialty").attr("disabled", false);
        }
    });

    $("#btnSavePTSpecialty").attr("disabled", false);
}

function fnPTSpecialtyGridRefresh() {
    $("#jqgSpecialty").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearPTSpecialty() {

    fnPTSpecialtyGridRefresh();
}
