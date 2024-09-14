$(function () {
   
    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorSchedule');
        }
    });
    $.contextMenu({
        selector: "#btnDoctorSchedule",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fn_EditDoctorSchedule(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fn_EditDoctorSchedule(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fn_EditDoctorSchedule(event, 'delete') } },

        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});

function fnLoadScheduleDoctors() {
    
    $('#cboDoctorScheduleDoctor').selectpicker('refresh');
    $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleDoctor").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetDoctorsbyBusinessKey?Businesskey=' + $("#cboDoctorLocation").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorScheduleDoctor").empty();

                $("#cboDoctorScheduleDoctor").append($("<option value='0'>" + localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleDoctor").append($("<option></option>").val(response[i]["DoctorId"]).html(response[i]["DoctorName"]));
                }
                $('#cboDoctorScheduleDoctor').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleDoctor").empty();
                $("#cboDoctorScheduleDoctor").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboDoctorScheduleDoctor').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadDoctorScheduleGrid();
}
function fnLoadScheduleSpecialties() {

    $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleSpecialty").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetSpecialtiesbyDoctorID?Businesskey=' + $("#cboDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleDoctor").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorScheduleSpecialty").empty();

                $("#cboDoctorScheduleSpecialty").append($("<option value='0'>" + localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleSpecialty").append($("<option></option>").val(response[i]["SpecialtyID"]).html(response[i]["SpecialtyDesc"]));
                }
                $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleSpecialty").empty();
                $("#cboDoctorScheduleSpecialty").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboDoctorScheduleSpecialty').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadDoctorScheduleGrid();
}
function fnLoadScheduleClinic() {

    $('#cboDoctorClinic').selectpicker('refresh');
    $('#cboScheduleConsultationType').selectpicker('refresh');

    $("#cboDoctorClinic").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetClinicsbySpecialtyID?Businesskey=' + $("#cboDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleSpecialty").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorClinic").empty();

                $("#cboDoctorClinic").append($("<option value='0'>" + localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorClinic").append($("<option></option>").val(response[i]["ClinicId"]).html(response[i]["ClinicDesc"]));
                }
                $('#cboDoctorClinic').selectpicker('refresh');
            }
            else {
                $("#cboDoctorClinic").empty();
                $("#cboDoctorClinic").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboDoctorClinic').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadDoctorScheduleGrid();
}
function fnLoadScheduleConsultationType() {

    $('#cboScheduleConsultationType').selectpicker('refresh');

    $("#cboScheduleConsultationType").empty();
    $.ajax({
        url: getBaseURL() + '/Scheduler/GetConsultationsbyClinicID?Businesskey=' + $("#cboDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleSpecialty").val()
            + '&ClinicID=' + $("#cboDoctorClinic").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboScheduleConsultationType").empty();

                $("#cboScheduleConsultationType").append($("<option value='0'>"+localization.Select +"</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboScheduleConsultationType").append($("<option></option>").val(response[i]["ConsultationId"]).html(response[i]["ConsultationDesc"]));
                }
                $('#cboScheduleConsultationType').selectpicker('refresh');
            }
            else {
                $("#cboScheduleConsultationType").empty();
                $("#cboScheduleConsultationType").append($("<option value='0'>" + localization.Select +"</option>"));
                $('#cboScheduleConsultationType').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
}
function fnLoadDoctorScheduleGrid() {

    $("#jqgDoctorSchedule").GridUnload();

    $("#jqgDoctorSchedule").jqGrid({
       
        url: getBaseURL() + '/Scheduler/GetDoctorScheduleList?Businesskey=' + $("#cboDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleSpecialty").val()
            + '&ClinicID=' + $("#cboDoctorClinic").val() + '&ConsultationID=' + $("#cboScheduleConsultationType").val(),
        datatype: 'json',
        mtype: 'GET',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        colNames: ["", "", "", "", "", "", localization.Dayoftheweek, localization.PatientCountPerHour, localization.TimeSlotInMins, "", localization.Week1, localization.Week2, localization.Week3, localization.Week4, localization.Week5, localization.FromTime, localization.ToTime, localization.Active, localization.Actions],
        colModel: [

            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SerialNo", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationID", width: 100, editable: true, align: 'left', hidden: true },
            { name: "DayOfWeek", width: 70, editable: true, align: 'left' },
            { name: "PatientCountPerHour", width: 60, editable: true, align: 'left', hidden: false },
            { name: "TimeSlotInMins", width: 60, editable: true, align: 'left', hidden: false },
            { name: "RoomNo", width: 60, editable: true, align: 'left', hidden: true },
            { name: "Week1", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week2", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week3", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week4", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "Week5", editable: true, width: 45, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: 'ScheduleFromTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: "ActiveStatus", editable: true, width: 50, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorSchedule"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],

        rowList: [10, 20, 30, 50, 100],
        rowNum: 10,
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpDoctorSchedule",
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
            fnJqgridSmallScreen('jqgDoctorSchedule');
        },

        onSelectRow: function (rowid, status, e) {
       
        },

    }).jqGrid('navGrid', '#jqpDoctorSchedule', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctorSchedule', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDoctorSchedule
    }).jqGrid('navButtonAdd', '#jqpDoctorSchedule', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDoctorSchedule
    });
    fnAddGridSerialNoHeading();
}
function fnRefreshDoctorSchedule() {
    $("#jqgDoctorSchedule").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnAddDoctorSchedule() {

    if (IsStringNullorEmpty($("#cboDoctorLocation").val()) || $('#cboDoctorLocation').val() == '' || $('#cboDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleDoctor").val()) || $('#cboDoctorScheduleDoctor').val() == '' || $('#cboDoctorScheduleDoctor').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleSpecialty").val()) || $('#cboDoctorScheduleSpecialty').val() == '' || $('#cboDoctorScheduleSpecialty').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorClinic").val()) || $('#cboDoctorClinic').val() == '' || $('#cboDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleConsultationType").val()) || $('#cboScheduleConsultationType').val() == '' || $('#cboScheduleConsultationType').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }
    fnClearDoctorSchedule();
    $("#btnSaveDoctorSchedule").show();
    $("#btnDeleteDoctorSchedule").hide();
    $("#PopupDoctorScheduler").modal("show");
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupDoctorScheduler').find('.modal-title').text(localization.AddDoctorSchedule);
    $("#btnSaveDoctorSchedule").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveDoctorSchedule").show();
}
function fnSaveDoctorSchedule() {

    if (IsStringNullorEmpty($("#cboDoctorLocation").val()) || $('#cboDoctorLocation').val() == '' || $('#cboDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleDoctor").val()) || $('#cboDoctorScheduleDoctor').val() == '' || $('#cboDoctorScheduleDoctor').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleSpecialty").val()) || $('#cboDoctorScheduleSpecialty').val() == '' || $('#cboDoctorScheduleSpecialty').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorClinic").val()) || $('#cboDoctorClinic').val() == '' || $('#cboDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleConsultationType").val()) || $('#cboScheduleConsultationType').val() == '' || $('#cboScheduleConsultationType').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleWeekDays").val()) || $('#cboDoctorScheduleWeekDays').val() == '' || $('#cboDoctorScheduleWeekDays').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0392", errorMsg.SelectDayOfWeek_E11);
        return;
    }
    if ($('#txtFromTime').val() == '') {
        fnAlert("w", "ESP_03_00", "UI0393", errorMsg.SelectFromTime_E12);
        return;
    }
    if ($('#txtToTime').val() == '') {
        fnAlert("w", "ESP_03_00", "UI0394", errorMsg.SelectToTime_E13);
        return;
    }
    if ($('#txtFromTime').val() >= $('#txtToTime').val()) {
        fnAlert("w", "ESP_03_00", "UI0395", errorMsg.FromTimeToTime_E14);
        return;
    }
    if (!$('#chkWeek1').parent().hasClass("is-checked") && !$('#chkWeek2').parent().hasClass("is-checked") && !$('#chkWeek3').parent().hasClass("is-checked")
        && !$('#chkWeek4').parent().hasClass("is-checked") && !$('#chkWeek5').parent().hasClass("is-checked")) {
        fnAlert("w", "ESP_03_00", "UI0396", errorMsg.SelectaWeek_E15);
        return;
    }

    $("#btnSaveDoctorSchedule").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboDoctorLocation').val(),
        ConsultationID: $('#cboScheduleConsultationType').val(),
        ClinicID: $('#cboDoctorClinic').val(),
        SpecialtyID: $('#cboDoctorScheduleSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleDoctor').val(),
        SerialNo: $('#hdvDoctorScheduleSerialNo').val(),
        DayOfWeek: $('#cboDoctorScheduleWeekDays').val(),
        ScheduleFromTime: $('#txtFromTime').val(),
        ScheduleToTime: $('#txtToTime').val(),
        PatientCountPerHour: $('#txtPatientsPerHr').val(),
        TimeSlotInMins: $('#txtTimeSlotInMins').val(),
        Week1: $('#chkWeek1').parent().hasClass("is-checked"),
        Week2: $('#chkWeek2').parent().hasClass("is-checked"),
        Week3: $('#chkWeek3').parent().hasClass("is-checked"),
        Week4: $('#chkWeek4').parent().hasClass("is-checked"),
        Week5: $('#chkWeek5').parent().hasClass("is-checked"),
        RoomNo: '-',
        ActiveStatus: $('#chkScheduleActive').parent().hasClass("is-checked")
 
    };

    var URL = '';
    if ($('#hdvDoctorScheduleSerialNo').val() == '')
        URL = getBaseURL() + '/Scheduler/InsertIntoDoctorSchedule';
    else
        URL = getBaseURL() + '/Scheduler/UpdateDoctorSchedule';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctorScheduler").modal('hide');
                     fnClearDoctorSchedule();
                    fnRefreshDoctorSchedule();

                    $("#btnSaveDoctorSchedule").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctorSchedule").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
            }
            else {
                $("#btnSaveDoctorSchedule").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            $("#btnSaveDoctorSchedule").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function fnClearDoctorSchedule() {
    $('#cboDoctorScheduleWeekDays').val('0');
    $('#cboDoctorScheduleWeekDays').selectpicker('refresh');
    $('#txtFromTime').val('');
    $('#txtToTime').val('');
    $('#txtPatientsPerHr').val('');
    $('#txtTimeSlotInMins').val('');
    $('#chkWeek1').parent().addClass("is-checked");
    $('#chkWeek2').parent().addClass("is-checked");
    $('#chkWeek3').parent().addClass("is-checked");
    $('#chkWeek4').parent().addClass("is-checked");
    $('#chkWeek5').parent().addClass("is-checked");
    $('#chkScheduleActive').parent().addClass("is-checked");
    $('#hdvDoctorScheduleSerialNo').val('');
    $("#btnSaveDoctorSchedule").html('<i class="far fa-save"></i> ' + localization.Save);
}
function fn_EditDoctorSchedule(e,actiontype) {
  
    var rowid = $("#jqgDoctorSchedule").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorSchedule').jqGrid('getRowData', rowid);

    $('#hdvDoctorScheduleSerialNo').val(rowData.SerialNo);
    $('#cboDoctorScheduleWeekDays').val(rowData.DayOfWeek);
    $('#cboDoctorScheduleWeekDays').selectpicker('refresh');
    $('#txtFromTime').val(rowData.ScheduleFromTime);
    $('#txtToTime').val(rowData.ScheduleToTime);
    $('#txtPatientsPerHr').val(rowData.PatientCountPerHour);
    $('#txtTimeSlotInMins').val(rowData.TimeSlotInMins);
    if (rowData.Week1 === "true")
        $('#chkWeek1').parent().addClass("is-checked");
    else
        $('#chkWeek1').parent().removeClass("is-checked");
    if (rowData.Week2 === "true")
        $('#chkWeek2').parent().addClass("is-checked");
    else
        $('#chkWeek2').parent().removeClass("is-checked");
    if (rowData.Week3 === "true")
        $('#chkWeek3').parent().addClass("is-checked");
    else
        $('#chkWeek3').parent().removeClass("is-checked");
    if (rowData.Week4 === "true")
        $('#chkWeek4').parent().addClass("is-checked");
    else
        $('#chkWeek4').parent().removeClass("is-checked");
    if (rowData.Week5 === "true")
        $('#chkWeek5').parent().addClass("is-checked");
    else
        $('#chkWeek5').parent().removeClass("is-checked");
    if (rowData.ActiveStatus === "true")
        $('#chkScheduleActive').parent().addClass("is-checked");
    else
        $('#chkScheduleActive').parent().removeClass("is-checked");

    $("#btnSaveDoctorSchedule").html('<i class="far fa-save"></i> ' + localization.Update);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ESP_03_00", "UIC02", errorMsg.editauth_E3);
            return;
        }
        $("#btnSaveDoctorSchedule").show();
        $("#btnDeleteDoctorSchedule").hide();
        $('#PopupDoctorScheduler').modal('show');
        $('#PopupDoctorScheduler').find('.modal-title').text(localization.UpdateDoctorSchedule);
        $("#btnSaveDoctorSchedule").html('<i class="fa fa-sync mr-1"></i> ' + localization.Update);
        $("#chkScheduleActive").prop('disabled', true);
        $("#btnSaveDoctorSchedule").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ESP_03_00", "UIC03", errorMsg.vieweauth_E4);
            return;
        }
        $("#btnSaveDoctorSchedule").hide();
        $("#btnDeleteDoctorSchedule").hide();
        $('#PopupDoctorScheduler').modal('show');
        $('#PopupDoctorScheduler').find('.modal-title').text(localization.ViewDoctorSchedule);
        $("#btnSaveDoctorSchedule").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctorSchedule").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDoctorScheduler").on('hidden.bs.modal', function () {
            $("#btnSaveDoctorSchedule").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EAD_02_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupDoctorScheduler').modal('show');
        $('#PopupDoctorScheduler').find('.modal-title').text(localization.ActivateDeactivateDoctorSchedule);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeleteDoctorSchedule").html(localization.Deactivate);
        }
        else {
            $("#btnDeleteDoctorSchedule").html(localization.Activate);
        }
        $("#btnSaveDoctorSchedule").hide();
        $("#btnDeleteDoctorSchedule").show();
        $("#chkScheduleActive").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
 }
function fnDeleteDoctorSchedule() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkScheduleActive").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    if (IsStringNullorEmpty($("#cboDoctorLocation").val()) || $('#cboDoctorLocation').val() == '' || $('#cboDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleDoctor").val()) || $('#cboDoctorScheduleDoctor').val() == '' || $('#cboDoctorScheduleDoctor').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleSpecialty").val()) || $('#cboDoctorScheduleSpecialty').val() == '' || $('#cboDoctorScheduleSpecialty').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorClinic").val()) || $('#cboDoctorClinic').val() == '' || $('#cboDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleConsultationType").val()) || $('#cboScheduleConsultationType').val() == '' || $('#cboScheduleConsultationType').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleWeekDays").val()) || $('#cboDoctorScheduleWeekDays').val() == '' || $('#cboDoctorScheduleWeekDays').val() == '0') {
        fnAlert("w", "ESP_03_00", "UI0392", errorMsg.SelectDayOfWeek_E11);
        return;
    }
    if ($('#txtFromTime').val() == '') {
        fnAlert("w", "ESP_03_00", "UI0393", errorMsg.SelectFromTime_E12);
        return;
    }
    if ($('#txtToTime').val() == '') {
        fnAlert("w", "ESP_03_00", "UI0394", errorMsg.SelectToTime_E13);
        return;
    }
    if ($('#txtFromTime').val() >= $('#txtToTime').val()) {
        fnAlert("w", "ESP_03_00", "UI0395", errorMsg.FromTimeToTime_E14);
        return;
    }
    if (!$('#chkWeek1').parent().hasClass("is-checked") && !$('#chkWeek2').parent().hasClass("is-checked") && !$('#chkWeek3').parent().hasClass("is-checked")
        && !$('#chkWeek4').parent().hasClass("is-checked") && !$('#chkWeek5').parent().hasClass("is-checked")) {
        fnAlert("w", "ESP_03_00", "UI0396", errorMsg.SelectaWeek_E15);
        return;
    }

    $("#btnDeleteDoctorSchedule").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboDoctorLocation').val(),
        ConsultationID: $('#cboScheduleConsultationType').val(),
        ClinicID: $('#cboDoctorClinic').val(),
        SpecialtyID: $('#cboDoctorScheduleSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleDoctor').val(),
        SerialNo: $('#hdvDoctorScheduleSerialNo').val(),
        DayOfWeek: $('#cboDoctorScheduleWeekDays').val(),
        ScheduleFromTime: $('#txtFromTime').val(),
        ScheduleToTime: $('#txtToTime').val(),
        PatientCountPerHour: $('#txtPatientsPerHr').val(),
        TimeSlotInMins: $('#txtTimeSlotInMins').val(),
        Week1: $('#chkWeek1').parent().hasClass("is-checked"),
        Week2: $('#chkWeek2').parent().hasClass("is-checked"),
        Week3: $('#chkWeek3').parent().hasClass("is-checked"),
        Week4: $('#chkWeek4').parent().hasClass("is-checked"),
        Week5: $('#chkWeek5').parent().hasClass("is-checked"),
        RoomNo: '-',
        ActiveStatus: $('#chkScheduleActive').parent().hasClass("is-checked"),
       _status:a_status
    };

  
    $.ajax({
        url: getBaseURL() + '/Scheduler/ActivateOrDeActivateDoctorSchedule',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctorScheduler").modal('hide');
                    fnClearDoctorSchedule();
                    fnRefreshDoctorSchedule();

                    $("#btnDeleteDoctorSchedule").attr('disabled', false);
                }
                else {
                    $("#btnDeleteDoctorSchedule").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
            }
            else {
                $("#btnDeleteDoctorSchedule").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            $("#btnDeleteDoctorSchedule").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}


