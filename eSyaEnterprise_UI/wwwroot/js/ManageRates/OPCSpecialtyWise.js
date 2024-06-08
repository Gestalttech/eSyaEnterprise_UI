$(document).ready(function () {
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgSpecialtyServiceRate');
        }
    })
});

function fnLoadClinTypes() {

    if ($('#cboBusinessKey').val() != '') {
        BindClinicTypes();
        BindSpecialties();
        fnLoadGrid();
    }
}
function fnLoadConsultationTypes() {
    if ($('#cboBusinessKey').val() != '' && $('#cboClinicType').val() != '') {
        BindConsultationTypes();
        fnLoadGrid();
    }
}
function BindClinicTypes() {

    $("#cboClinicType").empty();

    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/GetClinicTypesbyBusinessKey?businesskey=' + $("#cboBusinessKey").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboClinicType").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboClinicType").append($("<option></option>").val(response[i]["ApplicationCode"]).html(response[i]["CodeDesc"]));
                }
                $('#cboClinicType').selectpicker('refresh');
            }
            else {
                $("#cboClinicType").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                $('#cboClinicType').selectpicker('refresh');
            }
            BindConsultationTypes();

        },
        async: false,
        processData: false
    });


}
function BindConsultationTypes() {

    $("#cboConsultationType").empty();

    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/GetConsultationbyClinicID?businesskey=' + $("#cboBusinessKey").val() + '&clinicId=' + $("#cboClinicType").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboConsultationType").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboConsultationType").append($("<option></option>").val(response[i]["ApplicationCode"]).html(response[i]["CodeDesc"]));
                }
                $('#cboConsultationType').selectpicker('refresh');
            }
            else {
                $("#cboConsultationType").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                $('#cboConsultationType').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}
function BindSpecialties() {

    $("#cboSpecialty").empty();

    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/GetSpecialitesbyBusinessKey?businesskey=' + $("#cboBusinessKey").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboSpecialty").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboSpecialty").append($("<option></option>").val(response[i]["SpecialtyID"]).html(response[i]["SpecialtyDesc"]));
                }
                $('#cboSpecialty').selectpicker('refresh');
            }
            else {
                $("#cboSpecialty").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                $('#cboSpecialty').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}
function fnLoadGrid() {

    //if ($('#cboBusinessKey').val() != '' && $('#cboSpecialty').val() != '' && $('#cboService').val() != '' && $('#cboRateType').val() != '' && $('#cboCurrencyCode').val() != '') {
        fnLoadSpecialtyServiceRateGrid();
    /*}*/

}
function fnLoadSpecialtyServiceRateGrid() {
    $("#jqgSpecialtyServiceRate").jqGrid('GridUnload');
    $("#jqgSpecialtyServiceRate").jqGrid({
        url: getBaseURL() + '/DoctorServiceRate/GetSpecialtyServiceRateByBKeyServiceIdCurrCodeRateType?businessKey=' + $('#cboBusinessKey').val() + '&clinicId=' + $('#cboClinicType').val() + '&consultationId=' + $('#cboConsultationType').val() + '&specialtyId=' + $('#cboSpecialty').val() + '&currencycode=' + $('#cboCurrencyCode').val()
            + '&ratetype=' + $('#cboRateType').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service ID", "Specialty ID", localization.ServiceDescription, localization.EffectiveDate, localization.Tariff, localization.Active],

        colModel: [

            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "SpecialtyId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceDesc", width: 100, editable: false, align: 'left' },
            //{ name: "DoctorDesc", width: 100, editable: false, align: 'left' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 40, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat },
                    /*{ dateFormat: "dd/M/yy" },*/
                editable: true, editoptions: {
                    size: 20,
                    dataInit: function (el) {
                        $(el).datepicker({ dateFormat: _cnfDateFormat });
                    }
                    //dataInit: function (el) {
                    //    $(el).datepicker({ dateFormat: "dd/M/yy" });
                    //}
                }
            },
            { name: "Tariff", width: 40, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        rownumWidth:'55',
        emptyrecords: "No records to Veiw",
        pager: "#jqpSpecialtyServiceRate",
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
        caption: localization.SpecialtyServiceRate,
        cellsubmit: 'clientArray',
        onSelectRow: function (rowid) {
            date = $("#jqgSpecialtyServiceRate").jqGrid('getCell', rowid, "EffectiveDate");
            strdate = date;
            date = moment(date, 'DD-MM-YYYY').toDate();


            $("#dtServiceRateDate").datepicker().datepicker("setDate", date);
            var row = $("#jqgSpecialtyServiceRate").closest('tr.jqgrow');
            $("#" + rowid + "_EffectiveDate", row[0]).val(date);
            Selectedrowid = rowid;

        },
        onSelectRow: function (id) {
            if (id) { $('#jqgSpecialtyServiceRate').jqGrid('editRow', id, true); }
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgSpecialtyServiceRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgSpecialtyServiceRate');
        }
    }).jqGrid('navGrid', '#jqpSpecialtyServiceRate', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#btnSave").show();
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    //if (_userFormRole.IsEdit === false) {
    //    $("#btnSave").attr("disabled", true);
    //}
}

function fnSaveSpecialtyServiceRate() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val())) {
        fnAlert("w", "EMR_04_00", "UI0064", errorMsg.SelectLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboClinicType").val())) {
        fnAlert("w", "EMR_04_00", "UI0194", errorMsg.ClinicType_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboConsultationType").val())) {
        fnAlert("w", "EMR_04_00", "UI0195", errorMsg.ConsultationType_E7);
        return;
    }
    
    if (IsStringNullorEmpty($("#cboRateType").val())) {
        fnAlert("w", "EMR_04_00", "UI0198", errorMsg.SelectRateType_E2);
        return;
    }
    if (IsStringNullorEmpty($("#cboCurrencyCode").val())) {
        fnAlert("w", "EMR_04_00", "UI0199", errorMsg.CurrencyCode_E3);
        return;
    }
    if (IsStringNullorEmpty($("#cboSpecialty").val())) {
        fnAlert("w", "EMR_04_00", "UI0200", errorMsg.SelectSpecialty_E5);
        return;
    }
    $("#jqgSpecialtyServiceRate").jqGrid('editCell', 0, 0, false);
    var Clinic_VR = [];
    var id_list = jQuery("#jqgSpecialtyServiceRate").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgSpecialtyServiceRate').jqGrid('getRowData', rowId);

        Clinic_VR.push({
            BusinessKey: $("#cboBusinessKey").val(),
            ClinicId: $("#cboClinicType").val(),
            ConsultationId: $("#cboConsultationType").val(),
            CurrencyCode: $("#cboCurrencyCode").val(),
            RateType: $("#cboRateType").val(),
            SpecialtyId: $("#cboSpecialty").val(),
            ServiceId: rowData.ServiceId,
            EffectiveDate: GetGridDate(rowData.EffectiveDate),
            Tariff: rowData.Tariff,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/InsertOrUpdateSpecialityServiceRate',
        type: 'POST',
        datatype: 'json',
        data: { obj: Clinic_VR },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgSpecialtyServiceRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
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

