$(function () {
    fnLoadGridAgeRange();
    $.contextMenu({
        selector: "#btnAgeRange",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditAgeRange(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditAgeRange(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditAgeRange(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

    console.log(_resourceMaskList);
    debugger;
    if (_resourceMaskList.length > 0) {
        $.each(_resourceMaskList, function (i, l) {
            if (l.ControlType == "text") {
                if (l.Property == 'disable') {
                    $("#" + l.InternalControlId).attr('disabled', true);
                }
                else {
                    $("#" + l.InternalControlId).attr('disabled', false);
                }
                if (l.Property == 'mask') {
                    $("#" + l.InternalControlId).attr('type','password');
                    
                }
                else {
                    $("#" + l.InternalControlId).attr('type', 'text');
                   
                }
            }

            if (l.ControlType == "select") {
                if (l.Property == 'disable') {
                    $("#" + l.InternalControlId).attr('disabled', true);
                }
                else {
                    $("#" + l.InternalControlId).attr('disabled', false);
                }
            }

            if (l.ControlType == "checkbox") {
                if (l.Property == 'hidden') {
                    if ($("#" + l.InternalControlId).hasClass('mdl-checkbox__input')) {
                        $("#" + l.InternalControlId).parent().hide();
                    }
                    else {
                        $("#" + l.InternalControlId).parent().show();
                    }
                }
                else {
                    $("#" + l.InternalControlId).show();
                }
            }



            if (l.ControlType == "button") {
                if (l.Property == 'disable') {
                    $("#" + l.InternalControlId).attr('disabled', true);
                }
                else {
                    $("#" + l.InternalControlId).attr('disabled', false);
                }
            }

        });
    }

});
var actiontype = "";

function fnLoadGridAgeRange() {
    $("#jqgAgeRange").jqGrid('GridUnload');
    $("#jqgAgeRange").jqGrid({
        url: getBaseURL() + '/AgeRange/GetAgeRanges',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.AgeRangeId, localization.RangeDesc, localization.AgeRangeFrom,"", localization.RangeFromPeriod, localization.AgeRangeTo,"", localization.RangeToPeriod, localization.Active, localization.Actions],
        colModel: [
            { name: "AgeRangeId", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "RangeDesc", width: 140, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AgeRangeFrom", width: 30, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "RangeFromPeriod", width: 30, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "RangeFromPeriodDesc", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "AgeRangeTo", width: 30, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "RangeToPeriod", width: 30, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "RangeToPeriodDesc", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnAgeRange"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            }
        ],
        pager: "#jqpAgeRange",
        rowNum: 10000,
        rownumWidth: '55',
        rowNum: 10,
        rowList: [10, 20, 50],
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption: localization.AgeRange,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgAgeRange");
        },
    }).jqGrid('navGrid', '#jqpAgeRange', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAgeRange', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAgeRange
    }).jqGrid('navButtonAdd', '#jqpAgeRange', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddAgeRange
    });
    fnAddGridSerialNoHeading();
}


function fnAddAgeRange() {

    fnClearFields();
    $('#PopupAgeRange').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $('#PopupAgeRange').find('.modal-title').text(localization.AddAgeRange);
    $("#btnSaveAgeRange").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveAgeRange").show();
    $("#btndeActiveAgeRange").hide();
    $('#txtAgeRangeId').val('');
}


function fnEditAgeRange(e, actiontype) {
    var rowid = $("#jqgAgeRange").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgAgeRange').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();

    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
    $('#txtAgeRangeId').val(rowData.AgeRangeId);
    $('#txtRangeDesc').val(rowData.RangeDesc);
    $('#txtAgeRangeFrom').val(rowData.AgeRangeFrom);
    $('#txtAgeRangeTo').val(rowData.AgeRangeTo);
    $('#cboRangeFromPeriod').val(rowData.RangeFromPeriod);
    $('#cboRangeFromPeriod').selectpicker('refresh');
    $('#cboRangeToPeriod').val(rowData.RangeToPeriod);
    $('#cboRangeToPeriod').selectpicker('refresh');
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#btnSaveAgeRange").attr("disabled", false);


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_10_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupAgeRange').modal('show');
        $('#PopupAgeRange').find('.modal-title').text(localization.UpdateAgeRange);
        $("#btnSaveAgeRange").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btndeActiveAgeRange").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveAgeRange").attr("disabled", false);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_10_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupAgeRange').modal('show');
        $('#PopupAgeRange').find('.modal-title').text(localization.ViewActions);
        $("#btnSaveAgeRange").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveAgeRange").hide();
        $("#btndeActiveAgeRange").hide();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupAgeRange").on('hidden.bs.modal', function () {
            $("#btnSaveAgeRange").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_10_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupAgeRange').modal('show');
        $('#PopupAgeRange').find('.modal-title').text("Activate/De Activate Actions");
        $("#btnSaveAgeRange").attr("disabled", false);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("#btnSaveAgeRange").hide();

        if (rowData.ActiveStatus == 'true') {
            $("#btndeActiveAgeRange").html(localization.DActivate);
        }
        else {
            $("#btndeActiveAgeRange").html(localization.Activate);
        }

        $("#btndeActiveAgeRange").show();
        $("#chkActiveStatus").prop('disabled', true);
        $("#PopupAgeRange").on('hidden.bs.modal', function () {
            $("#btnSaveAgeRange").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
        });
    }
}

function fnSaveAgeRange() {
    if (IsStringNullorEmpty($("#txtRangeDesc").val())) {
        fnAlert("w", "EPS_10_00", "UI0230", errorMsg.RangeDesc_E6);
        return;
    }
    if ($("#txtAgeRangeFrom").val() == '' || $("#txtAgeRangeFrom").val() == null || $("#txtAgeRangeFrom").val() == undefined) {
        fnAlert("w", "EPS_10_00", "UI0231", errorMsg.AgeRangeFrom_E7);
        return;
    }
    if ($("#cboRangeFromPeriod").val() == '0' || $("#cboRangeFromPeriod").val() == 0) {
        fnAlert("w", "EPS_10_00", "UI0232", errorMsg.RangeFromPeriod_E8);
        return;
    }

    if ($("#txtAgeRangeTo").val() == '' || $("#txtAgeRangeTo").val() == null || $("#txtAgeRangeTo").val() == undefined) {
        fnAlert("w", "EPS_10_00", "UI0233", errorMsg.AgeRangeTo_E9);
        return;
    }

    if ($("#cboRangeToPeriod").val() == '0' || $("#cboRangeToPeriod").val() == 0) {
        fnAlert("w", "EPS_10_00", "UI0234", errorMsg.RangeToPeriod_E10);
        return;
    }
    obj_range = {
        AgeRangeId: $("#txtAgeRangeId").val() === '' ? 0 : $("#txtAgeRangeId").val(),
        RangeDesc: $("#txtRangeDesc").val(),
        AgeRangeFrom: $("#txtAgeRangeFrom").val(),
        RangeFromPeriod: $("#cboRangeFromPeriod").val(),
        AgeRangeTo: $("#txtAgeRangeTo").val(),
        RangeToPeriod: $("#cboRangeToPeriod").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveAgeRange").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/AgeRange/InsertOrUpdateAgeRange',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj_range },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveAgeRange").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupAgeRange").modal('hide');
                fnClearFields();
                fnGridRefreshAgeRange();
                $("#btnSaveAgeRange").attr("disabled", false);

            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveAgeRange").attr("disabled", false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveAgeRange").attr("disabled", false);
        }
    });
}

function fnGridRefreshAgeRange() {
    $("#jqgAgeRange").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $('#txtAgeRangeId').val('');
    $("#cboRangeFromPeriod").val('0').selectpicker('refresh');
    $("#cboRangeToPeriod").val('0').selectpicker('refresh');
    $('#txtRangeDesc').val('');
    $('#txtAgeRangeFrom').val('');
    $('#txtAgeRangeTo').val('');
    $('#txtAgeRangeId').val('');
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnDeleteAgeRange() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btndeActiveAgeRange").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/AgeRange/ActiveOrDeActiveAgeRange?status=' + a_status + '&ageId=' + $("#txtAgeRangeId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                //$("#btndeActiveAgeRange").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupAgeRange").modal('hide');
                fnClearFields();
                fnGridRefreshAgeRange();
                $("#btndeActiveAgeRange").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btndeActiveAgeRange").attr("disabled", false);
                $("#btndeActiveAgeRange").html('De Activate');
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btndeActiveAgeRange").attr("disabled", false);
            $("#btndeActiveAgeRange").html('De Activate');
        }
    });
}
