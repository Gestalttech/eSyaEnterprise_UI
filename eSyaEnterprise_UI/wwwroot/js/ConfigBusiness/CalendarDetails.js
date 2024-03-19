function fnloadCalendarDetails() {
    fnGridLoadCalendarDetails();

}
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
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-save'></i>" + localization.LinkLocationCalendar + " </span>");

});

function fnGridLoadCalendarDetails() {
    $("#jqgCalendarDetails").jqGrid('GridUnload');
    $("#jqgCalendarDetails").jqGrid({
        url: getBaseURL() + '/BusinessCalendar/GetCalendarHeaders?businesskey=' + $("#cboBusinessKey").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CalenderType,  localization.CalendarKey,"",localization.StartMonth,  localization.YearEndStatus, localization.Alreadylinked, localization.Active, localization.Actions],
        colModel: [
            { name: "CalenderType", width: 30, editable: true, align: 'left', hidden: false },
            { name: "CalenderKey", width: 30, editable: true, align: 'left', hidden: false },
            { name: "StartMonth", width: 30, editable: true, align: 'left', hidden: true }, 
            { name: "StartMonth", editable: true, width: 70, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "1: January;2: February;3: March;4: April;5: May;6: June;7: July;8: Auguest;9: September;10: October;11: November;12: December" } },

            { name: "YearEndStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "Alreadylinked", width: 30, editable: true, align: 'center', hidden: true, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return rowdata.Alreadylinked ? '<i class="fa fa-ban"></i>' : '<button class="mr-1 btn btn-outline btn-sm btnCalendarDetails" style="" id="btnCalendarDetails"><i class="fa fa-ellipsis-v"></i> </button>'
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
        caption: localization.CalendarDetails,
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

    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $("#cboBusinessKey").val() == "0" || $("#cboBusinessKey").val() == '0') {
        fnAlert("w", "ECB_04_00", "UI0053", errorMsg.Loc_E1);
        return;
    }

    var rowid = $("#jqgCalendarDetails").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCalendarDetails').jqGrid('getRowData', rowid);

    obj = {
        BusinessKey: $("#cboBusinessKey").val(),
        CalenderKey: rowData.CalenderKey,
        //FromDate: GetGridDate(rowData.FromDate),
        //TillDate: GetGridDate(rowData.TillDate),
        YearEndStatus: rowData.YearEndStatus,
        ActiveStatus: rowData.ActiveStatus
    };


    $.ajax({
        url: getBaseURL() + '/BusinessCalendar/InsertCalendarDetails',
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
