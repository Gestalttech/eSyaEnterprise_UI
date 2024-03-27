$(function () {
    fnGridLoadHolidayMaster();

    $.contextMenu({
        selector: "#btnHolidayMaster",
        trigger: "left",
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditHolidayMaster(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditHolidayMaster(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditHolidayMaster(event, 'delete') } },

        }      
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

});


var _isInsert = true;


function fnBusinessKeyChange() {

    fnGridLoadHolidayMaster();
}

function fnGridLoadHolidayMaster() {

    $("#jqgHolidayMaster").GridUnload();

    $("#jqgHolidayMaster").jqGrid({

        url: getBaseURL() + '/HolidayMaster/GetHolidayMasterByBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.Businesskey, localization.HolidayDesc, localization.Year, localization.HolidayType, localization.CurrentDocDate, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "HolidayDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "Year", width: 180, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "HolidayType", width: 180, align: 'left', editable: true, formatter: 'select', edittype: 'select', editoptions: { value: "G:General;R:Restricted" }, resizable: false, hidden: false },
            {
                name: 'HolidayDate', index: 'FromDate', width: 60, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnHolidayMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpHolidayMaster",
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
        caption: localization.HolidayMaster,
        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqpHolidayMaster");
        },

        onSelectRow: function (rowid, status, e) {
            },

    }).jqGrid('navGrid', '#jqpHolidayMaster', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpHolidayMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshHolidayMaster
        }).jqGrid('navButtonAdd', '#jqpHolidayMaster', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddHolidayMaster
    });
    fnAddGridSerialNoHeading();
}

function fnAddHolidayMaster() {
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === "0") {
        fnAlert("w", "EAD_04_00", "UIC01", errorMsg.BusinessKey_E6);
        return;
    }
    else {
        $('#PopupHolidayMaster').modal({ backdrop: 'static', keyboard: false });
        $('#PopupHolidayMaster').find('.modal-title').text(localization.AddHolidayMaster);
        $("#chkActiveStatus").parent().addClass("is-checked");
        fnClearFields();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveHolidayMaster").html('<i class="fa fa-save"></i>' + localization.Save);
        $("#btnSaveHolidayMaster").show();
        document.getElementById("dtHolidayDate").disabled = false;
        $("#btndeActiveHolidayMaster").hide();
        $('#PopupHolidayMaster').modal('show');
        _isInsert = true;
    }
}

function fnEditHolidayMaster(e, actiontype) {
    var rowid = $("#jqgHolidayMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgHolidayMaster').jqGrid('getRowData', rowid);
    _isInsert = false;

    $('#txtYear').val(rowData.Year);
    $("#txtYear").attr("disabled", true);

    $('#cboHolidayType').val(rowData.HolidayType).selectpicker('refresh');
    $("#cboHolidayType").next().attr('disabled', true).selectpicker('refresh');

    $('#txtHolidayDesc').val(rowData.HolidayDesc);
   
    if (rowData.HolidayDate !== null) {
        setDate($('#dtHolidayDate'), fnGetDateFormat(rowData.HolidayDate));
    }
    else {
        $('#dtHolidayDate').val('');
    }
    document.getElementById("dtHolidayDate").disabled = true;
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveHolidayMaster").attr("disabled", false);

    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EAD_04_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupHolidayMaster').modal('show');
        $('#PopupHolidayMaster').find('.modal-title').text(localization.EditHolidayMaster);
        $("#btnSaveHolidayMaster").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveHolidayMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#cboHolidayType").next().prop('disabled', true);
        $("#btnSaveHolidayMaster").attr("disabled", false);
      //  $("#dtHolidayDate").datepicker('enable');
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EAD_04_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupHolidayMaster').modal('show');
        $('#PopupHolidayMaster').find('.modal-title').text(localization.ViewHolidayMaster);
        $("#btnSaveHolidayMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveHolidayMaster").hide();
        $("#btndeActiveHolidayMaster").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupHolidayMaster").on('hidden.bs.modal', function () {
            $("#btnSaveHolidayMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EAD_04_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupHolidayMaster').modal('show');
        $('#PopupHolidayMaster').find('.modal-title').text("Activate/De Activate Holiday Master");
        $("#btnSaveHolidayMaster").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveHolidayMaster").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveHolidayMaster").html(localization.DActivate);
        }
        else {
            $("#btndeActiveHolidayMaster").html(localization.Activate);
        }

        $("#btndeActiveHolidayMaster").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupHolidayMaster").on('hidden.bs.modal', function () {
            $("#btnSaveHolidayMaster").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }

}

function fnGridRefreshHolidayMaster() {
    $("#jqgHolidayMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction() {

    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnClearFields() {
    
    $('#txtYear').val('');
    $("#txtYear").attr("disabled", false);

    $('#dtHolidayDate').val('');
    document.getElementById("dtHolidayDate").disabled = false;

    $("#cboHolidayType").next().attr('disabled', false).selectpicker('refresh');
    $('#cboHolidayType').val('0').selectpicker('refresh');
  
    $('#txtHolidayDesc').val('');
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveHolidayMaster").attr("disabled", false);
    $("#btndeActiveHolidayMaster").attr("disabled", false);
    
}

function fnSaveHolidayMaster() {
    var yearlength = $("#txtYear").val().length;
    if (IsStringNullorEmpty($("#cboBusinessLocation").val()) || $("#cboBusinessLocation").val() === 0) {
        fnAlert("w", "EAD_04_00", "UI0175", errorMsg.BusinessKey_E6);
        return;
    }
    if (IsStringNullorEmpty($("#txtYear").val()) || $("#txtYear").val() === "0") {
        fnAlert("w", "EAD_04_00", "UI0068", errorMsg.EnterYear_E9);
        return;
    }
    if (yearlength < 4) {
        fnAlert("w", "EAD_04_00", "UI0298", errorMsg.EnterYearlength_E11);
        return;
    }
    if (IsStringNullorEmpty($("#dtHolidayDate").val())) {
        fnAlert("w", "EAD_04_00", "UI0177", errorMsg.HolidayDate_E8);
        return;
    }
    if (IsStringNullorEmpty($("#cboHolidayType").val()) || $("#cboHolidayType").val() === 0 || $("#cboHolidayType").val() === "0") {
        fnAlert("w", "EAD_04_00", "UI0297", errorMsg.HolidayType_E10);
        return;
    }
    if (IsStringNullorEmpty($("#txtHolidayDesc").val()) || $("#txtHolidayDesc").val() === "0") {
        fnAlert("w", "EAD_04_00", "UI0176", errorMsg.HolidayDesc_E7);
        return;
    }
    
   

    objhm = {
        BusinessKey: $("#cboBusinessLocation").val(),
        HolidayType: $("#cboHolidayType").val(),
        Year: $("#txtYear").val(),
        HolidayDesc: $("#txtHolidayDesc").val(),
        HolidayDate: getDate($("#dtHolidayDate")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),

    };

    $("#btnSaveHolidayMaster").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/HolidayMaster/InsertAndUpdateHolidayMaster',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: objhm },
        success: function (response) {
            if (response.Status) {

                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveHolidayMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupHolidayMaster").modal('hide');
                fnClearFields();
                fnGridRefreshHolidayMaster();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveHolidayMaster").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveHolidayMaster").attr("disabled", false);
        }
    });
}

function fnDeleteHolidayMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }

    objgen = {
        BusinessKey: $("#cboBusinessLocation").val(),
        HolidayType: $("#cboHolidayType").val(),
        Year: $("#txtYear").val(),
        HolidayDesc: $("#txtHolidayDesc").val(),
        HolidayDate: getDate($("#dtHolidayDate")),
        _status: a_status,
    };
   
    $("#btndeActiveHolidayMaster").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/HolidayMaster/ActiveOrDeActiveHolidayMaster',
        type: 'POST',
        datatype: 'json',
        data: { objgen },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btndeActiveHolidayMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupHolidayMaster").modal('hide');
                fnClearFields();
                fnGridRefreshHolidayMaster();

               
                $("#btndeActiveHolidayMaster").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveHolidayMaster").attr("disabled", false);
                $("#btndeActiveHolidayMaster").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveHolidayMaster").attr("disabled", false);
            $("#btndeActiveHolidayMaster").html('De Activate');
        }
    });
}


