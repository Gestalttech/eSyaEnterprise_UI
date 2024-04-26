$(document).ready(function () {

    $("#txtyear").blur(function () {
        var year = $("#txtyear").val();
        $("#txtCalDefFRMDate").val(year + '-01-01');
        $("#txtCalDefTillDate").val(year + '-12-31');
    });
    fnGridLoadCalendarHeader();
});
function fnCalendarType_Onchange()
{
    
    var caltype = $("#cboCalendarType").val();
    var year = $("#txtyear").val();
    if (caltype == "CY" && year != "" && year != null)
    {
        $("#txtCalDefFRMDate").val(year + '-01-01');
        $("#txtCalDefTillDate").val(year + '-12-31');
    }
    if (caltype == "FY" && year != "" && year != null) {
        $("#txtCalDefFRMDate").val(year + '-04-01');
        var myDate = document.getElementById(('txtCalDefFRMDate')).valueAsDate;
        myDate.setFullYear(myDate.getFullYear() + 1, myDate.getMonth() - 1, myDate.getDate() + 30);
        $('#txtCalDefTillDate')[0].valueAsDate = myDate;
    }
}
//$('#txtCalDefFRMDate').change(function () {
//    debugger;
//    var myDate = this.valueAsDate;
//    myDate.setFullYear(myDate.getFullYear() + 1, myDate.getMonth()+1, myDate.getDate()-1);
//    $('#txtCalDefTillDate')[0].valueAsDate = myDate;
//});
$('#txtCalDefFRMDate').change(function () {
   
    var myDate = this.valueAsDate;
    myDate.setFullYear(myDate.getFullYear() + 1, myDate.getMonth() -1 , myDate.getDate() +30);
    $('#txtCalDefTillDate')[0].valueAsDate = myDate;
});



function fnGridLoadCalendarHeader() {
    $("#jqgCalendarHeader").jqGrid('GridUnload');
    $("#jqgCalendarHeader").jqGrid({
        url: getBaseURL() + '/CalendarControl/GetCalendarHeaders',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CalendarType, localization.Year,localization.StartMonth, localization.CalendarKey, localization.FromDate, localization.TillDate, localization.Active],
        colModel: [
           { name: "CalenderType", editable: true, width: 70, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "FY: Financial Year;CY: Calendar Year;NA: Not Applicable" } },

            { name: "Year", width: 70, editable: true, align: 'left', hidden: false },
            
            { name: "StartMonth", editable: true, width: 70, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "1: January;2: February;3: March;4: April;5: May;6: June;7: July;8: Auguest;9: September;10: October;11: November;12: December" } },
            
            { name: "CalenderKey", width: 70, editable: true, align: 'left', hidden: false },
            {
                name: 'FromDate', index: 'FromDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'TillDate', index: 'TillDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
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
        caption: localization.CalendarHeader,
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
        url: getBaseURL() + '/CalendarControl/InsertCalendarHeader',
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
            else {
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
        fnAlert("w", "ECD_01_00", "UI0068", errorMsg.Year_E7);
        return false;
    }
    if ($("#cboCalendarType").val() === "0" || $("#cboCalendarType").val() === "" || IsStringNullorEmpty($("#cboCalendarType").val())) {
        fnAlert("w", "ECD_01_00", "UI0214", errorMsg.Calendar_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCalDefFRMDate").val())) {
        fnAlert("w", "ECD_01_00", "UI0069", errorMsg.FromDate_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCalDefTillDate").val())) {
        fnAlert("w", "ECD_01_00", "UI0070", errorMsg.ToDate_E9);
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