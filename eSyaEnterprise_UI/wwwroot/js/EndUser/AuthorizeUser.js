
$(document).ready(function () {
    fnGridLoadUnlockAuthorizeUser();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUnBlockUser",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnAuthenticateUser(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Authorize + " </span>");
});

function fnGridLoadUnlockAuthorizeUser() {
    $("#jqgAuthorizeUser").jqGrid('GridUnload');
    $("#jqgAuthorizeUser").jqGrid({
        url: getBaseURL() + '/Authorize/GetUnAuthenticatedUsers',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.UserId, localization.loginId, localization.UserDesc, localization.UserGroup, localization.UserRole, localization.EmailId, localization.UnsuccessfulAttempts, localization.LoginAttemptDate, localization.BlockSignIn, localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginDesc", width: 100, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "UserGroup", width: 30, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "UserRole", width: 30, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "EMailId", width: 100, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "UnsuccessfulAttempt", width: 30, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginAttemptDate", width: 30, editable: false, align: 'left', editrules: { required: true } },
            { name: "IsUserAuthenticated", editable: false, width: 25, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", editable: false, width: 25, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 40, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnUnBlockUser"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpAuthorizeUser",
        viewrecords: true,
        rownumWidth: '55',
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
        caption: localization.AuthorizeUser,
        onSelectRow: function (id) {
            if (id) { $('#jqgAuthorizeUser').jqGrid('editRow', id, true); }
        },

        loadComplete: function () {
            fnJqgridSmallScreen("jqgAuthorizeUser");
            fnAddGridSerialNoHeading();
        },
    }).jqGrid('navGrid', '#jqpAuthorizeUser', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAuthorizeUser', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGridAuthorizeUser
    });
}




function fnAuthenticateUser(e, actiontype) {
    var rowid = $("#jqgAuthorizeUser").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgAuthorizeUser').jqGrid('getRowData', rowid);
    fnSaveAuthenticateUser(rowData.UserID, rowData.LoginDesc);
}

function fnSaveAuthenticateUser(userId,userName) {
    if (IsStringNullorEmpty(userId) || userId == '0' || userId == "0") {
        fnAlert("w", "EEU_05_00", "UI0208", error.EnterUserID_E2);
        return false;
    }
    else {

        bootbox.confirm({
            message: "Are you sure you want to authorize this user " + userName + " ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: function (result) {
                if (result) {
                    objblock = {
                        UserID: userId,

                    };

                    $.ajax({
                        async: false,
                        url: getBaseURL() + '/Authorize/AuthenticateUser',
                        type: 'POST',
                        data: {
                            obj: objblock,

                        },
                        datatype: 'json',
                        success: function (response) {
                            if (response.Status) {
                                fnAlert("s", "", response.StatusCode, response.Message);
                                fnRefreshGridAuthorizeUser();
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
            }
            });
    }
}
function fnRefreshGridAuthorizeUser() {
    $("#jqgAuthorizeUser").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}