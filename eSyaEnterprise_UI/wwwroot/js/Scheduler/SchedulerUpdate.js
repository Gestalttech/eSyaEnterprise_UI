$(function () {
    $.contextMenu({
        selector: "#btnDoctorScheduleUpdate",
        trigger: 'left',
        items: {
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDoctordaySchedule(event, 'view') } },

        }
    });
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});


//Grid Part and functionality Starts -- -
function fnLoadDoctordayScheduleGrid() {

    $("#jqgDoctordaySchedule").GridUnload();

    $("#jqgDoctordaySchedule").jqGrid({

        url: getBaseURL() + '/Update/GetUploadedDoctordaySchedulebySearchCriteria?Businesskey=' + $('#cboDayScheduledBusinessKey').val()
            + '&ScheduleFromDate=' + getDate($('#dtfromdate')) + '&ScheduleToDate=' + getDate($('#dttodate')),
        datatype: 'json',
        mtype: 'POST',

        colNames: ["", "", "", "", "", "", localization.SpecialtyDesc, localization.ClinicDesc, localization.ConsultationType, localization.DoctorName, localization.ScheduleDate, localization.ScheduleFromTime, localization.ScheduleToTime, localization.NoOfPatients, localization.XlsheetReference, localization.Active, ""],
        colModel: [

            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ClinicId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ConsultationId", width: 100, editable: true, align: 'left', hidden: true },
            { name: "DoctorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SerialNo", width: 70, editable: true, align: 'left', hidden: true },
            { name: "SpecialtyDesc", width: 100, editable: true, align: 'left' },
            { name: "ClinicDesc", width: 80, editable: true, align: 'left' },
            { name: "ConsultationDesc", width: 80, editable: true, align: 'left' },
            { name: "DoctorName", width: 130, editable: true, align: 'left' },
            {
                name: "ScheduleDate", editable: false, width: 60, align: 'left', formatter: 'date', formatoptions: { newformat: _cnfjqgDateFormat }

            },
            { name: 'ScheduleFromTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
            { name: 'ScheduleToTime', index: 'Tid', width: 60, editable: true, formatoptions: { srcformat: 'ISO8601Long', newformat: 'ShortTime' }, editrules: { time: true } },
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
    fnAddGridSerialNoHeading();
}

function fnRefreshDoctordaySchedule() {
    $("#jqgDoctordaySchedule").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

var _isInsert = true;



function fnEditDoctordaySchedule(e, actiontype) {

    var rowid = $("#jqgDoctordaySchedule").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctordaySchedule').jqGrid('getRowData', rowid);
    _isInsert = false;

    $('#cboDayScheduledBusinessKey').val(rowData.BusinessKey).selectpicker('refresh');
    $('#cboDoctorScheduleUpdateSpecialty').val(rowData.SpecialtyId).selectpicker('refresh');
    $('#cboScheduleUpdateDoctorClinic').val(rowData.ClinicId).selectpicker('refresh');
    $('#cboScheduleUpdateConsultationType').val(rowData.ConsultationId).selectpicker('refresh');
    $('#cboDoctorScheduleUpdateDoctor').val(rowData.DoctorId).selectpicker('refresh');

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
            fnAlert("w","","","your Not Authorized to Edit");
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
            fnAlert("w", "", "", "your Not Authorized to View");
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
            fnAlert("w", "", "", "your Not Authorized to Delete");
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
$("#btnCancelDoctordaySchedule").click(function () {
    $("#jqgDoctordaySchedule").jqGrid('resetSelection');
    $('#PopupDoctordaySchedule').modal('hide');
    fnClearFields();
});


function fnClearFields() {
    

    $('#txtDoctordayScheduleFromTime').val('');
    $('#txtDoctordayScheduleToTime').val('');
    $('#txtXlSheetReference').val('');
    $('#txtNoofPatients').val('');
    $('#txtSerialNumber').val('');
    $("input,textarea").attr('readonly', false);
    $("select").next().attr('disabled', false);
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
    //if (IsStringNullorEmpty($("#cboDayScheduledBusinessKey").val()) || $('#cboDayScheduledBusinessKey').val() == '' || $('#cboDayScheduledBusinessKey').val() == '0') {
    //    fnAlert("w", "ESP_05_00", "UI0064", errorMsg.BusinessLocation_E6);
    //    return;
    //}
   

    //if (IsStringNullorEmpty($("#dtfromdate").val())) {
    //    fnAlert("w", "ESP_05_00", "UI0194", "Please Select Schedule Date");
    //    return;
    //}
    //if (IsStringNullorEmpty($("#dttodate").val())) {
    //    fnAlert("w", "ESP_05_00", "UI0194", "Please Select Schedule To Time");
    //    return;
    //}
    //window.location.href = getBaseURL() + '/Update/Export?Businesskey=' + $('#cboDayScheduledBusinessKey').val() + '&DoctorID=' + $('#cboDoctorScheduleUpdateDoctor').val()
    //    + '&SpecialtyID=' + $('#cboDoctorScheduleUpdateSpecialty').val() + '&ClinicID=' + $('#cboScheduleUpdateDoctorClinic').val() + '&ConsultationID=' + $('#cboScheduleUpdateConsultationType').val()
    //    + '&ScheduleFromDate=' + getDate($('#dtfromdate')) + '&ScheduleToDate=' + getDate($('#dttodate'));
    window.location.href = getBaseURL() + '/Update/Export?Businesskey=' + $('#cboDayScheduledBusinessKey').val()
        + '&ScheduleFromDate=' + getDate($('#dtfromdate')) + '&ScheduleToDate=' + getDate($('#dttodate'));
}
//Export To Excel Ends

//Import Excel
function fnImportExcel() {


    if (IsStringNullorEmpty($("#postedFile").val())) {
        fnAlert("w", "ESP_05_00", "UI0064", "Please Select Excel file");
        return;
        
    }
    if (IsStringNullorEmpty($("#cboDayScheduledBusinessKey").val()) || $("#cboDayScheduledBusinessKey").val() === '0') {
        fnAlert("w", "ESP_05_00", "UI0064", "Please Select Location");
        return;
    }
    $("#btnImportExcel").attr('disabled', true);
    var obj = new FormData();
    //appending  file object
    obj.append("postedFile", $("#postedFile").get(0).files[0]);
    obj.append("BusinessKey", $("#cboDayScheduledBusinessKey").val());
    $.ajax({
        url: getBaseURL() + '/Update/Insert_ImpotedDoctorScheduleList',
        type: "POST",
        data: obj,
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (response) {
            if (response !== null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#btnImportExcel").attr('disabled', false);
                    fnLoadDoctordayScheduleGrid();
                }
                else {
                    fnAlert("e", "", response.StatusCode, response.Message);
                    $("#btnImportExcel").attr('disabled', false);
                }
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnImportExcel").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnImportExcel").attr("disabled", false);
        }
    });
    $("#btnImportExcel").attr('disabled', false);
}
// End Import Excel