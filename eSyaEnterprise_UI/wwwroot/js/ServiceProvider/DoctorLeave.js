
$(function () {
    $("#txtLeaveFrom").datepicker({
        dateFormat: _cnfDateFormat,
        //minDate: new Date(),
        onSelect: function (date) {
            var dpToDate = $('#txtOnLeaveTillDoctor');
            var startDate = $(this).datepicker('getDate');
            var minDate = $(this).datepicker('getDate');
            dpToDate.datepicker('setDate', minDate);
            startDate.setDate(startDate.getDate() + 30);
            dpToDate.datepicker('option', 'minDate', minDate);
        }
    });

     

    $.contextMenu({
        selector: "#btnDoctorLeave",
        trigger: "left",
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDoctorLeave(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditDoctorLeave(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditDoctorLeave(event, 'delete') } },

        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});


var _isInsert = true;


function fnLoadDoctorList() {
    $("#cboDoctorName").empty();
    $.ajax({
        url: getBaseURL() + '/Leave/GetDoctorsbyBusinessKey?Businesskey=' + $("#cboDoctorLocation").val(),
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", xhr.StatusCode, xhr.statusText);
        },
        success: function (response) {
            if (response != null) {

                //refresh each time
                $("#cboDoctorName").empty();

                $("#cboDoctorName").append($("<option value='0'>"+ localization.Select+ "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboDoctorName").append($("<option></option>").val(response[i]["DoctorId"]).html(response[i]["DoctorName"]));
                }
                $('#cboDoctorName').selectpicker('refresh');
            }
            else {
                $("#cboDoctorName").empty();
                $("#cboDoctorName").append($("<option value='0'> Select </option>"));
                $('#cboDoctorName').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });

     fnGridLoadDoctorLeave();
}


function fnDoctorNameChange() {
    
    fnGridLoadDoctorLeave();
}
function  fnGridLoadDoctorLeave() {

    $("#jqgDoctorLeave").GridUnload();
    var codeType = $("#cboDoctorName").val();

    $("#jqgDoctorLeave").jqGrid({

        url: getBaseURL() + 'Leave/GetDoctorLeaveListAll?Businesskey=' + $("#cboDoctorLeaveLocation").val() + '&DoctorID=' + $("#cboDoctorName").val(),
        datatype: 'local',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        colNames: [localization.BusinessLocation, localization.DoctorId,localization.LeaveFrom, localization.LeaveTo, localization.Active, localization.Actions],

                colModel: [
                    { name: "BusinessKey", width: 50, editable: true, align: 'left', hidden:true },
                    { name: "DoctorId", width: 50, editable: true, align: 'left', hidden:true },
                    {
                        name: 'OnLeaveFrom', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                            { newformat: _cnfjqgDateFormat }
                    },
                    {
                        name: 'OnLeaveTill', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                            { newformat: _cnfjqgDateFormat }
                    },
                    
                    { name: "NoOfDays", width: 50, editable: true, align: 'left', hidden: false },
                    { name: "Comments", width: 250, editable: true, align: 'left', hidden: false },
                    
                      { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

                    {
                        name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                        formatter: function (cellValue, options, rowdata, action) {
                            return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnDoctorLeave"><i class="fa fa-ellipsis-v"></i> </button>'
                        }
                    },
                ],
 
        pager: "#jqpDoctorLeave",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption: localization.DoctorLeave,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpDoctorLeave");
        },

        onSelectRow: function (rowid, status, e) {
        },

    }).jqGrid('navGrid', '#jqpDoctorLeave', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpDoctorLeave', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDoctorLeave
    }).jqGrid('navButtonAdd', '#jqpDoctorLeave', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddDoctorLeave
    });
    fnAddGridSerialNoHeading();
}

function fnAddDoctorLeave() {


    $('#txtLeaveFrom').attr('disabled', false);
    $('#txtLeaveTo').attr('disabled', false);

    if ($("#cboDoctorLeaveLocation").val() == "0" || $("#cboDoctorLeaveLocation").val() == "" || $("#cboDoctorLeaveLocation").val() == null) {
        fnAlert("w", "ESP_02_00", " ", " Please select the business location ");
        return;
    }

    else if (IsStringNullorEmpty($("#cboDoctorName").val() || $("#cboDoctorName").val() == "0")) {
        fnAlert("w", "ESP_02_00", " ", " Please select Docter Name ");
        return;
    }
    else
    {

     $('#PopupDoctorLeave').modal('show');
     $('#PopupDoctorLeave').modal({ backdrop: 'static', keyboard: false });
     $('#PopupDoctorLeave').find('.modal-title').text(localization.AddLeave);
     $("#chkActiveStatus").parent().addClass("is-checked");
     $("#btnSaveDoctorLeave").show();
     $("#btndeActiveDoctorLeave").hide();
        $('#PopupDoctorLeave').on('hidden.bs.modal', fnClearDoctorLeave());
     $('#PopupDoctorLeave').modal('show');
     
    }
}

function fnEditDoctorLeave(e, actiontype) {
  
    var rowid = $("#jqgDoctorLeave").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDoctorLeave').jqGrid('getRowData', rowid);

    $('#txtNoOfDays').val(rowData.NoOfDays);
    $('#txtComments').val(rowData.Comments);
     
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }

    if (rowData.OnLeaveFrom !== null) {
        setDate($('#txtLeaveFrom'), fnGetDateFormat(rowData.OnLeaveFrom));
    }
    else {
        $('#txtLeaveFrom').val('');
    }


    if (rowData.OnLeaveTill !== null) {
        setDate($('#txtLeaveTo'), fnGetDateFormat(rowData.OnLeaveTill));
    }
    else {
        $('#txtLeaveTo').val('');
    }
    $('#txtLeaveFrom').attr('disabled', true);
    $('#txtLeaveTo').attr('disabled', true);
    $("#btnSaveDoctorLeave").attr("disabled", false);

    _isInsert = false;

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "ESP_02_00", "UIC02", errorMsg.UnAuthorised_edit_E1);
            return;
        }
        $('#PopupDoctorLeave').modal('show');
        $('#PopupDoctorLeave').find('.modal-title').text(localization.UpdateActions);
        $("#btnSaveDoctorLeave").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveDoctorLeave").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveDoctorLeave").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "ESP_02_00", "UIC03", errorMsg.UnAuthorised_view_E2);
            return;
        }
        $('#PopupDoctorLeave').modal('show');
        $('#PopupDoctorLeave').find('.modal-title').text(localization.ViewActions);
        $("#btnSaveDoctorLeave").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctorLeave").hide();
        $("#btndeActiveDoctorLeave").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDoctorLeave").on('hidden.bs.modal', function () {
            $("#btnSaveDoctorLeave").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "ESP_02_00", "UIC04", errorMsg.UnAuthorised_delete_E3);
            return;
        }
        $('#PopupDoctorLeave').modal('show');
        $('#PopupDoctorLeave').find('.modal-title').text(localization.ActivateDeactivateActions);
        $("#btnSaveDoctorLeave").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveDoctorLeave").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveDoctorLeave").html(localization.Deactivate);
        }
        else {
            $("#btndeActiveDoctorLeave").html(localization.Activate);
        }

        $("#btndeActiveDoctorLeave").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupDoctorLeave").on('hidden.bs.modal', function () {
            $("#btnSaveDoctorLeave").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

}

function fnGridRefreshDoctorLeave() {

    $("#jqgDoctorLeave").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnCalculateLeaveDays() {

    if ($('#txtLeaveFrom').val() != '' && $('#txtLeaveTo').val() != '') {

        var start = new Date(getDate($('#txtLeaveFrom')));
        var end = new Date(getDate($('#txtLeaveTo')));

        var diff = new Date(end - start);

        var days = diff / (1000 * 60 * 60 * 24);

        days = Math.floor(days) + 1;

        return days;
    }
    else
        return 0;
}



function fnSaveDoctorLeave() {

    if ($("#cboDoctorLeaveLocation").val() == "0" || $("#cboDoctorLeaveLocation").val() == "" || $("#cboDoctorLeaveLocation").val() == null) {
        fnAlert("w", "ESP_02_00", " ", " Please select the business location ");
        return;
    }

    if (IsStringNullorEmpty($("#cboDoctorName").val() || $("#cboDoctorName").val() == "0") ) {
        fnAlert("w", "ESP_02_00", " ", " Please select Docter Name ");
        return;
    }
    if (IsStringNullorEmpty($("#txtLeaveFrom").val()) ) {
        fnAlert("w", "ESP_02_00", " ", "Please select LeaveFrom ");
        return;
    }
   
    if (IsStringNullorEmpty($("#txtLeaveTo").val()) ) {
        fnAlert("w", "ESP_02_00", " ", "Please select LeaveTo ");
        return;
    }
    if (IsStringNullorEmpty($("#txtComments").val())) {
        fnAlert("w", "ESP_02_00", " ", "Please enter the comments ");
        return;
    }
    obj_leave = {
        BusinessKey: $("#cboDoctorLeaveLocation").val(),
        DoctorId: $("#cboDoctorName").val(),
        OnLeaveFrom: getDate($("#txtLeaveFrom")),
        OnLeaveTill: getDate($("#txtLeaveTo")),
        NoOfDays: fnCalculateLeaveDays(),
        Comments: $("#txtComments").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    $("#btnSaveDoctorLeave").attr('disabled', true);

    var URL = '';
    if ($('#hdvDoctorLeaveFromDate').val() == '')
        URL = getBaseURL() + '/Doctors/InsertIntoDoctorLeave';
    else
        URL = getBaseURL() + '/Doctors/UpdateDoctorLeave';

    $.ajax({
        url: URL,
        type: 'POST',
        data: { obj_leave },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveDoctorLeave").attr('disabled', false);
                $('#PopupDoctorLeave').modal('hide');
                fnGridRefreshDoctorLeave();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveDoctorLeave").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDoctorLeave").attr('disabled', false);
        }
    })
}

 

function fnDeleteDoctorLeave() {
    var a_status;
    //Activate or De Activate the status
    if ($("#chkScheduleActive").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    

    $("#btndeactiveDoctorLeave").attr('disabled', true);

    var obj = {
        _status: a_status
    };


    $.ajax({
        url: getBaseURL() + '/DoctorLeave/ActivateOrDeActivateDoctorLeave',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response != null) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    $("#PopupDoctorLeave").modal('hide');
                    fnClearDoctorLeave();
                    fnGridRefreshDoctorLeave();
                    $("#btndeactiveDoctorLeave").attr('disabled', false);
                }
                else {
                    $("#btndeactiveDoctorLeave").attr('disabled', false);
                    fnAlert("e", "", response.StatusCode, response.Message);
                }
            }
            else {
                $("#btndeactiveDoctorLeave").attr('disabled', false);
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            $("#btndeactiveDoctorLeave").attr("disabled", false);
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnClearDoctorLeave() {

    $('#txtLeaveFrom').val('');
    $('#txtLeaveTo').val('');
    $('#txtNoOfDays').val('');
    $("#txtComments").val('');
    $('#chkActiveStatus').prop('checked', false);
    $("#btnSaveDoctorLeave").attr("disabled", false);

}