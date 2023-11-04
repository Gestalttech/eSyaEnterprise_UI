$(document).ready(function () {
    $("#txtyear").blur(function () {
        var year = $("#txtyear").val();
        $("#txtCalDefFRMDate").val(year + '-01-01');
        $("#txtCalDefTillDate").val(year + '-12-31');
    });
    fnGridLoadCalendarHeader();
});

$('#txtCalDefFRMDate').change(function () {
    var date = this.valueAsDate;
    date.setDate(date.getDate() + 364);
    $('#txtCalDefTillDate')[0].valueAsDate = date;
});

function fnGridLoadCalendarHeader() {
    $("#jqgCalendarHeader").jqGrid('GridUnload');
    $("#jqgCalendarHeader").jqGrid({
        url: getBaseURL() + '/Control/GetCalendarHeaders',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CalenderType, localization.Year, localization.FromDate, localization.TillDate, localization.YearEndStatus,localization.Active],
        colModel: [
            { name: "CalenderType", width: 70, editable: true, align: 'left', hidden: false },

            { name: "Year", width: 70, editable: true, align: 'left', hidden: false },
            //{ name: "FromDate", editable: true, width: 90, align: 'left', formatter: 'date' },
            {
                name: 'FromDate', index: 'FromDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            //{ name: "TillDate", editable: true, width: 90, align: 'left', formatter: 'date' },
            {
                name: 'TillDate', index: 'TillDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "YearEndStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:'55',
        loadonce: true,
        pager: "#jqpCalendarHeader",
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
        caption:'Calendar Header',
        loadComplete: function (data) {
            SetGridControlByAction();
            //fnSetGridWidth("jqpCalendarHeader");
            fnJqgridSmallScreen("jqgCalendarHeader");
        },
    }).jqGrid('navGrid', '#jqpCalendarHeader', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCalendarHeader', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCalendarHeader
    }).jqGrid('navButtonAdd', '#jqpCalendarHeader', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCalendarHeader
        });
    fnAddGridSerialNoHeading();
}

function fnAddCalendarHeader() {
   
    fnClearFields();
    $('#PopupCalendarHeader').modal('show');
    $('#PopupCalendarHeader').modal({ backdrop: 'static', keyboard: false });
    $('#PopupCalendarHeader').find('.modal-title').text(localization.AddCalendarHeader);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveApplicationCode").html('<i class="fa fa-save"></i> ' + localization.Save);
}

function fnSaveCalendarHeader() {
    
    if (fnValidateCalendarHeader() === false) {
        return;
    }
   
    var obj = {
        CalenderType: $("#cboCalendarType").val(),
        Year: $("#txtyear").val(),
        FromDate: $("#txtCalDefFRMDate").val(),
        TillDate: $("#txtCalDefTillDate").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveCalendarHeader").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Control/InsertCalendarHeader',
        type: 'POST',
        data: JSON.stringify(obj),
        contentType: "application/json",
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                //$("#btnSaveCalendarHeader").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupCalendarHeader').modal('hide');
                fnGridLoadCalendarHeader();
                fnClearFields();
                return true;
            }
            else
            {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveCalendarHeader").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCalendarHeader").attr('disabled', false);
        }
    })
}

function fnValidateCalendarHeader() {
    
    if (IsStringNullorEmpty($("#txtyear").val())) {
        fnAlert("w", "EPS_21_00", "UI0068", errorMsg.Year_E7);
        return false;
    }
    if ($("#cboCalendarType").val() === "0" || $("#cboCalendarType").val() === "" || IsStringNullorEmpty($("#cboCalendarType").val())) {
        fnAlert("w", "EPS_21_00", "UI0214", errorMsg.Calendar_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCalDefFRMDate").val())) {
        fnAlert("w", "EPS_21_00", "UI0069", errorMsg.FromDate_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCalDefTillDate").val())) {
        fnAlert("w", "EPS_21_00", "UI0070", errorMsg.ToDate_E9);
        return false;
    }
}

function fnGridRefreshCalendarHeader() {
    $("#jqgCalendarHeader").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}



function fnClearFields() {
    $('#txtyear').val('');
    $('#txtCalDefFRMDate').val('');
    $('#txtCalDefTillDate').val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCalendarHeader").attr('disabled', false);
    $('#cboCalendarType').val('0').selectpicker('refresh');
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}