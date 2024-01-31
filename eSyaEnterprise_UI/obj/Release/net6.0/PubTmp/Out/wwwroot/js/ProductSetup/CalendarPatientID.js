$(document).ready(function () {
    $('#cboBusinessKey').selectpicker('refresh');
    $('#cboCalenderKey').selectpicker('refresh');
    fnGridLoadCalendarPatientGeneration();
});
function fnBusinessKey_onChange() {

    fnLoadCboCalenderKey();
}
function fnLoadCboCalenderKey() {
    $('#cboCalenderKey').selectpicker('refresh');
    $.ajax({
        url: getBaseURL() + '/License/GetCalenderKeybyBusinessKey?Businesskey=' + $('#cboBusinessKey').val(),
        datatype: 'json',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#cboCalenderKey').empty();
            $("#cboCalenderKey").append($("<option value='0'>All</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboCalenderKey").append($("<option></option>").val(result[i]["CalenderKey"]).html(result[i]["CalenderKey"]));
                }
            }
            $('#cboCalenderKey').val($("#cboCalenderKey option:first").val());
            $('#cboCalenderKey').selectpicker('refresh');
            fnGridLoadCalendarPatientGeneration();
        }
    });
}

function fnGridLoadCalendarPatientGeneration() {
    $("#jqgCalendarPatientGeneration").jqGrid('GridUnload');
    var financialyear = $('#cboCalenderKey').val();
    var businesskey = $('#cboBusinessKey').val();
    $("#jqgCalendarPatientGeneration").jqGrid({
        url: getBaseURL() + '/License/GetCalendarPatientGenerationbyBusinessKeyAndCalenderKey?BusinessKey=' + businesskey + "&CalenderKey=" + financialyear,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "", "", localization.Year, localization.FromDate, localization.TillDate,localization.YearandMonth, localization.MonthDescription, /* localization.BudgetMonth,*/ localization.PatientIDGeneration, localization.PatientIDSerial, "", localization.Active],
        colModel: [
            { name: "CalenderKey", width: 95, editable: true, align: 'left', hidden: true },
            { name: "MonthId", width: 100, editable: true, align: 'left', hidden: true },
            { name: "BusinessKey", width: 100, editable: true, align: 'left', hidden: true },
            { name: "Year", width: 50, editable: false, align: 'left' },
            {
                name: 'Fromdate', index: 'Fromdate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'Tilldate', index: 'Tilldate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "EditMonthId", width: 60, editable: false, align: 'left' },
            { name: "MonthDescription", width: 60, editable: false, align: 'left', },
            
            //{
            //    name: "BudgetMonth", width: 50, editable: true, editoptions: { size: "20", maxlength: "4" }, edittype: "text", editrules: {
            //        custom_func: ValidateBudgetMonth,
            //        custom: true,
            //    }
            //},
            /*{ name: "PatientIdgen", width: 50, editable: false, align: 'left' },*/

            {
                name: "PatientIdgen", width: 50, editable: true, editoptions: { size: "20", maxlength: "6" }, edittype: "text", editrules: {
                    custom_func: ValidatePatientIdGeneration,
                    custom: true,
                }
            },

            { name: "PatientIdserial", width: 50, editable: false, align: 'left', hidden: true },
            //{
            //    name: "PatientIdserial", width: 50, editable: true, editoptions: { size: "20", maxlength: "1" }, edittype: "text", editrules: {
            //        custom_func: ValidatePatientIdserial,
            //        custom: true,
            //    }
            //},
            { name: "ActiveStatus", editable: true, hidden: true, width: 35, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", editable: false, width: 35, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        loadonce: true,
        rowNum: 100000,
        loadonce: true,
        pager: "#jqpCalendarPatientGeneration",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        pgbuttons: null,
        pgtext: null,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0,
        caption: 'Calendar Patient Generation',
        editurl: getBaseURL() + '/License/UpdateCalendarGeneration',
        ajaxRowOptions: {
            type: "POST",
            dataType: "json"
        },
        serializeRowData: function (postData) {
            return (postData);
        },
        beforeSubmit: function (postdata, formid) {
            return [success, message];
            
        },
        ondblClickRow: function (rowid) {
            $("#jqgCalendarPatientGeneration").trigger('click');
        },
        loadComplete: function (data) {
            SetGridControlByAction("jqgCalendarPatientGeneration");
            fnJqgridSmallScreen("jqgCalendarPatientGeneration");
        },
    }).jqGrid('navGrid', '#jqpCalendarPatientGeneration', { add: false, edit: false, search: false, del: false, refresh: false })
    $("#jqgCalendarPatientGeneration").jqGrid('inlineNav', '#jqpCalendarPatientGeneration',
        {
            edit: true,
            editicon: " fa fa-pen",
            edittext: localization.Edit,
            add: false,
            addicon: "fa fa-plus",
            addtext: " Add",
            save: true,
            savetext: localization.Save,
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: localization.Cancel,
            editParams: {
                keys: false,
                url: null,
                successfunc: function (result) {
                    var resp = JSON.parse(result.responseText);
                    if (resp.Status) {
                        fnAlert("s", "", resp.StatusCode, resp.Message);
                        RefreshCalendarDetailsGrid();
                        return true;
                    }
                    else {
                        fnAlert("e", "", resp.StatusCode, resp.Message);
                        RefreshCalendarDetailsGrid();
                        return false;
                    }
                },
                aftersavefun: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: true,
                mtype: "POST",
            },

        });
    $("#jqgCalendarPatientGeneration").jqGrid('setLabel', 'MonthFreezeHis', '', 'text-center');

}

//function ValidateBudgetMonth(value, BudgetMonth) {
//    if (value == "" || value == null) {
//        toastr.warning("Please Enter Budget Month");
//        return [false, "Please Enter Budget Month"];
//    }
//    else {
//        return [true, ""];
//    }

//}

//function ValidatePatientIdserial(value, PatientIdserial) {
//    if (value == "" || value == null) {
//        fnAlert("w", "EPS_26_00", "UI0053", "Please Enter Patient serial Id");
//        return [false, "Please Enter Patient serial Id"];
//    }
//    else {
//        return [true, ""];
//    }

//}
function ValidatePatientIdGeneration(value, PatientIdgen) {
    if (value == "" || value == null || value =="-") {
        fnAlert("w", "EPS_26_00", "UI0239", errorMsg.PatientID_E1);


        return [false, ""];
    }
    else {
        return [true, ""];
    }

}
function RefreshCalendarDetailsGrid() {
    $("#jqgCalendarPatientGeneration").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction(jqg) {
    $('#' + jqg + '_iledit').removeClass('ui-state-disabled');

    if (_userFormRole.IsEdit === false) {
        $('#' + jqg + '_iledit').addClass('ui-state-disabled');
    }

}