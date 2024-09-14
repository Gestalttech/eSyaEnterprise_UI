var IsInsert = false;

$(function () {

    $(window).on('resize', function () {
        if ($(window).width() < 1025) {
            fnJqgridSmallScreen('jqgDoctorScheduleChange');
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
    fnLoadDoctorScheduleChangeGrid();
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
    fnLoadDoctorScheduleChangeGrid();
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
    fnLoadDoctorScheduleChangeGrid();
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
}
function fnLoadDoctorScheduleChangeGrid() {

    $("#jqgDoctorScheduleChange").GridUnload();

    $("#jqgDoctorScheduleChange").jqGrid({

        url: getBaseURL() + '/ScheduleChange/GetDoctorScheduleChangeList?Businesskey=' + $("#cboScheduleChangeDoctorLocation").val()
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
            { name: "DayOfWeek", width: 70, editable: true, align: 'left', hidden: true },
            { name: "PatientCountPerHour", width: 60, editable: true, align: 'left', hidden: false },
            { name: "TimeSlotInMins", width: 60, editable: true, align: 'left', hidden: false },
            { name: "RoomNo", width: 60, editable: true, align: 'left', hidden: true },
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
        pager: "#jqpDoctorScheduleChange",
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
            fnJqgridSmallScreen('jqgDoctorScheduleChange');
        },

        onSelectRow: function (rowid, status, e) {

        },

    }).jqGrid('navGrid', '#jqpDoctorScheduleChange', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctorScheduleChange', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDoctorScheduleChange
    }).jqGrid('navButtonAdd', '#jqpDoctorScheduleChange', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDoctorSchedule
    });
    fnAddGridSerialNoHeading();
}
function fnRefreshDoctorScheduleChange() {
    $("#jqgDoctorScheduleChange").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnAddDoctorSchedule() {
    IsInsert = true;
    $('#txtScheduleChangeFromTime').attr('disabled', false);
    $('#txtScheduleChangeToTime').attr('disabled', false);
    if (IsStringNullorEmpty($("#cboScheduleChangeDoctorLocation").val()) || $('#cboScheduleChangeDoctorLocation').val() == '' || $('#cboScheduleChangeDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleChangeDoctor").val()) || $('#cboDoctorScheduleChangeDoctor').val() == '' || $('#cboDoctorScheduleChangeDoctor').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleChangeSpecialty").val()) || $('#cboDoctorScheduleChangeSpecialty').val() == '' || $('#cboDoctorScheduleChangeSpecialty').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleChangeDoctorClinic").val()) || $('#cboScheduleChangeDoctorClinic').val() == '' || $('#cboScheduleChangeDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleChangeConsultationType").val()) || $('#cboScheduleChangeConsultationType').val() == '' || $('#cboScheduleChangeConsultationType').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }
    fnClearDoctorScheduleChange();
    $("#btnSaveDoctorScheduleChange").show();
    $("#btnDeleteDoctorScheduleChange").hide();
    $("#PopupDoctorScheduleChange").modal("show");
    $("#chkScheduleChangeActive").parent().addClass("is-checked");
    $('#PopupDoctorScheduleChange').find('.modal-title').text(localization.AddDoctorScheduleChange);
    $("#btnSaveDoctorScheduleChange").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkScheduleChangeActive").prop('disabled', true);
    $("#btnSaveDoctorScheduleChange").show();
}

function fn_EditDoctorSchedule(e, actiontype) {
    IsInsert = false;
    var rowid = $("#jqgDoctorScheduleChange").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorScheduleChange').jqGrid('getRowData', rowid);

    $('#hdvDoctorScheduleChangeSerialNo').val(rowData.SerialNo);
    $('#cboDoctorScheduleChangeWeekDays').selectpicker('refresh');
    $('#txtScheduleChangeFromTime').val(rowData.ScheduleFromTime);
    $('#txtScheduleChangeToTime').val(rowData.ScheduleToTime);
    $('#txtScheduleChangePatientsPerHr').val(rowData.PatientCountPerHour);
    $('#txtScheduleChangeTimeSlotInMins').val(rowData.TimeSlotInMins);

    if (rowData.ActiveStatus === "true")
        $('#chkScheduleChangeActive').parent().addClass("is-checked");
    else
        $('#chkScheduleChangeActive').parent().removeClass("is-checked");



    $("#btnSaveDoctorScheduleChange").html('<i class="far fa-save"></i> ' + localization.Update);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ESP_04_00", "UIC02", errorMsg.editauth_E3);
            return;
        }
        $("#btnSaveDoctorScheduleChange").show();
        $("#btnDeleteDoctorScheduleChange").hide();
        $('#PopupDoctorScheduleChange').modal('show');
        $('#PopupDoctorScheduleChange').find('.modal-title').text(localization.UpdateDoctorScheduleChange);
        $("#btnSaveDoctorScheduleChange").html('<i class="fa fa-sync mr-1"></i> ' + localization.Update);
        $("#chkScheduleChangeActive").prop('disabled', true);
        $("#btnSaveDoctorScheduleChange").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ESP_04_00", "UIC03", errorMsg.vieweauth_E4);
            return;
        }
        $("#btnSaveDoctorScheduleChange").hide();
        $("#btnDeleteDoctorScheduleChange").hide();
        $('#PopupDoctorScheduleChange').modal('show');
        $('#PopupDoctorScheduleChange').find('.modal-title').text(localization.ViewDoctorScheduleChange);
        $("#btnSaveDoctorScheduleChange").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctorScheduleChange").hide();
        $("#chkScheduleChangeActive").prop('disabled', true);
        $("#PopupDoctorScheduleChange").on('hidden.bs.modal', function () {
            $("#btnSaveDoctorScheduleChange").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "ESP_04_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupDoctorScheduleChange').modal('show');
        $('#PopupDoctorScheduleChange').find('.modal-title').text(localization.ActivateDeactivateDoctorSchedule);
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeleteDoctorScheduleChange").html(localization.Deactivate);
        }
        else {
            $("#btnDeleteDoctorScheduleChange").html(localization.Activate);
        }
        $("#btnSaveDoctorScheduleChange").hide();
        $("#btnDeleteDoctorScheduleChange").show();
        $("#chkScheduleChangeActive").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
    }
}
function fnSaveDoctorScheduleChange() {

    if (IsStringNullorEmpty($("#cboScheduleChangeDoctorLocation").val()) || $('#cboScheduleChangeDoctorLocation').val() == '' || $('#cboScheduleChangeDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleChangeDoctor").val()) || $('#cboDoctorScheduleChangeDoctor').val() == '' || $('#cboDoctorScheduleChangeDoctor').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleChangeSpecialty").val()) || $('#cboDoctorScheduleChangeSpecialty').val() == '' || $('#cboDoctorScheduleChangeSpecialty').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleChangeDoctorClinic").val()) || $('#cboScheduleChangeDoctorClinic').val() == '' || $('#cboScheduleChangeDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleChangeConsultationType").val()) || $('#cboScheduleChangeConsultationType').val() == '' || $('#cboScheduleChangeConsultationType').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }
    
    if ($('#txtScheduleChangeFromTime').val() == '') {
        fnAlert("w", "ESP_04_00", "UI0393", errorMsg.SelectFromTime_E12);
        return;
    }
    if ($('#txtScheduleChangeToTime').val() == '') {
        fnAlert("w", "ESP_04_00", "UI0394", errorMsg.SelectToTime_E13);
        return;
    }
    if ($('#txtScheduleChangeFromTime').val() >= $('#txtScheduleChangeToTime').val()) {
        fnAlert("w", "ESP_04_00", "UI0395", errorMsg.FromTimeToTime_E14);
        return;
    }
    
    $("#btnSaveDoctorScheduleChange").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboScheduleChangeDoctorLocation').val(),
        ConsultationID: $('#cboScheduleChangeConsultationType').val(),
        ClinicID: $('#cboScheduleChangeDoctorClinic').val(),
        SpecialtyID: $('#cboDoctorScheduleChangeSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleChangeDoctor').val(),
        SerialNo: $('#hdvDoctorScheduleChangeSerialNo').val(),
        ScheduleFromTime: $('#txtScheduleChangeFromTime').val(),
        ScheduleToTime: $('#txtScheduleChangeToTime').val(),
        PatientCountPerHour: $('#txtScheduleChangePatientsPerHr').val(),
        TimeSlotInMins: $('#txtScheduleChangeTimeSlotInMins').val(),
        RoomNo: '-',
        ScheduleChangeDate: getDate($("#txtScheduleChangeDate")),
        ActiveStatus: $('#chkScheduleChangeActive').parent().hasClass("is-checked")

    };

    var URL = '';
    if (IsInsert)
        URL = getBaseURL() + '/ScheduleChange/InsertIntoDoctorScheduleChange';
    else
        URL = getBaseURL() + '/ScheduleChange/UpdateDoctorScheduleChange';

    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctorScheduleChange").modal('hide');
                    fnClearDoctorScheduleChange();
                    fnRefreshDoctorScheduleChange();

                    $("#btnSaveDoctorScheduleChange").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctorScheduleChange").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
            }
            else {
                $("#btnSaveDoctorScheduleChange").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            $("#btnSaveDoctorScheduleChange").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}


function fnDeleteDoctorScheduleChange() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkScheduleChangeActive").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    if (IsStringNullorEmpty($("#cboScheduleChangeDoctorLocation").val()) || $('#cboScheduleChangeDoctorLocation').val() == '' || $('#cboScheduleChangeDoctorLocation').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleChangeDoctor").val()) || $('#cboDoctorScheduleChangeDoctor').val() == '' || $('#cboDoctorScheduleChangeDoctor').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleChangeSpecialty").val()) || $('#cboDoctorScheduleChangeSpecialty').val() == '' || $('#cboDoctorScheduleChangeSpecialty').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleChangeDoctorClinic").val()) || $('#cboScheduleChangeDoctorClinic').val() == '' || $('#cboScheduleChangeDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleChangeConsultationType").val()) || $('#cboScheduleChangeConsultationType').val() == '' || $('#cboScheduleChangeConsultationType').val() == '0') {
        fnAlert("w", "ESP_04_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }
    
    if ($('#txtScheduleChangeFromTime').val() == '') {
        fnAlert("w", "ESP_04_00", "UI0393", errorMsg.SelectFromTime_E12);
        return;
    }
    if ($('#txtScheduleChangeToTime').val() == '') {
        fnAlert("w", "ESP_04_00", "UI0394", errorMsg.SelectToTime_E13);
        return;
    }
    if ($('#txtScheduleChangeFromTime').val() >= $('#txtScheduleChangeToTime').val()) {
        fnAlert("w", "ESP_04_00", "UI0395", errorMsg.FromTimeToTime_E14);
        return;
    }
   
    $("#btnDeleteDoctorScheduleChange").attr('disabled', true);

    var obj = {
        BusinessKey: $('#cboScheduleChangeDoctorLocation').val(),
        ConsultationID: $('#cboScheduleChangeConsultationType').val(),
        ClinicID: $('#cboScheduleChangeDoctorClinic').val(),
        SpecialtyID: $('#cboDoctorScheduleChangeSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleChangeDoctor').val(),
        SerialNo: $('#hdvDoctorScheduleChangeSerialNo').val(),
        ScheduleFromTime: $('#txtScheduleChangeFromTime').val(),
        ScheduleToTime: $('#txtScheduleChangeToTime').val(),
        PatientCountPerHour: $('#txtScheduleChangePatientsPerHr').val(),
        TimeSlotInMins: $('#txtScheduleChangeTimeSlotInMins').val(),
        RoomNo: '-',
        ScheduleChangeDate: getDate($("#txtScheduleChangeDate")),
        ActiveStatus: $('#chkScheduleChangeActive').parent().hasClass("is-checked"),
        _status: a_status
    };


    $.ajax({
        url: getBaseURL() + '/ScheduleChange/ActivateOrDeActivateDoctorScheduleChange',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctorScheduleChange").modal('hide');
                    fnClearDoctorScheduleChange();
                    fnRefreshDoctorScheduleChange();

                    $("#btnDeleteDoctorScheduleChange").attr('disabled', false);
                }
                else {
                    $("#btnDeleteDoctorScheduleChange").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
            }
            else {
                $("#btnDeleteDoctorScheduleChange").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            $("#btnDeleteDoctorScheduleChange").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnClearDoctorScheduleChange() {
    
    $('#cboDoctorScheduleChangeWeekDays').val('0');
    $('#cboDoctorScheduleChangeWeekDays').selectpicker('refresh');
    $('#txtScheduleChangeFromTime').val('');
    $('#txtScheduleChangeToTime').val('');
    $('#txtScheduleChangePatientsPerHr').val('');
    $('#txtScheduleChangeTimeSlotInMins').val('');
    $('#hdvDoctorScheduleChangeSerialNo').val('');
    $('#chkScheduleChangeActive').parent().addClass("is-checked");

    $("#btnSaveDoctorScheduleChange").html('<i class="far fa-save"></i> ' + localization.Save);
}


