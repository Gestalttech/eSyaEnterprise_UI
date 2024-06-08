$(document).ready(function () {
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorServiceRate');
        }
    })
});

function fnLoadClinTypes() {

    if ($('#cboBusinessKey').val() != '') {
        BindClinicTypes();
        BindDoctors();
        
        fnLoadGrid();
    }
}
function fnLoadConsultationTypes()
{
    if ($('#cboBusinessKey').val() != '' && $('#cboClinicType').val() != '') {
        BindConsultationTypes();
        fnLoadGrid();
    }
}

function fnLoadSpecialty() {
    if ($('#cboBusinessKey').val() != '' && $('#cboDoctor').val() != '') {
        BindSpecialties();
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
function BindDoctors() {

    $("#cboDoctor").empty();

    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/GetDoctosbyBusinessKey?businesskey=' + $("#cboBusinessKey").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboDoctor").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctor").append($("<option></option>").val(response[i]["DoctorId"]).html(response[i]["DoctorName"]));
                }
                $('#cboDoctor').selectpicker('refresh');
            }
            else {
                $("#cboDoctor").empty();
                //$("#cboClinicType").append($("<option value='0'> Select </option>"));
                $('#cboDoctor').selectpicker('refresh');
            }
            BindSpecialties();
        },
        async: false,
        processData: false
    });


}
function BindSpecialties() {

    $("#cboSpecialty").empty();

    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/GetSpecialtiesbyDoctorID?businesskey=' + $("#cboBusinessKey").val() + '&doctorId=' + $("#cboDoctor").val(),
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

    //if ($('#cboBusinessKey').val() != '' && $('#cboDoctor').val() != '' && $('#cboClinicType').val() != '' && $('#cboConsultationType').val() != '' && $('#cboRateType').val() != '' && $('#cboCurrencyCode').val() != '' && $('#cboSpecialty').val() != '') {
        fnLoadDoctorServiceRateGrid();
    /*}*/

}
function fnLoadDoctorServiceRateGrid() {
    $("#jqgDoctorServiceRate").jqGrid('GridUnload');
    $("#jqgDoctorServiceRate").jqGrid({
        url: getBaseURL() + '/DoctorServiceRate/GetDoctorServiceRateByBKeyServiceIdCurrCodeRateType?businessKey=' + $('#cboBusinessKey').val() + '&clinicId=' + $('#cboClinicType').val() + '&consultationId=' + $('#cboConsultationType').val() + '&specialtyId=' + $('#cboSpecialty').val()+ '&doctorId=' + $('#cboDoctor').val() + '&currencycode=' + $('#cboCurrencyCode').val()
            + '&ratetype=' + $('#cboRateType').val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["Service ID",  localization.ServiceDescription, localization.EffectiveDate, localization.Tariff, localization.Active],

        colModel: [

            { name: "ServiceId", width: 10, editable: false, align: 'left', hidden: true },
            { name: "ServiceDesc", width: 100, editable: false, align: 'left' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 90, sorttype: "date", formatter: "date", formatoptions:
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
            { name: "Tariff", width: 50, editable: true, align: 'left', edittype: 'text' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center', resizable: false, edittype: 'checkbox', formatter: 'checkbox', editoptions: { value: "true:false" } },

        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpDoctorServiceRate",
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
        caption: localization.DoctorServiceRate,
        cellsubmit: 'clientArray',
        //onSelectRow: function (rowid) {
        //    date = $("#jqgDoctorServiceRate").jqGrid('getCell', rowid, "EffectiveDate");
        //    strdate = date;
        //    date = moment(date, 'DD-MM-YYYY').toDate();


        //    $("#dtServiceRateDate").datepicker().datepicker("setDate", date);
        //    var row = $("#jqgDoctorServiceRate").closest('tr.jqgrow');
        //    $("#" + rowid + "_EffectiveDate", row[0]).val(date);
        //    Selectedrowid = rowid;

        //},
        onSelectRow: function (id) {
            if (id) { $('#jqgDoctorServiceRate').jqGrid('editRow', id, true); }
        },
        loadComplete: function (data) {
            $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
            $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            $("#jqgDoctorServiceRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgDoctorServiceRate');
        }
    }).jqGrid('navGrid', '#jqpDoctorServiceRate', { add: false, edit: false, search: false, del: false, refresh: false });
    $("#btnSave").show();
}

function SetGridControlByAction() {
    $("#btnSave").attr("disabled", false);
    //if (_userFormRole.IsEdit === false) {
    //    $("#btnSave").attr("disabled", true);
    //}
}

function fnSaveDoctorServiceRate() {

    if (IsStringNullorEmpty($("#cboBusinessKey").val())) {
        fnAlert("w", "EMR_03_00", "UI0064", errorMsg.SelectLocation_E1);
        return;
    }
    if (IsStringNullorEmpty($("#cboClinicType").val())) {
        fnAlert("w", "EMR_03_00", "UI0194", errorMsg.ClinicType_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboConsultationType").val())) {
        fnAlert("w", "EMR_03_00", "UI0195", errorMsg.ConsultationType_E7);
        return;
    }
    
    if (IsStringNullorEmpty($("#cboRateType").val())) {
        fnAlert("w", "EMR_03_00", "UI0198", errorMsg.SelectRateType_E2);
        return;
    }
    if (IsStringNullorEmpty($("#cboCurrencyCode").val())) {
        fnAlert("w", "EMR_03_00", "UI0199", errorMsg.CurrencyCode_E3);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctor").val())) {
        fnAlert("w", "EMR_03_00", "UI0141", errorMsg.SelectDoctor_E4);
        return;
    }
    if (IsStringNullorEmpty($("#cboSpecialty").val())) {
        fnAlert("w", "EMR_03_00", "UI0200", errorMsg.Specialty_E5);
        return;
    }
    $("#jqgDoctorServiceRate").jqGrid('editCell', 0, 0, false);
    var Clinic_VR = [];
    var id_list = jQuery("#jqgDoctorServiceRate").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgDoctorServiceRate').jqGrid('getRowData', rowId);

        Clinic_VR.push({
            BusinessKey: $("#cboBusinessKey").val(),
            ClinicId: $("#cboClinicType").val(),
            ConsultationId: $("#cboConsultationType").val(),
            SpecialtyId: $("#cboSpecialty").val(),
            CurrencyCode: $("#cboCurrencyCode").val(),
            RateType: $("#cboRateType").val(),
            DoctorId: $("#cboDoctor").val(),
            ServiceId: rowData.ServiceId,
            EffectiveDate: GetGridDate(rowData.EffectiveDate),
            Tariff: rowData.Tariff,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/DoctorServiceRate/InsertOrUpdateDoctorServiceRate',
        type: 'POST',
        datatype: 'json',
        data: { obj: Clinic_VR },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgDoctorServiceRate").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
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

