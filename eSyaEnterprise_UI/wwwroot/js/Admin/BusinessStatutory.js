var ISDCode = 0;

$(document).ready(function () {
    fnBusinessKeyChange();
});

function fnBusinessKeyChange() {
    $.ajax({
        url: getBaseURL() + '/Admin/License/GetISDCodeByBusinessKey?BusinessKey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            if (result !== null) {
                ISDCode = result.IsdCode;
            }
            fnGridLoadStatutoryInformation();
        }
    });
}

function fnGridLoadStatutoryInformation() {
    $("#jqgStatutoryDetails").jqGrid('GridUnload');
    $("#jqgStatutoryDetails").jqGrid({
        url: getBaseURL() + '/Admin/License/GetStatutoryInformation?BusinessKey=' + $("#cboBusinessKey").val() + '&isdCode=' + ISDCode,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.StatutoryCode, localization.StatutoryDescription, localization.StatutoryDetail, localization.Active],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryCode", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryDescription", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "StatutoryValue", width: 100, align: 'left', editable: true, edittype: "text", editoptions: { maxlength: 25 }, },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'edit', search: false, align: 'center', width: 50, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all" style="padding: 2px 4px; background: #0b76bc!important; color: #fff!important; margin: 3px; " title="Edit" onclick="return fnEditStatutoryDetails(event)"><i class="fas fa-pen"></i> Edit </button>';
            //    }
            //},
        ],
        rowNum: 10,
        rownumWidth:55,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpStatutoryDetails",
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
        caption: localization.StatutoryDetails,
        onSelectRow: function (id) {
            if (id) { $('#jqgStatutoryDetails').jqGrid('editRow', id, true); }
        },
        loadComplete: function () {
            fnJqgridSmallScreen("jqgStatutoryDetails");

        },
    }).jqGrid('navGrid', '#jqpStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}

$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgStatutoryDetails").jqGrid('editCell', 0, 0, false);

});

function fnSaveBusinessStatutory() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() === 0) {
        fnAlert("w", "EAD_03_00", "UI0064", errorMsg.SelectBusinessLocation_E1);
        return false;
    }

    var obj = [];
    var gvT = $('#jqgStatutoryDetails').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['StatutoryValue'])) {
            var bu_bd = {
                BusinessKey: $('#cboBusinessKey').val(),
                StatutoryCode: gvT[i]['StatutoryCode'],
                StatutoryValue: gvT[i]['StatutoryValue'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(bu_bd);
        }
    }

    $("#btnSaveBusinessStatutory").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/Admin/License/InsertOrUpdateBusinessStatutory',
        type: 'POST',
        datatype: 'json',
        data: { bu_bd: obj },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefresh();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveBusinessStatutory").attr("disabled", false);
        }
    });

    $("#btnSaveBusinessStatutory").attr("disabled", false);
}

function fnGridRefresh() {
    $("#jqgStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearBusinessStatutory() {

    fnGridRefresh();
}

