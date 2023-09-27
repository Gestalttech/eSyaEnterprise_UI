$(document).ready(function () {
    $("#txtfinancialyear").blur(function () {
        var year = $("#txtfinancialyear").val();
        $("#txtCalDefFRMDate").val(year + '-01-01');
        $("#txtCalDefTillDate").val(year + '-12-31');
    });
    fnGridLoadCalendarDefinition();
});

function fnBusinessLocation_onChange() {

    fnGridLoadCalendarDefinition();
}

$('#txtCalDefFRMDate').change(function () {
    var date = this.valueAsDate;
    date.setDate(date.getDate() + 364);
    $('#txtCalDefTillDate')[0].valueAsDate = date;
});

function fnGridLoadCalendarDefinition() {
    $("#jqgCalendarDefinition").jqGrid('GridUnload');
    $("#jqgCalendarDefinition").jqGrid({
        url: getBaseURL() + '/Control/GetCalendarHeadersbyBusinessKey?Businesskey=' + $("#cboBusinessLocation").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["",localization.FinancialYear, localization.FromDate, localization.TillDate,localization.Active],
        colModel: [
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "FinancialYear", width: 70, editable: true, align: 'left', hidden: false },
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
            { name: "Status", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:'55',
        loadonce: true,
        pager: "#jqpCalendarDefinition",
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
        caption:'Calendar Definition',
        loadComplete: function (data) {
            SetGridControlByAction();
            //fnSetGridWidth("jqpCalendarDefinition");
            fnJqgridSmallScreen("jqgCalendarDefinition");
        },
    }).jqGrid('navGrid', '#jqpCalendarDefinition', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCalendarDefinition', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCalendarDefinition
    }).jqGrid('navButtonAdd', '#jqpCalendarDefinition', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCalendarDefinition
        });
    fnAddGridSerialNoHeading();
}

function fnAddCalendarDefinition() {
    if ($("#cboBusinessLocation").val() === "0" || $("#cboBusinessLocation").val() === "") {
        toastr.warning("Please select a business location");
        return false;
    }
    fnClearFields();
    $('#PopupCalendarDefinition').modal('show');
    $('#PopupCalendarDefinition').modal({ backdrop: 'static', keyboard: false });
    $('#PopupCalendarDefinition').find('.modal-title').text(localization.AddCalendarDefinition);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveApplicationCode").html('<i class="fa fa-save"></i> ' + localization.Save);
}

function fnSaveCalendarDefinition() {
    
    if (fnValidateCalendarDefinition() === false) {
        return;
    }
    var calendarheader = {
        BusinessKey: $("#cboBusinessLocation").val(),
        FinancialYear: $("#txtfinancialyear").val(),
        FromDate: $("#txtCalDefFRMDate").val(),
        TillDate: $("#txtCalDefTillDate").val(),
        Status: $("#chkActiveStatus").parent().hasClass("is-checked")
    }
    $("#btnSaveCalendarDefinition").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Control/InsertCalendarHeaderAndDetails',
        type: 'POST',
        data: JSON.stringify(calendarheader),
        contentType: "application/json",
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveCalendarDefinition").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupCalendarDefinition').modal('hide');
                fnGridLoadCalendarDefinition();
                fnClearFields();
                return true;
            }
            else
            {
                toastr.error(response.Message);
                $("#btnSaveCalendarDefinition").attr('disabled', false);
                return false;
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCalendarDefinition").attr('disabled', false);
        }
    })
}

function fnValidateCalendarDefinition() {
    if ($("#cboBusinessLocation").val() === "0" || $("#cboBusinessLocation").val()==="") {
        toastr.warning("Please Select a Business Location");
        return false;
    }
    if (IsStringNullorEmpty($("#txtfinancialyear").val())) {
        toastr.warning("Please Enter the Financial year");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCalDefFRMDate").val())) {
        toastr.warning("Please Enter the From Date");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCalDefTillDate").val())) {
        toastr.warning("Please Enter the Till Date");
        return false;
    }
}

function fnGridRefreshCalendarDefinition() {
    $("#jqgCalendarDefinition").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnViewCalendarDefinition(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCalendarDefinition').jqGrid('getRowData', rowid);
    $('#PopupCalendarDefinition').modal('show');
    $('#PopupCalendarDefinition').find('.modal-title').text(localization.ViewCalendarDefinition);

}

function fnClearFields() {
    $('#txtfinancialyear').val('');
    $('#txtCalDefFRMDate').val('');
    $('#txtCalDefTillDate').val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCalendarDefinition").attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}