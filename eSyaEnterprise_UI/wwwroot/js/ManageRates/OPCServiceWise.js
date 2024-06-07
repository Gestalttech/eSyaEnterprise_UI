$(document).ready(function () {
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgClinicVisitRate');
        }
    })
});
function fnLoadGrid() {
    if ($('#cboBusinessKey').val() != '' && $('#cboRateType').val() != '' && $('#cboCurrencyCode').val() != '') {
        fnLoadClinicVisitRate();
    }
}
function fnLoadClinicVisitRate() {
    $("#jqgClinicVisitRate").jqGrid('GridUnload');
    $("#jqgClinicVisitRate").jqGrid({
        url: getBaseURL() + '/ClinicService/GetClinicVisitRateByBKeyClinicTypeCurrCodeRateType?businessKey=' + $('#cboBusinessKey').val() + '&clinictype=' + $('#cboClinicType').val() + '&currencycode=' + $('#cboCurrencyCode').val() + '&ratetype=' + $('#cboRateType').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ClinicID, localization.ConsultationID, localization.ServiceID, localization.ClinicType, localization.ConsultationType, localization.ServiceDescription, localization.EffectiveDate, localization.Tariff, localization.Active],

        colModel: [

            { name: "ClinicId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ConsultationId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ClinicDesc", width: 60, editable: false, align: 'left' },
            { name: "ConsultationDesc", width: 60, editable: false, align: 'left' },
            { name: "ServiceDesc", width: 100, editable: false, align: 'left' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 40, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },
            { name: "Tariff", width: 40, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumWidth:'55',
        emptyrecords: "No records to Veiw",
        pager: "#jqpClinicVisitRate",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        caption: localization.ClinicVisitRate,
        cellsubmit: 'clientArray',
        onSelectRow: function (rowid) {
            date = $("#jqgClinicVisitRate").jqGrid('getCell', rowid, "EffectiveDate");
            strdate = date;
            date = moment(date, 'DD-MM-YYYY').toDate();


            $("#dtServiceRateDate").datepicker().datepicker("setDate", date);
            var row = $("#jqgClinicVisitRate").closest('tr.jqgrow');
            $("#" + rowid + "_EffectiveDate", row[0]).val(date);
            Selectedrowid = rowid;

        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgClinicVisitRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgClinicVisitRate');
        }
    }).jqGrid('navGrid', '#jqpClinicVisitRate', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#btnSave").show();
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    //if (_userFormRole.IsEdit === false) {
    //    $("#btnSave").attr("disabled", true);
    //}
}

function fnSaveClinicVisitRate() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val())) {
        fnAlert("w", "EMR_02_00", "UI0064", errorMsg.SelectLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboCurrencyCode").val())) {
        fnAlert("w", "EMR_02_00", "UI0199", errorMsg.CurrencyCode_E3);
        return;
    }
    if (IsStringNullorEmpty($("#cboRateType").val())) {
        fnAlert("w", "EMR_02_00", "UI0198", errorMsg.SelectRateType_E2);
        return;
    }
    $("#jqgClinicVisitRate").jqGrid('editCell', 0, 0, false);
    var Clinic_VR = [];
    var id_list = jQuery("#jqgClinicVisitRate").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgClinicVisitRate').jqGrid('getRowData', rowId);

        Clinic_VR.push({
            BusinessKey: $("#cboBusinessKey").val(),
            CurrencyCode: $("#cboCurrencyCode").val(),
            ClinicId: rowData.ClinicId,
            ConsultationId: rowData.ConsultationId,
            ServiceId: rowData.ServiceId,
            RateType: $("#cboRateType").val(),
            EffectiveDate: GetGridDate(rowData.EffectiveDate),
            Tariff: rowData.Tariff,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ClinicService/AddOrUpdateClinicVisitRate',
        type: 'POST',
        datatype: 'json',
        data: { obj: Clinic_VR },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgClinicVisitRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });

}

