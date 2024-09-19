$(function () {
    $.contextMenu({
        selector: "#btnDoctorSchedule",
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

function fnLoadScheduleChangeDoctors() {

    $('#cboDoctorScheduleChangeDoctor').selectpicker('refresh');
    $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
    $('#cboScheduleChangeDoctorClinic').selectpicker('refresh');
    $('#cboScheduleChangeConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleChangeDoctor").empty();
    $.ajax({
        url: getBaseURL() + '/ScheduleChange/GetDoctorsbyBusinessKey?Businesskey=' + $("#cboScheduleChangeDoctorLocation").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorScheduleChangeDoctor").empty();

                $("#cboDoctorScheduleChangeDoctor").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleChangeDoctor").append($("<option></option>").val(response[i]["DoctorId"]).html(response[i]["DoctorName"]));
                }
                $('#cboDoctorScheduleChangeDoctor').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleChangeDoctor").empty();
                $("#cboDoctorScheduleChangeDoctor").append($("<option value='0'>" + localization.Select + "</option>"));
                $('#cboDoctorScheduleChangeDoctor').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadGridDoctorExistingSchedule();
    
}
function fnLoadScheduleChangeSpecialties() {

    $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
    $('#cboScheduleChangeDoctorClinic').selectpicker('refresh');
    $('#cboScheduleChangeConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleChangeSpecialty").empty();
    $.ajax({
        url: getBaseURL() + '/ScheduleChange/GetSpecialtiesbyDoctorID?Businesskey=' + $("#cboScheduleChangeDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleChangeDoctor").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorScheduleChangeSpecialty").empty();

                $("#cboDoctorScheduleChangeSpecialty").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleChangeSpecialty").append($("<option></option>").val(response[i]["SpecialtyID"]).html(response[i]["SpecialtyDesc"]));
                }
                $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleChangeSpecialty").empty();
                $("#cboDoctorScheduleChangeSpecialty").append($("<option value='0'>" + localization.Select + "</option>"));
                $('#cboDoctorScheduleChangeSpecialty').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadGridDoctorExistingSchedule();
    
}
function fnLoadScheduleChangeClinic() {

    $('#cboScheduleChangeDoctorClinic').selectpicker('refresh');
    $('#cboScheduleChangeConsultationType').selectpicker('refresh');

    $("#cboScheduleChangeDoctorClinic").empty();
    $.ajax({
        url: getBaseURL() + '/ScheduleChange/GetClinicsbySpecialtyID?Businesskey=' + $("#cboScheduleChangeDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleChangeDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleChangeSpecialty").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboScheduleChangeDoctorClinic").empty();

                $("#cboScheduleChangeDoctorClinic").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboScheduleChangeDoctorClinic").append($("<option></option>").val(response[i]["ClinicId"]).html(response[i]["ClinicDesc"]));
                }
                $('#cboScheduleChangeDoctorClinic').selectpicker('refresh');
            }
            else {
                $("#cboScheduleChangeDoctorClinic").empty();
                $("#cboScheduleChangeDoctorClinic").append($("<option value='0'> Select </option>"));
                $('#cboScheduleChangeDoctorClinic').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadGridDoctorExistingSchedule();
    
}
function fnLoadScheduleChangeConsultationType() {

    $('#cboScheduleChangeConsultationType').selectpicker('refresh');

    $("#cboScheduleChangeConsultationType").empty();
    $.ajax({
        url: getBaseURL() + '/ScheduleChange/GetConsultationsbyClinicID?Businesskey=' + $("#cboScheduleChangeDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleChangeDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleChangeSpecialty").val()
            + '&ClinicID=' + $("#cboScheduleChangeDoctorClinic").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboScheduleChangeConsultationType").empty();

                $("#cboScheduleChangeConsultationType").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboScheduleChangeConsultationType").append($("<option></option>").val(response[i]["ConsultationId"]).html(response[i]["ConsultationDesc"]));
                }
                $('#cboScheduleChangeConsultationType').selectpicker('refresh');
            }
            else {
                $("#cboScheduleChangeConsultationType").empty();
                $("#cboScheduleChangeConsultationType").append($("<option value='0'>" + localization.Select + "</option>"));
                $('#cboScheduleChangeConsultationType').selectpicker('refresh');
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

function fnLoadGridDoctorExistingSchedule() {

    $("#jqgDoctorExistingSchedule").GridUnload();

    $("#jqgDoctorExistingSchedule").jqGrid({

        url: getBaseURL() + '/ScheduleChange/GetExistingDoctorScheduledList?Businesskey=' + $("#cboScheduleChangeDoctorLocation").val()
            + '&DoctorID=' + $("#cboDoctorScheduleChangeDoctor").val() + '&SpecialtyID=' + $("#cboDoctorScheduleChangeSpecialty").val()
            + '&ClinicID=' + $("#cboScheduleChangeDoctorClinic").val() + '&ConsultationID=' + $("#cboScheduleChangeConsultationType").val()
            + '&ScheduleChangeDate=' + getDate($("#txtScheduleChangeDate")),
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
                    return '<button class="mr-1 btn btn-outline" id="btnDoctorExistingSchedule"><i class="fa fa-ellipsis-v"></i></button>'
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
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDoctorExistingScheduleChange
    })

    fnAddGridSerialNoHeading();
}