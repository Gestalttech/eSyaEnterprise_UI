
$(document).ready(function () {
    fnGridLoadUnlockBlockedUser();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUnBlockUser",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnUnBlockUser(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.UnBlock + " </span>");
});
var data_up = [{ UserId: 100, UserDesc: 'Arun kumar', EmailId: 'arunkumar.ar@gmail.com', IsUserAuthorised: true, SelectPhoto: '', ActiveStatus: true, edit: '' }];
function fnGridLoadUnlockBlockedUser() {
    $("#jqgUnlockBlockedUser").jqGrid('GridUnload');
    $("#jqgUnlockBlockedUser").jqGrid({
        url: getBaseURL() +'/Block/GetBlockedUsers',
        datatype: 'json',
        data: data_up,
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.UserId, "", localization.UserDesc, localization.EmailId, localization.UnsuccessfulAttempts, localization.LoginAttemptDate, localization.BlockStatus, localization.Active, localization.Active],
        colModel: [
            { name: "UserID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginDesc", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "EMailId", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "UnsuccessfulAttempt", width: 55, editable: false, editoptions: { disabled: true }, align: 'left'},
            { name:  "LoginAttemptDate", width: 50, editable: false, align: 'left', editrules: { required: true }},
            { name: "BlockSignIn", editable: false, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUnBlockUser"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
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
        caption: localization.UnlockBlockedUser,
        loadComplete: function () {
            fnJqgridSmallScreen("jqgUnlockBlockedUser");
        },
    }).jqGrid('navGrid', '#jqpUnlockBlockedUser', { add: false, edit: false, search: false, del: false, refresh: false });
}




function fnUnBlockUser(e, actiontype) {
    var rowid = $("#jqgUnlockBlockedUser").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUnlockBlockedUser').jqGrid('getRowData', rowid); 
    debugger;
    fnSaveUnBlockUser(rowData.UserID);
}

function fnSaveUnBlockUser(userId) {
    if (IsStringNullorEmpty(userId) || userId == '0' || userId == "0") {
        fnAlert("w", "EEU_09_00", "", "User ID is required");
        return false;
    }
    objblock = {
        UserID: userId,
        
    };
    $.ajax({
        async: false,
        url: getBaseURL() + '/Block/UpdateBlockSignIn',
        type: 'POST',
        data: {
            obj: objblock,
            
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshGridUnlockBlockedUser();
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
function fnRefreshGridUnlockBlockedUser() {
    $("#jqgUnlockBlockedUser").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}