$(function () {
    $.contextMenu({
        selector: "#btnDoctorScheduleUpdate",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDoctordaySchedule(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDoctordaySchedule(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDoctordaySchedule(event, 'delete') } },

        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i> " + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i> " + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i> " + localization.Delete + " </span>");
});
function fnLoadScheduleUpdateDoctors() {

    $('#cboDoctorScheduleUpdateDoctor').selectpicker('refresh');
    $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
    $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleUpdateDoctor").empty();
    $.ajax({
        url: getBaseURL() + '/Update/GetScheduledDoctorsbyBusinessKey?Businesskey=' + $("#cboDayScheduledBusinessKey").val(),
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

                $("#cboDoctorScheduleUpdateDoctor").append($("<option value='0'>" + localization.All + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleUpdateDoctor").append($("<option></option>").val(response[i]["DoctorId"]).html(response[i]["DoctorName"]));
                }
                $('#cboDoctorScheduleUpdateDoctor').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleUpdateDoctor").empty();
                $("#cboDoctorScheduleUpdateDoctor").append($("<option value='0'>" + localization.All + "</option>"));
                $('#cboDoctorScheduleUpdateDoctor').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadDoctordayScheduleGrid();

}
function fnLoadScheduleUpdateSpecialties() {

    $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
    $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboDoctorScheduleUpdateSpecialty").empty();
    $.ajax({
        url: getBaseURL() + '/Update/GetScheduledSpecialtiesbyDoctorID?Businesskey=' + $("#cboDayScheduledBusinessKey").val()
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

                $("#cboDoctorScheduleUpdateSpecialty").append($("<option value='0'>" + localization.All + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorScheduleUpdateSpecialty").append($("<option></option>").val(response[i]["SpecialtyID"]).html(response[i]["SpecialtyDesc"]));
                }
                $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
            }
            else {
                $("#cboDoctorScheduleUpdateSpecialty").empty();
                $("#cboDoctorScheduleUpdateSpecialty").append($("<option value='0'>" + localization.All + "</option>"));
                $('#cboDoctorScheduleUpdateSpecialty').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadDoctordayScheduleGrid();

}
function fnLoadScheduleUpdateClinic() {

    $('#cboScheduleUpdateDoctorClinic').selectpicker('refresh');
    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboScheduleUpdateDoctorClinic").empty();
    $.ajax({
        url: getBaseURL() + '/Update/GetScheduledClinicsbySpecialtyID?Businesskey=' + $("#cboDayScheduledBusinessKey").val()
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

                $("#cboScheduleUpdateDoctorClinic").append($("<option value='0'>" + localization.All + "</option>"));
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
    fnLoadDoctordayScheduleGrid();

}
function fnLoadScheduleUpdateConsultationType() {

    $('#cboScheduleUpdateConsultationType').selectpicker('refresh');

    $("#cboScheduleUpdateConsultationType").empty();
    $.ajax({
        url: getBaseURL() + '/Update/GetScheduledConsultationsbyClinicID?Businesskey=' + $("#cboDayScheduledBusinessKey").val()
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

                $("#cboScheduleUpdateConsultationType").append($("<option value='0'>" + localization.All + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboScheduleUpdateConsultationType").append($("<option></option>").val(response[i]["ConsultationId"]).html(response[i]["ConsultationDesc"]));
                }
                $('#cboScheduleUpdateConsultationType').selectpicker('refresh');
            }
            else {
                $("#cboScheduleUpdateConsultationType").empty();
                $("#cboScheduleUpdateConsultationType").append($("<option value='0'>" + localization.All + "</option>"));
                $('#cboScheduleUpdateConsultationType').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });
    fnLoadDoctordayScheduleGrid();

}
//function fnLoadDoctordaySchedulebySearchCriteria() {
//    //if (IsStringNullorEmpty($("#dtfromdate").val())) {
//      //  fnAlert("w", "ESP_06_00", "UI0194", "Please Select Schedule From Time");
//       // return;
//  //  }
//   // if (IsStringNullorEmpty($("#dttodate").val())) {
//      //  fnAlert("w", "ESP_06_00", "UI0194", "Please Select Schedule To Time");
//      //  return;
//   // }

//    fnLoadDoctordayScheduleGrid();
//}

//Grid Part and functionality Starts -- -
function fnLoadDoctordayScheduleGrid() {

    $("#jqgDoctordaySchedule").GridUnload();

    $("#jqgDoctordaySchedule").jqGrid({

        url: getBaseURL() + '/Update/GetDoctordaySchedulebySearchCriteria?Businesskey=' + $('#cboDayScheduledBusinessKey').val() + '&DoctorID=' + $('#cboDoctorScheduleUpdateDoctor').val()
            + '&SpecialtyID=' + $('#cboDoctorScheduleUpdateSpecialty').val() + '&ClinicID=' + $('#cboScheduleUpdateDoctorClinic').val() + '&ConsultationID=' + $('#cboScheduleUpdateConsultationType').val()
            + '&ScheduleFromDate=' + getDate($('#dtfromdate')) + '&ScheduleToDate=' + getDate($('#dttodate')),
        datatype: 'json',
        mtype: 'POST',

        colNames: ["", "", "", "", "", "", localization.ScheduleDate, localization.ScheduleFromTime, localization.ScheduleToTime, localization.DoctorName, localization.SpecialtyDesc, localization.ClinicDesc, localization.ConsultationType,  localization.NoOfPatients, localization.XlsheetReference, localization.Active, ""],
        colModel: [

            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationId", width: 100, editable: true, align: 'left', hidden: true },
            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SerialNo", width: 70, editable: true, align: 'left', hidden: true },
            {
                name: "ScheduleDate", editable: false, width: 60, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            { name: 'ScheduleFromTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: "DoctorName", width: 130, editable: true, align: 'left' },
           
            { name: "SpecialtyDesc", width: 100, editable: true, align: 'left' },
            { name: "ClinicDesc", width: 80, editable: true, align: 'left' },
            { name: "ConsultationDesc", width: 80, editable: true, align: 'left' },
            
           { name: "NoOfPatients", width: 60, editable: true, align: 'left', hidden: false },
            { name: "XlsheetReference", width: 80, editable: true, align: 'left', hidden: true },
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
        pager: "#jqpDoctordaySchedule",
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
            SetGridControlByAction();
            fnJqgridSmallScreen('jqgDoctordaySchedule');
        },

        onSelectRow: function (rowid, status, e) {

        },

    }).jqGrid('navGrid', '#jqpDoctordaySchedule', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDoctordaySchedule', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDoctordaySchedule
    });
   // .jqGrid('navButtonAdd', '#jqpDoctordaySchedule', {
   //     caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDoctordaySchedule
   // });
    fnAddGridSerialNoHeading();
}

function fnRefreshDoctordaySchedule() {
    $("#jqgDoctordaySchedule").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

var _isInsert = true;

//function fnAddDoctordaySchedule() {
//    if (IsStringNullorEmpty($("#cboDayScheduledBusinessKey").val()) || $('#cboDayScheduledBusinessKey').val() == '' || $('#cboDayScheduledBusinessKey').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0064", errorMsg.BusinessLocation_E6);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateDoctor").val()) || $('#cboDoctorScheduleUpdateDoctor').val() == '' || $('#cboDoctorScheduleUpdateDoctor').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0141", errorMsg.SelectDoctor_E7);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateSpecialty").val()) || $('#cboDoctorScheduleUpdateSpecialty').val() == '' || $('#cboDoctorScheduleUpdateSpecialty').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0200", errorMsg.SelectSpecialty_E8);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorClinic").val()) || $('#cboScheduleUpdateDoctorClinic').val() == '' || $('#cboScheduleUpdateDoctorClinic').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0194", errorMsg.SelectClinicType_E9);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboScheduleUpdateConsultationType").val()) || $('#cboScheduleUpdateConsultationType').val() == '' || $('#cboScheduleUpdateConsultationType').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0195", errorMsg.SelectConsultationType_E10);
//        return;
//    }

//    $("#PopupDoctordaySchedule").modal('show');
//    $('#PopupDoctordaySchedule').modal({ backdrop: 'static', keyboard: false });
//    $('#PopupDoctordaySchedule').find('.modal-title').text(localization.AddDoctordaySchedule);
//    $("#chkActiveStatus").parent().addClass("is-checked");
//    fnClearFields();
//    $("#chkActiveStatus").prop('disabled', true);
//    $("#btnSaveDoctordaySchedule").html('<i class="fa fa-save"></i>  ' + localization.Save);
//    $("#btnSaveDoctordaySchedule").show();
//    $("#btndeActiveDoctordaySchedule").hide();
//    _isInsert = true;
//}

function fnEditDoctordaySchedule(e, actiontype) {

    var rowid = $("#jqgDoctordaySchedule").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctordaySchedule').jqGrid('getRowData', rowid);
    _isInsert = false;

    $('#cboDayScheduledBusinessKey').val(rowData.BusinessKey).selectpicker('refresh');
    $('#cboDoctorScheduleUpdateDoctor').val(rowData.DoctorId).selectpicker('refresh');
    fnLoadScheduleUpdateSpecialties();
    $('#cboDoctorScheduleUpdateSpecialty').val(rowData.SpecialtyId).selectpicker('refresh');
    fnLoadScheduleUpdateClinic();
    $('#cboScheduleUpdateDoctorClinic').val(rowData.ClinicId).selectpicker('refresh');
    fnLoadScheduleUpdateConsultationType();
    $('#cboScheduleUpdateConsultationType').val(rowData.ConsultationId).selectpicker('refresh');
    

    if (rowData.ScheduleDate !== null) {
        setDate($('#dtfromdate'), fnGetDateFormat(rowData.ScheduleDate));
    }
    else {
        $('#dtfromdate').val('');
    }

    $('#txtDoctordayScheduleFromTime').val(rowData.ScheduleFromTime);
    $('#txtDoctordayScheduleToTime').val(rowData.ScheduleToTime);
    $('#txtXlSheetReference').val(rowData.XlsheetReference);
    $('#txtcurrentdocNumber').val(rowData.CurrentDocNumber);
    $('#txtNoofPatients').val(rowData.NoOfPatients);
    $('#txtSerialNumber').val(rowData.SerialNo);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveDoctordaySchedule").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ESP_06_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupDoctordaySchedule').modal('show');
        $('#PopupDoctordaySchedule').find('.modal-title').text(localization.EditDoctordaySchedule);
        $("#btnSaveDoctordaySchedule").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnSaveDoctordaySchedule").show();
        $("#btndeActiveDoctordaySchedule").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDoctordaySchedule").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ESP_06_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupDoctordaySchedule').modal('show');
        $('#PopupDoctordaySchedule').find('.modal-title').text(localization.ViewDoctordaySchedule);
        $("#btnSaveDoctordaySchedule").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctordaySchedule").hide();
        $("#btndeActiveDoctordaySchedule").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDoctordaySchedule").on('hidden.bs.modal', function () {
            $("#btnSaveDoctordaySchedule").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "ESP_06_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupDoctordaySchedule').modal('show');
        $('#PopupDoctordaySchedule').find('.modal-title').text("Activate/De Activate Doctor Day Schedule");
        $("#btndeActiveDoctordaySchedule").show();
        $("#btndeActiveDoctordaySchedule").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctordaySchedule").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDoctordaySchedule").html(localization.DActivate);
        }
        else {
            $("#btndeActiveDoctordaySchedule").html(localization.Activate);
        }

        $("#chkActiveStatus").prop('disabled', true);

        $("#PopupDoctordaySchedule").on('hidden.bs.modal', function () {
            $("#btnSaveDoctordaySchedule").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveDoctordaySchedule() {

    if (IsStringNullorEmpty($("#cboDayScheduledBusinessKey").val()) || $('#cboDayScheduledBusinessKey').val() == '' || $('#cboDayScheduledBusinessKey').val() == '0') {
        fnAlert("w", "ESP_06_00", "UI0064", errorMsg.BusinessLocation_E6);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateDoctor").val()) || $('#cboDoctorScheduleUpdateDoctor').val() == '' || $('#cboDoctorScheduleUpdateDoctor').val() == '0') {
        fnAlert("w", "ESP_06_00", "UI0141", errorMsg.SelectDoctor_E7);
        return;
    }
    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateSpecialty").val()) || $('#cboDoctorScheduleUpdateSpecialty').val() == '' || $('#cboDoctorScheduleUpdateSpecialty').val() == '0') {
        fnAlert("w", "ESP_06_00", "UI0200", errorMsg.SelectSpecialty_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorClinic").val()) || $('#cboScheduleUpdateDoctorClinic').val() == '' || $('#cboScheduleUpdateDoctorClinic').val() == '0') {
        fnAlert("w", "ESP_06_00", "UI0194", errorMsg.SelectClinicType_E9);
        return;
    }
    if (IsStringNullorEmpty($("#cboScheduleUpdateConsultationType").val()) || $('#cboScheduleUpdateConsultationType').val() == '' || $('#cboScheduleUpdateConsultationType').val() == '0') {
        fnAlert("w", "ESP_06_00", "UI0195", errorMsg.SelectConsultationType_E10);
        return;
    }

    if (IsStringNullorEmpty($("#dtfromdate").val())) {
        fnAlert("w", "ESP_06_00", "UI0436", errorMsg.SelectScheduleFromDate_E16);
        return;
    }
    if (IsStringNullorEmpty($("#txtDoctordayScheduleFromTime").val())) {
        fnAlert("w", "ESP_06_00", "UI0393", errorMsg.SelectFromTime_E17);
        return;
    }
    if (IsStringNullorEmpty($("#txtDoctordayScheduleToTime").val())) {
        fnAlert("w", "ESP_06_00", "UI0394", errorMsg.SelectToTime_E18);
        return;
    }

    if ($('#txtDoctordayScheduleFromTime').val() >= $('#txtDoctordayScheduleToTime').val()) {
        fnAlert("w", "ESP_06_00", "UI0438", errorMsg.FromTime_E19);
        return;
    }
    if (IsStringNullorEmpty($("#txtNoofPatients").val())) {
        fnAlert("w", "ESP_06_00", "UI0439", errorMsg.NoOfPatients_E20);
        return;
    }
    //if (IsStringNullorEmpty($("#txtXlSheetReference").val())) {
    //    fnAlert("w", "ESP_06_00", "UI0194", "Please Select Xl Sheet Reference");
    //    return;
    //}

    $("#btnSaveDoctordaySchedule").attr('disabled', true);

    var obj = {

        BusinessKey: $('#cboDayScheduledBusinessKey').val(),
        ConsultationId: $('#cboScheduleUpdateConsultationType').val(),
        ClinicId: $('#cboScheduleUpdateDoctorClinic').val(),
        SpecialtyId: $('#cboDoctorScheduleUpdateSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleUpdateDoctor').val(),
        ScheduleDate: getDate($("#dtfromdate")),
        SerialNo: $("#txtSerialNumber").val() === '' ? 0 : $("#txtSerialNumber").val(),
        ScheduleFromTime: $('#txtDoctordayScheduleFromTime').val(),
        ScheduleToTime: $('#txtDoctordayScheduleToTime').val(),
        NoOfPatients: $('#txtNoofPatients').val(),
        XlsheetReference: $('#txtXlSheetReference').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked")
    };
    $.ajax({
        url: getBaseURL() + '/Update/InsertOrUpdateDoctordaySchedule',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctordaySchedule").modal('hide');
                   // fnLoadDoctordayScheduleGrid();

                    fnRefreshDoctordaySchedule();
                    fnClearFields();

                    $("#btnSaveDoctordaySchedule").attr('disabled', false);
                }
                else {
                    $("#btnSaveDoctordaySchedule").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);

                }
            }
            else {
                $("#btnSaveDoctordaySchedule").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);

            }
        },
        error: function (error) {
            $("#btnSaveDoctordaySchedule").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });
}

function fnDeleteDoctordaySchedule() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    var objdel = {

        BusinessKey: $('#cboDayScheduledBusinessKey').val(),
        ConsultationId: $('#cboScheduleUpdateConsultationType').val(),
        ClinicId: $('#cboScheduleUpdateDoctorClinic').val(),
        SpecialtyId: $('#cboDoctorScheduleUpdateSpecialty').val(),
        DoctorId: $('#cboDoctorScheduleUpdateDoctor').val(),
        ScheduleDate: getDate($("#dtfromdate")),
        SerialNo: $("#txtSerialNumber").val() === '' ? 0 : $("#txtSerialNumber").val(),
        ScheduleFromTime: $('#txtDoctordayScheduleFromTime').val(),
        ScheduleToTime: $('#txtDoctordayScheduleToTime').val(),
        NoOfPatients: $('#txtNoofPatients').val(),
        XlsheetReference: $('#txtXlSheetReference').val(),
        ActiveStatus: $('#chkActiveStatus').parent().hasClass("is-checked"),
        status: a_status,
    };

    $("#btndeActiveDoctordaySchedule").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Update/ActiveOrDeActiveDoctordaySchedule',
        type: 'POST',
        datatype: 'json',
        data: { objdel },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveDoctordaySchedule").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupDoctordaySchedule").modal('hide');
                fnRefreshDoctordaySchedule();
                fnClearFields();
                $("#btndeActiveDoctordaySchedule").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveDoctordaySchedule").attr("disabled", false);
                $("#btndeActiveDoctordaySchedule").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveDoctordaySchedule").attr("disabled", false);
            $("#btndeActiveDoctordaySchedule").html(localization.Deactivate);
        }
    });
}

$("#btnCancelDoctordaySchedule").click(function () {
    $("#jqgDoctordaySchedule").jqGrid('resetSelection');
    $('#PopupDoctordaySchedule').modal('hide');
    fnClearFields();
});

//function fnClearHeader() {
//    $("#cboDayScheduledBusinessKey").val('0').selectpicker('refresh');
//    $("#cboDoctorScheduleUpdateDoctor").val('0').selectpicker('refresh');
//    $("#cboDoctorScheduleUpdateSpecialty").val('0').selectpicker('refresh');
//    $("#cboScheduleUpdateDoctorClinic").val('0').selectpicker('refresh');
//    $("#cboScheduleUpdateConsultationType").val('0').selectpicker('refresh');

//    $('#dtfromdate').val('');
//    $('#dttodate').val('');
//    fnRefreshDoctordaySchedule();
//}
function fnClearFields() {


    $('#txtDoctordayScheduleFromTime').val('');
    $('#txtDoctordayScheduleToTime').val('');
    $('#txtXlSheetReference').val('');
    $('#txtNoofPatients').val('');
    $('#txtSerialNumber').val('');
    $("#btnSaveDoctordaySchedule").attr('disabled', false);
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
    $("#btnSaveDoctordaySchedule").html('<i class="far fa-save"></i> ' + localization.Save);
}
$("#PopupDoctordaySchedule")
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
//Grid Part and functionality Ends -- -


////Export To Excel

//function fnExportToExcel() {
//    if (IsStringNullorEmpty($("#cboDayScheduledBusinessKey").val()) || $('#cboDayScheduledBusinessKey').val() == '' || $('#cboDayScheduledBusinessKey').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0064", errorMsg.BusinessLocation_E6);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateDoctor").val()) || $('#cboDoctorScheduleUpdateDoctor').val() == '' || $('#cboDoctorScheduleUpdateDoctor').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0141", errorMsg.SelectDoctor_E7);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboDoctorScheduleUpdateSpecialty").val()) || $('#cboDoctorScheduleUpdateSpecialty').val() == '' || $('#cboDoctorScheduleUpdateSpecialty').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0200", errorMsg.SelectSpecialty_E8);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboScheduleUpdateDoctorClinic").val()) || $('#cboScheduleUpdateDoctorClinic').val() == '' || $('#cboScheduleUpdateDoctorClinic').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0194", errorMsg.SelectClinicType_E9);
//        return;
//    }
//    if (IsStringNullorEmpty($("#cboScheduleUpdateConsultationType").val()) || $('#cboScheduleUpdateConsultationType').val() == '' || $('#cboScheduleUpdateConsultationType').val() == '0') {
//        fnAlert("w", "ESP_06_00", "UI0195", errorMsg.SelectConsultationType_E10);
//        return;
//    }

//    if (IsStringNullorEmpty($("#dtfromdate").val())) {
//        fnAlert("w", "ESP_06_00", "UI0194", "Please Select Schedule Date");
//        return;
//    }
//    if (IsStringNullorEmpty($("#dttodate").val())) {
//        fnAlert("w", "ESP_06_00", "UI0194", "Please Select Schedule To Time");
//        return;
//    }
//    window.location.href = getBaseURL() + '/Update/Export?Businesskey=' + $('#cboDayScheduledBusinessKey').val() + '&DoctorID=' + $('#cboDoctorScheduleUpdateDoctor').val()
//        + '&SpecialtyID=' + $('#cboDoctorScheduleUpdateSpecialty').val() + '&ClinicID=' + $('#cboScheduleUpdateDoctorClinic').val() + '&ConsultationID=' + $('#cboScheduleUpdateConsultationType').val()
//        + '&ScheduleFromDate=' + getDate($('#dtfromdate')) + '&ScheduleToDate=' + getDate($('#dttodate'));
//}
////Export To Excel Ends

////Import Excel
//function fnImportExcel() {


//    if (IsStringNullorEmpty($("#postedFile").val())) {
//        fnAlert("w", "ESP_06_00", "UI0064", "Please Select Excel file");
//        return;

//    }
//    if (IsStringNullorEmpty($("#cboDayScheduledBusinessKey").val()) || $("#cboDayScheduledBusinessKey").val() === '0') {
//        fnAlert("w", "ESP_06_00", "UI0064", "Please Select Location");
//        return;
//    }
//    $("#btnImportExcel").attr('disabled', true);
//    var obj = new FormData();
//    //appending  file object
//    obj.append("postedFile", $("#postedFile").get(0).files[0]);
//    obj.append("BusinessKey", $("#cboDayScheduledBusinessKey").val());
//    $.ajax({
//        url: getBaseURL() + '/Update/Insert_ImpotedDoctorScheduleList',
//        type: "POST",
//        data: obj,
//        dataType: "json",
//        contentType: false,
//        processData: false,
//        success: function (response) {
//            if (response !== null) {
//                if (response.Status) {
//                    fnAlert("s", "", response.StatusCode, response.Message);
//                    $("#btnImportExcel").attr('disabled', false);
//                }
//                else {
//                    fnAlert("e", "", response.StatusCode, response.Message);
//                    $("#btnImportExcel").attr('disabled', false);
//                }
//            }
//            else {
//                fnAlert("e", "", response.StatusCode, response.Message);
//                $("#btnImportExcel").attr('disabled', false);
//            }
//        },
//        error: function (error) {
//            fnAlert("e", "", error.StatusCode, error.statusText);
//            $("#btnImportExcel").attr("disabled", false);
//        }
//    });
//    $("#btnImportExcel").attr('disabled', false);
//}
//// End Import Excel