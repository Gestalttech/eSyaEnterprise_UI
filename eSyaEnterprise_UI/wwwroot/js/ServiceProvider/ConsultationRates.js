function CheckDigits(e) {

    if (e.which == 46) {
        if ($(this).val().indexOf('.') != -1) {
            return false;
        }
    }

    if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
        return false;
    }

}

$(document).ready(function () {
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgConsultationRates');
        }
    })
});
function fnLoadGridDoctorConsultationRate() {

    if ($('#cboBusinessKey').val() != '' && $('#cboRateType').val() != '' && $('#cboCurrencyCode').val() != '') {
        fnLoadDoctorConsultationRate();
    }

}
function fnLoadDoctorConsultationRate() {
    $("#jqgConsultationRates").jqGrid('GridUnload');
    $("#jqgConsultationRates").jqGrid({
        url: getBaseURL() + '/Doctors/GetDoctorProfileConsultationRatebyDoctorId?businessKey=' + $('#cboBusinessKey').val() + '&clinictype=' + $('#cboClinicType').val() + '&currencycode=' + $('#cboCurrencyCode').val() + '&ratetype=' + $('#cboRateType').val() + '&doctorId=' + $('#txtDoctorId').val(),
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization_cr.ClinicId, localization_cr.ConsultationID, localization_cr.ServiceID, localization_cr.ClinicType, localization_cr.ConsultationType, localization_cr.ServiceDescription, localization_cr.EffectiveDate, localization_cr.EffectiveTill, localization_cr.Tariff, localization_cr.Active],
        colModel: [

            { name: "ClinicId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ConsultationId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ClinicDesc", width: 250, editable: false, align: 'left' },
            { name: "ConsultationDesc", width: 350, editable: false, align: 'left' },
            { name: "ServiceDesc", width: 250, editable: false, align: 'left' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 150, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },
            {
                name: 'EffectiveTill', index: 'EffectiveTill', width: 150, sorttype: "date", formatter: "date", hidden: true, formatoptions:
                    { newformat: _cnfjqgDateFormat },
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                }
            },
            //{ name: "Tariff", width: 150, editable: true, align: 'left', edittype: 'text' },
            {
                name: 'Tariff', index: 'Tariff', editable: true, edittype: "text", width: 150,
                editoptions: { maxlength: 10, onkeypress: 'return CheckDigits(event)' }
            },
            { name: "ActiveStatus", editable: true, width: 100, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpConsultationRates",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',

        cellsubmit: 'clientArray',
        onSelectRow: function (rowid, iRow, iCol, e) {
            if (iCol === 7) {
                date = $("#jqgConsultationRates").jqGrid('getCell', rowid, "EffectiveDate");
                strdate = date;
                date = moment(date, 'DD-MM-YYYY').toDate();


                //$("#dtServiceRateDate").datepicker().datepicker("setDate", date);
                var row = $("#jqgConsultationRates").closest('tr.jqgrow');
                $("#" + rowid + "_EffectiveDate", row[0]).val(date);
                Selectedrowid = rowid;
            }
            if (iCol === 8) {
                date = $("#jqgConsultationRates").jqGrid('getCell', rowid, "EffectiveTill");
                strdate = date;
                date = moment(date, 'DD-MM-YYYY').toDate();


                //$("#dtServiceRateDate").datepicker().datepicker("setDate", date);
                var row = $("#jqgConsultationRates").closest('tr.jqgrow');
                $("#" + rowid + "_EffectiveTill", row[0]).val(date);
                Selectedrowid = rowid;
            }
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgConsultationRates").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgConsultationRates');
        }
    }).jqGrid('navGrid', '#jqpConsultationRates', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#btnSaveDoctorConsultationRate").show();
}

function SetGridControlByAction() {
    $("#btnSaveDoctorConsultationRate").attr("disabled", false);

}

function fnSaveDoctorConsultationRate() {
    if ($('#txtDoctorId').val() == '' || $('#txtDoctorId').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0314", errorMsg_cr.DoctorProfile_E1);
        
        return;
    }
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $('#cboBusinessKey').val() == '0') {
        fnAlert("w", "ESP_01_00", "UI0064", errorMsg_cr.BusinessLocation_E2);
        return;
    }
    if (IsStringNullorEmpty($("#cboCurrencyCode").val())) {
        fnAlert("w", "ESP_01_00", "UI0022", errorMsg_cr.CurrencyCode_E3);
        return;
    }
    if (IsStringNullorEmpty($("#cboRateType").val())) {
        fnAlert("w", "ESP_01_00", "UI0198", errorMsg_cr.RateType_E4);
        return;
    }
    $("#jqgConsultationRates").jqGrid('editCell', 0, 0, false);
    var Clinic_VR = [];
    var id_list = jQuery("#jqgConsultationRates").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgConsultationRates').jqGrid('getRowData', rowId);

        Clinic_VR.push({
            DoctorId: $('#txtDoctorId').val(),
            BusinessKey: $("#cboBusinessKey").val(),
            CurrencyCode: $("#cboCurrencyCode").val(),
            ClinicId: rowData.ClinicId,
            ConsultationId: rowData.ConsultationId,
            ServiceId: rowData.ServiceId,
            RateType: $("#cboRateType").val(),
            EffectiveDate: rowData.EffectiveDate,
            EffectiveTill: rowData.EffectiveTill,
            Tariff: rowData.Tariff,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSaveDoctorConsultationRate").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Doctors/AddOrUpdateDoctorProfileConsultationRate',
        type: 'POST',
        datatype: 'json',
        data: { obj: Clinic_VR },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgConsultationRates").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveDoctorConsultationRate").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDoctorConsultationRate").attr("disabled", false);
        }
    });

}

function fnBindDoctorConsultationBusinessLink() {

    $("#cboBusinessKey").empty();

    $.ajax({
        url: getBaseURL() + '/Doctors/GetDoctorLinkWithBusinessLocation?doctorId=' + $("#txtDoctorId").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboBusinessKey").empty();
                $("#cboBusinessKey").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboBusinessKey").append($("<option></option>").val(response[i]["BusinessKey"]).html(response[i]["BusinessLocation"]));
                }
                $('#cboBusinessKey').selectpicker('refresh');
            }
            else {
                $("#cboBusinessKey").empty();
                $("#cboBusinessKey").append($("<option value='0'> Select </option>"));
                $('#cboBusinessKey').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}