
//function fnBusinessLocation_onChange() {

//    fnLoadCboFinancialYear();
//}
//function fnLoadCboFinancialYear() {
//    $('#cbofinancialyear').selectpicker('refresh');
//    $.ajax({
//        //url: getBaseURL() + '',
//        datatype: 'json',
//        type: 'POST',
//        async: false,
//        contentType: 'application/json; charset=utf-8',
//        success: function (result) {
//            $('#cbofinancialyear').empty();
//            $("#cbofinancialyear").append($("<option value='0'>All</option>"));
//            if (result != null) {
//                for (var i = 0; i < result.length; i++) {

//                    $("#cbofinancialyear").append($("<option></option>").val(result[i]["FinancialYear"]).html(result[i]["FinancialYear"]));
//                }
//            }
//            $('#cbofinancialyear').val($("#cbofinancialyear option:first").val());
//            $('#cbofinancialyear').selectpicker('refresh');
//            fnGridLoadCalendarDetails();
//        }
//    });
//}

//function fnGridLoadCalendarDetails() {
//    $("#jqgCalendarDetails").jqGrid('GridUnload');
//    //var financialyear = $('#cbofinancialyear').val();
//    //var businesskey = $('#cboBusinessLocation').val();
//    $("#jqgCalendarDetails").jqGrid({
//        url: getBaseURL() + '/License/GetCalendarHeaders',
//        mtype: 'Post',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
//        colNames: [localization.CalenderType, localization.Year, localization.FromDate, localization.TillDate, localization.YearEndStatus, localization.Active],
//        colModel: [
//            { name: "CalenderType", width: 70, editable: true, align: 'left', hidden: false },

//            { name: "Year", width: 70, editable: true, align: 'left', hidden: false },
//            {
//                name: 'FromDate', editable: false, index: 'FromDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
//                    { newformat: _cnfjqgDateFormat },
//                editable: true, editoptions: {
//                    size: 20,
//                    dataInit: function (el) {

//                        $(el).datepicker({ dateFormat: _cnfDateFormat });
//                    }
//                },
//            },
//            {
//                name: 'TillDate', editable: false, index: 'TillDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
//                    { newformat: _cnfjqgDateFormat },
//                editable: true, editoptions: {
//                    size: 20,
//                    dataInit: function (el) {

//                        $(el).datepicker({ dateFormat: _cnfDateFormat });
//                    }
//                },
//            },
//            { name: "YearEndStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

//            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
//        ],
//        loadonce: true,
//        rowNum: 12,
//        loadonce: true,
//        pager: "#jqpCalendarDetails",
//        viewrecords: true,
//        gridview: true,
//        rownumbers: true,
//        pgbuttons: null,
//        pgtext: null,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//        scrollOffset: 0,
//        caption: 'jqgCalendarDetails',
//        editurl: getBaseURL() + '/License/InsertCalendarDetails?BusinessKey=' +$("#cboBusinessKey").val(),
//        ajaxRowOptions: {
//            type: "POST",
//            dataType: "json"
//        },
//        serializeRowData: function (postData) {
//            debugger;
//            return (postData);
//        },

//        beforeSubmit: function (postdata, formid) {
//            return [success, message];
//        },
//        ondblClickRow: function (rowid) {
//            $("#jqgCalendarDetails").trigger('click');
//        },
//        loadComplete: function (data) {
//            SetGridControlByAction("jqgCalendarDetails");
//            fnJqgridSmallScreen("jqgCalendarDetails");
//        },
//    }).jqGrid('navGrid', '#jqpCalendarDetails', { add: false, edit: false, search: false, del: false, refresh: false })
//    $("#jqgCalendarDetails").jqGrid('inlineNav', '#jqpCalendarDetails',
//        {
//            edit: true,
//            editicon: " fa fa-pen",
//            edittext: localization.Edit,
//            add: false,
//            addicon: "fa fa-plus",
//            addtext: " Add",
//            save: true,
//            savetext: localization.Save,
//            saveicon: "fa fa-save",
//            cancelicon: "fa fa-ban",
//            canceltext: localization.Cancel,
//            editParams: {
//                keys: false,
//                url: null,
//                successfunc: function (result) {
//                    var resp = JSON.parse(result.responseText);
//                    if (resp.Status) {
//                        fnAlert("s", "", response.StatusCode, response.Message);
//                        RefreshCalendarDetailsGrid();
//                        return true;
//                    }
//                    else {
//                        fnAlert("e", "", response.StatusCode, response.Message);
//                        RefreshCalendarDetailsGrid();
//                        return false;
//                    }
//                },
//                aftersavefun: null,
//                errorfun: null,
//                afterrestorefun: null,
//                restoreAfterError: true,
//                mtype: "POST",
//            },

//        });
//    $("#jqgCalendarDetails").jqGrid('setLabel', 'MonthFreezeHis', '', 'text-center');

//}

//function ValidateBudgetMonth(value, BudgetMonth) {
//    if (value == "" || value == null) {
//        fnAlert("w", "EPS_30_00", "UI00214", errorMsg.BudgetMonth_E1);
//        return [false, ""];
//    }
//    else {
//        return [true, ""];
//    }

//}

//function ValidatePatientIdserial(value, PatientIdserial) {
//    if (value == "" || value == null) {
//        fnAlert("w", "EPS_30_00", "UI00215", errorMsg.PatientSerialId_E2);
//        return [false, ""];
//    }
//    else {
//        return [true, ""];
//    }

//}
$(document).ready(function () {
    $('#cboBusinessKey').selectpicker('refresh');
    fnGridLoadCalendarDetails();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnCalendarDetails",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Save, icon: "edit", callback: function (key, opt) { fnSaveCalendarDetails(event, 'edit') } },
           
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-save'></i>" + localization.Save + " </span>");
   
});

function fnGridLoadCalendarDetails() {
    $("#jqgCalendarDetails").jqGrid('GridUnload');
    $("#jqgCalendarDetails").jqGrid({
        url: getBaseURL() + '/License/GetCalendarHeaders',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CalenderType, localization.Year, localization.CalendarKey, localization.FromDate, localization.TillDate, localization.YearEndStatus, localization.Active, localization.Save],
        colModel: [
            { name: "CalenderType", width: 70, editable: true, align: 'left', hidden: false },

            { name: "Year", width: 70, editable: true, align: 'left', hidden: false },
            { name: "CalenderKey", width: 70, editable: true, align: 'left', hidden: false }, 
            {
                name: 'FromDate', index: 'FromDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'TillDate', index: 'TillDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "YearEndStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnCalendarDetails"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        pager: "#jqpCalendarDetails",
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
        caption: 'Calendar Details',
        loadComplete: function (data) {
            SetGridControlByAction();
            //fnSetGridWidth("jqpCalendarHeader");
            fnJqgridSmallScreen("jqgCalendarDetails");
        },
    }).jqGrid('navGrid', '#jqpCalendarDetails', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCalendarDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: RefreshCalendarDetailsGrid
    
    });
    fnAddGridSerialNoHeading();
}

function RefreshCalendarDetailsGrid() {
    $("#jqgCalendarDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveCalendarDetails(edit) {
   
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == "0" || $("#cboBusinessKey").val()=='0') {
        fnAlert("w", "EPS_30_00", "UI0053", errorMsg.Loc_E1);
        return;
    }

    var rowid = $("#jqgCalendarDetails").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCalendarDetails').jqGrid('getRowData', rowid);

    obj = {
        BusinessKey: $("#cboBusinessKey").val(),
        CalenderType: rowData.CalenderType,
        Year: rowData.Year,
        CalenderKey: rowData.CalenderKey,
        FromDate: GetGridDate(rowData.FromDate) ,
        TillDate: GetGridDate(rowData.TillDate) ,
        YearEndStatus: rowData.YearEndStatus,
        ActiveStatus: rowData.ActiveStatus
    };


    $.ajax({
        url: getBaseURL() + '/License/InsertCalendarDetails',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                RefreshCalendarDetailsGrid();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function SetGridControlByAction(jqg) {
    $('#' + jqg + '_iledit').removeClass('ui-state-disabled');

    if (_userFormRole.IsEdit === false) {
        $('#' + jqg + '_iledit').addClass('ui-state-disabled');
    }

}