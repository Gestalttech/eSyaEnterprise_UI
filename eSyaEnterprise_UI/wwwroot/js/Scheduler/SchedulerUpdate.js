$(function () {
    $.contextMenu({
        selector: "#btnDoctorScheduleUpdate",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fn_EditDoctorSchedule(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fn_EditDoctorSchedule(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fn_EditDoctorSchedule(event, 'delete') } },

        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.ChangeSchedule + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnLoadScheduleUpdateDoctors() {

    $('#cboDoctorScheduleUpdateDoctor').selectpicker('refresh');
    $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
    $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleUpdateDoctor").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetDoctorsbyBusinessKey?Businesskey=' + $("#cboScheduleUpdateDoctorLocation").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorScheduleUpdateDoctor").empty();

                $("#cboDoctorScheduleUpdateDoctor").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleUpdateDoctor").append($("<option></option>").val(response[i]["DoctorId"]).html(response[i]["DoctorName"]));
                }
                $('#cboDoctorScheduleUpdateDoctor').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleUpdateDoctor").empty();
                $("#cboDoctorScheduleUpdateDoctor").append($("<option value='0'>" + localization.Select + "</option>"));
                $('#cboDoctorScheduleUpdateDoctor').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadGridDoctorExistingSchedule();
    
}
function fnLoadScheduleUpdateSpecialties() {

    $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
    $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleUpdateSpecialty").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetSpecialtiesbyDoctorID?Businesskey=' + $("#cboScheduleUpdateDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleUpdateDoctor").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorScheduleUpdateSpecialty").empty();

                $("#cboDoctorScheduleUpdateSpecialty").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleUpdateSpecialty").append($("<option></option>").val(response[i]["SpecialtyID"]).html(response[i]["SpecialtyDesc"]));
                }
                $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleUpdateSpecialty").empty();
                $("#cboDoctorScheduleUpdateSpecialty").append($("<option value='0'>" + localization.Select + "</option>"));
                $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadGridDoctorExistingSchedule();
    
}
function fnLoadScheduleUpdateClinic() {

    $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboScheduleUpdateDoctorClinic").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetClinicsbySpecialtyID?Businesskey=' + $("#cboScheduleUpdateDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleUpdateDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleUpdateSpecialty").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboScheduleUpdateDoctorClinic").empty();

                $("#cboScheduleUpdateDoctorClinic").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboScheduleUpdateDoctorClinic").append($("<option></option>").val(response[i]["ClinicId"]).html(response[i]["ClinicDesc"]));
                }
                $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
            }
            else {
                $("#cboScheduleUpdateDoctorClinic").empty();
                $("#cboScheduleUpdateDoctorClinic").append($("<option value='0'> Select </option>"));
                $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadGridDoctorExistingSchedule();
    
}
function fnLoadScheduleUpdateConsultationType() {

    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboScheduleUpdateConsultationType").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetConsultationsbyClinicID?Businesskey=' + $("#cboScheduleUpdateDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleUpdateDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleUpdateSpecialty").val()
            + '&ClinicID=' + $("#cboScheduleUpdateDoctorClinic").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboScheduleUpdateConsultationType").empty();

                $("#cboScheduleUpdateConsultationType").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboScheduleUpdateConsultationType").append($("<option></option>").val(response[i]["ConsultationId"]).html(response[i]["ConsultationDesc"]));
                }
                $('#cboScheduleUpdateConsultationType').selectpicker('refresh');
            }
            else {
                $("#cboScheduleUpdateConsultationType").empty();
                $("#cboScheduleUpdateConsultationType").append($("<option value='0'>" + localization.Select + "</option>"));
                $('#cboScheduleUpdateConsultationType').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadGridDoctorExistingSchedule();
    
}
function ConsultationTypeonChange() {
    fnLoadGridDoctorExistingSchedule();
    
}

//Grid Part and functionality Starts -- -
function fnLoadGridDoctorExistingSchedule() {

    $("#jqgDoctorExistingSchedule").GridUnload();

    $("#jqgDoctorExistingSchedule").jqGrid({

        url: getBaseURL() + '/ScheduleUpdate/GetExistingDoctorScheduledList?Businesskey=' + $("#cboScheduleUpdateDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleUpdateDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleUpdateSpecialty").val()
            + '&ClinicID=' + $("#cboScheduleUpdateDoctorClinic").val() + '&ConsultationID=' + $("#cboScheduleUpdateConsultationType").val()
            + '&ScheduleUpdateDate=' + getDate($("#txtScheduleUpdateDate")),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        colNames: ["", "", "", "", "", "", localization.Dayoftheweek, localization.PatientCountPerHour, localization.TimeSlotInMins, "", localization.FromTime, localization.ToTime, localization.Active, localization.Actions],
        colModel: [

            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SerialNo", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationID", width: 100, editable: true, align: 'left', hidden: true },
            { name: "DayOfWeek", width: 70, editable: true, align: 'left', hidden: false },
            { name: "PatientCountPerHour", width: 40, editable: true, align: 'left', hidden: false },
            { name: "TimeSlotInMins", width: 40, editable: true, align: 'left', hidden: false },
            { name: "RoomNo", width: 40, editable: true, align: 'left', hidden: true },
            { name: 'ScheduleFromTime', index: 'Tid', width: 40, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 40, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },

            { name: "ActiveStatus", editable: true, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorScheduleUpdate"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpDoctorExistingSchedule",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadComplete: function () {
            fnJqgridSmallScreen('jqgDoctorExistingSchedule');
        },

        onSelectRow: function (rowid, status, e) {

        },

    }).jqGrid('navGrid', '#jqpDoctorExistingSchedule', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctorExistingSchedule', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDoctorExistingScheduleUpdate
    })

    fnAddGridSerialNoHeading();
}



function fnAddDoctorSchedule() {
    $("#divCardSelectedSchedule").hide();
    IsInsert = true;
    $('#txtScheduleUpdateFromTime').attr('disabled', false);
    $('#txtScheduleUpdateToTime').attr('disabled', false);
    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorLocation").val()) || $('#cboScheduleUpdateDoctorLocation').val() == '' || $('#cboScheduleUpdateDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateDoctor").val()) || $('#cboDoctorScheduleUpdateDoctor').val() == '' || $('#cboDoctorScheduleUpdateDoctor').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateSpecialty").val()) || $('#cboDoctorScheduleUpdateSpecialty').val() == '' || $('#cboDoctorScheduleUpdateSpecialty').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorClinic").val()) || $('#cboScheduleUpdateDoctorClinic').val() == '' || $('#cboScheduleUpdateDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateConsultationType").val()) || $('#cboScheduleUpdateConsultationType').val() == '' || $('#cboScheduleUpdateConsultationType').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }
    fnClearDoctorScheduleUpdate();
    $("#btnSaveDoctorScheduleUpdate").show();
    $("#btnDeleteDoctorScheduleUpdate").hide();
    $("#PopupDoctorScheduleUpdate").modal("show");
    $("#chkScheduleUpdateActive").parent().addClass("is-checked");
    $('#PopupDoctorScheduleUpdate').find('.modal-title').text(localization.AddDoctorScheduleUpdate);
    $("#btnSaveDoctorScheduleUpdate").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkScheduleUpdateActive").prop('disabled', true);
    $("#btnSaveDoctorScheduleUpdate").show();
}
function fn_EditDoctorSchedule(e, actiontype) {
    //IsInsert = false;
    var rowid = $("#jqgDoctorScheduleUpdate").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorScheduleUpdate').jqGrid('getRowData', rowid);



    //$('#hdvDoctorScheduleUpdateSerialNo').val(rowData.SerialNo);
    $('#txtScheduleUpdateFromTime').val(rowData.ScheduleFromTime);
    $('#txtScheduleUpdateToTime').val(rowData.ScheduleToTime);
    $('#txtScheduleUpdatePatientsPerHr').val(rowData.PatientCountPerHour);
    $('#txtScheduleUpdateTimeSlotInMins').val(rowData.TimeSlotInMins);

    if (rowData.ActiveStatus === "true")
        $('#chkScheduleUpdateActive').parent().addClass("is-checked");
    else
        $('#chkScheduleUpdateActive').parent().removeClass("is-checked");



    $("#btnSaveDoctorScheduleUpdate").html('<i class="far fa-save"></i> ' + localization.Update);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ESP_05_00", "UIC02", errorMsg.editauth_E3);
            return;
        }
        $("#btnSaveDoctorScheduleUpdate").show();
        $("#btnDeleteDoctorScheduleUpdate").hide();
        $('#PopupDoctorScheduleUpdate').modal('show');
        $('#PopupDoctorScheduleUpdate').find('.modal-title').text(localization.UpdateDoctorScheduleUpdate);
        $("#btnSaveDoctorScheduleUpdate").html('<i class="fa fa-sync mr-1"></i> ' + localization.Update);
        $("#chkScheduleUpdateActive").prop('disabled', true);
        $("#btnSaveDoctorScheduleUpdate").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        $("#divCardSelectedSchedule").hide();
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ESP_05_00", "UIC03", errorMsg.vieweauth_E4);
            return;
        }
        $("#btnSaveDoctorScheduleUpdate").hide();
        $("#btnDeleteDoctorScheduleUpdate").hide();
        $('#PopupDoctorScheduleUpdate').modal('show');
        $('#PopupDoctorScheduleUpdate').find('.modal-title').text(localization.ViewDoctorScheduleUpdate);
        $("#btnSaveDoctorScheduleUpdate").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctorScheduleUpdate").hide();
        $("#chkScheduleUpdateActive").prop('disabled', true);
        $("#PopupDoctorScheduleUpdate").on('hidden.bs.modal', function () {
            $("#btnSaveDoctorScheduleUpdate").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "ESP_05_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupDoctorScheduleUpdate').modal('show');
        $('#PopupDoctorScheduleUpdate').find('.modal-title').text(localization.ActivateDeactivateDoctorSchedule);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeleteDoctorScheduleUpdate").html(localization.Deactivate);
        }
        else {
            $("#btnDeleteDoctorScheduleUpdate").html(localization.Activate);
        }
        $("#btnSaveDoctorScheduleUpdate").hide();
        $("#btnDeleteDoctorScheduleUpdate").show();
        $("#chkScheduleUpdateActive").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}
function fnRefreshDoctorExistingScheduleUpdate() {
    $("#jqgDoctorExistingSchedule").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnSaveDoctorScheduleUpdate() {

    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorLocation").val()) || $('#cboScheduleUpdateDoctorLocation').val() == '' || $('#cboScheduleUpdateDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateDoctor").val()) || $('#cboDoctorScheduleUpdateDoctor').val() == '' || $('#cboDoctorScheduleUpdateDoctor').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateSpecialty").val()) || $('#cboDoctorScheduleUpdateSpecialty').val() == '' || $('#cboDoctorScheduleUpdateSpecialty').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorClinic").val()) || $('#cboScheduleUpdateDoctorClinic').val() == '' || $('#cboScheduleUpdateDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateConsultationType").val()) || $('#cboScheduleUpdateConsultationType').val() == '' || $('#cboScheduleUpdateConsultationType').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }

    if ($('#txtScheduleUpdateFromTime').val() == '') {
        fnAlert("w", "ESP_05_00", "UI0393", errorMsg.SelectFromTime_E12);
        return;
    }
    if ($('#txtScheduleUpdateToTime').val() == '') {
        fnAlert("w", "ESP_05_00", "UI0394", errorMsg.SelectToTime_E13);
        return;
    }
    if ($('#txtScheduleUpdateFromTime').val() >= $('#txtScheduleUpdateToTime').val()) {
        fnAlert("w", "ESP_05_00", "UI0395", errorMsg.FromTimeToTime_E14);
        return;
    }
    if (IsStringNullorEmpty($("#txtScheduleUpdateScheduleToTime").val())) {
        fnAlert("w", "ESP_05_00", "Please Select Schedule To Time");
        return;
   }

    if ($('#txtScheduleUpdateScheduleFromTime').val() >= $('#txtScheduleUpdateScheduleToTime').val()) {
        fnAlert("w", "ESP_05_00","", "From Time can't be more than or equal to To Time.");
         return;
    }
    if (IsStringNullorEmpty($("#txtNoofPatients").val())) {
        fnAlert("w", "ESP_05_00","","Please Enter Number of Patients");
        return;
     }
    if (IsStringNullorEmpty($("#txtXlSheetReference").val())) {
        fnAlert("w", "ESP_05_00", "","Please Select Xl Sheet Reference");
        return;
     }
    $("#btnSaveDoctorScheduleUpdate").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboScheduleUpdateDoctorLocation').val(),
        ConsultationID: $('#cboScheduleUpdateConsultationType').val(),
        ClinicID: $('#cboScheduleUpdateDoctorClinic').val(),
        SpecialtyID: $('#cboDoctorScheduleUpdateSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleUpdateDoctor').val(),
        SerialNo: $('#hdvDoctorScheduleUpdateSerialNo').val(),
        ScheduleFromTime: $('#txtScheduleUpdateFromTime').val(),
        ScheduleToTime: $('#txtScheduleUpdateToTime').val(),
        NoOfPatients: $('#txtNoofPatients').val(),
        XlsheetReference: $('#txtXlSheetReference').val(),
        ActiveStatus: $('#chkScheduleUpdateActive').parent().hasClass("is-checked"),

    };

    var URL = '';
    if (IsInsert)
        URL = getBaseURL() + '/Scheduler/InsertIntoDoctorScheduleChange';
    else
        URL = getBaseURL() + '/Scheduler/UpdateDoctorScheduleChange';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctorScheduleUpdate").modal('hide');
                    fnClearDoctorScheduleUpdate();
                    fnRefreshDoctorExistingScheduleUpdate();
                    fnRefreshDoctorScheduleUpdate();

                    $("#btnSaveDoctorScheduleUpdate").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctorScheduleUpdate").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
            }
            else {
                $("#btnSaveDoctorScheduleUpdate").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            $("#btnSaveDoctorScheduleUpdate").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function fnDeleteDoctorScheduleUpdate() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkScheduleUpdateActive").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorLocation").val()) || $('#cboScheduleUpdateDoctorLocation').val() == '' || $('#cboScheduleUpdateDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateDoctor").val()) || $('#cboDoctorScheduleUpdateDoctor').val() == '' || $('#cboDoctorScheduleUpdateDoctor').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateSpecialty").val()) || $('#cboDoctorScheduleUpdateSpecialty').val() == '' || $('#cboDoctorScheduleUpdateSpecialty').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorClinic").val()) || $('#cboScheduleUpdateDoctorClinic').val() == '' || $('#cboScheduleUpdateDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateConsultationType").val()) || $('#cboScheduleUpdateConsultationType').val() == '' || $('#cboScheduleUpdateConsultationType').val() == '0') {
        fnAlert("w", "ESP_05_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }

    if ($('#txtScheduleUpdateFromTime').val() == '') {
        fnAlert("w", "ESP_05_00", "UI0393", errorMsg.SelectFromTime_E12);
        return;
    }
    if ($('#txtScheduleUpdateToTime').val() == '') {
        fnAlert("w", "ESP_05_00", "UI0394", errorMsg.SelectToTime_E13);
        return;
    }
    if ($('#txtScheduleUpdateFromTime').val() >= $('#txtScheduleUpdateToTime').val()) {
        fnAlert("w", "ESP_05_00", "UI0395", errorMsg.FromTimeToTime_E14);
        return;
    }

    $("#btnDeleteDoctorScheduleUpdate").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboScheduleUpdateDoctorLocation').val(),
        ConsultationID: $('#cboScheduleUpdateConsultationType').val(),
        ClinicID: $('#cboScheduleUpdateDoctorClinic').val(),
        SpecialtyID: $('#cboDoctorScheduleUpdateSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleUpdateDoctor').val(),
        SerialNo: $('#hdvDoctorScheduleUpdateSerialNo').val(),
        ScheduleFromTime: $('#txtScheduleUpdateFromTime').val(),
        ScheduleToTime: $('#txtScheduleUpdateToTime').val(),
        NoOfPatients: $('#txtNoofPatients').val(),
        XlsheetReference: $('#txtXlSheetReference').val(),
        ActiveStatus: $('#chkScheduleUpdateActive').parent().hasClass("is-checked"),
        _status: a_status
     };


    $.ajax({
        url: getBaseURL() + '/Scheduler/ActivateOrDeActivateDoctorScheduleChange',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctorScheduleUpdate").modal('hide');
                    fnClearDoctorScheduleUpdate();
                    fnRefreshDoctorScheduleUpdate();

                    $("#btnDeleteDoctorScheduleUpdate").attr('disabled', false);
                }
                else {
                    $("#btnDeleteDoctorScheduleUpdate").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
            }
            else {
                $("#btnDeleteDoctorScheduleUpdate").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            $("#btnDeleteDoctorScheduleUpdate").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

$("#btnCancelScheduleUpdateSchedule").click(function () {
    $("#jqgScheduleUpdateSchedule").jqGrid('resetSelection');
    $('#PopupScheduleUpdateSchedule').modal('hide');
    fnClearFields();
});
function fnClearDoctorScheduleUpdate() {
    $('#txtXlSheetReference').val('');
    $('#txtNoofPatients').val('');
    $('#txtSerialNumber').val('');
    $("#btnSaveDoctorScheduleUpdate").attr('disabled', false);

    $('#txtScheduleUpdateFromTime').val('');
    $('#txtScheduleUpdateToTime').val('');
    $('#txtScheduleUpdatePatientsPerHr').val('');
    $('#txtScheduleUpdateTimeSlotInMins').val('');
    $('#hdvDoctorScheduleUpdateSerialNo').val('');
    $('#chkScheduleUpdateActive').parent().addClass("is-checked");

    $("#btnSaveDoctorScheduleUpdate").html('<i class="far fa-save"></i> ' + localization.Save);
}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
//Grid Part and functionality Ends -- -


//Export To Excel

function fnExportToExcel() {

    window.location.href = getBaseURL() + '/Doctors/Export?businessKey=' + $('#cboBusinessLocation').val() + '&specialtyId=' + $('#cboDoctorScheduleSpecialty').val()
        + '&clinicId=' + $('#cboDoctorClinic').val() + '&consultationId=' + $('#cboScheduleConsultationType').val() + '&doctorId=' + $('#cboDoctors').val()
        + '&scheduleFromDate=' + getDate($('#dtfromdate')) + '&scheduleToDate=' + getDate($('#dttodate'));
}
//Export To Excel Ends

//Import Excel
function fnImportExcel() {


    if (IsStringNullorEmpty($("#postedFile").val())) {
        toastr.warning("Please Select Excel file");
        return;
    }
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === '0') {
        toastr.warning("Please Select Location");
        return;
    }
    $("#btnImportExcel").attr('disabled', true);
    var obj = new FormData();
    //appending  file object
    obj.append("postedFile", $("#postedFile").get(0).files[0]);
    obj.append("BusinessKey", $("#cboBusinessLocation").val());
    $.ajax({
        url: getBaseURL() + '/Doctors/Insert_ImpotedDoctorScheduleList',
        type: "POST",
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    toastr.success(response.Message);
                    $("#btnImportExcel").attr('disabled', false);
                }
                else {
                    toastr.error(response.Message);
                    $("#btnImportExcel").attr('disabled', false);
                }
            }
            else {
                toastr.error(response.Message);
                $("#btnImportExcel").attr('disabled', false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnImportExcel").attr("disabled", false);
        }
    });
    $("#btnImportExcel").attr('disabled', false);
}
// End Import Excel