
$(document).ready(function () {
   fnGridLoadUnlockBlockedUser();
});
var data_up = [{ UserId: 100, UserDesc: 'Arun kumar', EmailId: 'arunkumar.ar@gmail.com', IsUserAuthorised: true, SelectPhoto: '', ActiveStatus: true, edit: '' }];
function fnGridLoadUnlockBlockedUser() {
    $("#jqgUnlockBlockedUser").jqGrid('GridUnload');
    $("#jqgUnlockBlockedUser").jqGrid({
        //url: getBaseURL() +,
        datatype: 'local',
        data: data_up,
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.UserId, localization.UserDesc, localization.EmailId, localization.UnsuccessfulAttempts, localization.LoginAttemptDate, localization.UnBlock],
        colModel: [
            { name: "UserId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "UserDesc", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "EmailId", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "UnsuccessfulAttempts", width: 55, editable: false, editoptions: { disabled: true }, align: 'left'},
            {name:  "LoginAttemptDate", width: 50, editable: false, align: 'left', editrules: { required: true }},
            { name: "UnBlock", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpUnlockBlockedUser",
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
        cellEdit: true,
        cellsubmit: 'clientArray',
        onSelectRow: function (id) {
            if (id) { $('#jqgUnlockBlockedUser').jqGrid('editRow', id, true); }
        },
        caption: 'User Role Action Link',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgUnlockBlockedUser");
        },
    }).jqGrid('navGrid', '#jqpUnlockBlockedUser', { add: false, edit: false, search: false, del: false, refresh: false });
}




function fnEditUnlockBlockedUser(e, actiontype) {
    var rowid = $("#jqgUnlockBlockedUser").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUnlockBlockedUser').jqGrid('getRowData', rowid);
    var _selectedRow = $("#" + rowid).offset();
    var firstRow = $("tr.ui-widget-content:first").offset();
    $(".ui-jqgrid-bdiv").animate({ scrollTop: _selectedRow.top - firstRow.top }, 700);
   
}


function fnRefreshGridUnlockBlockedUser() {
    $("#jqgUnlockBlockedUser").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}