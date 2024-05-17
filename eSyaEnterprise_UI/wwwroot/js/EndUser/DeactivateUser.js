
$(document).ready(function () {
    fnGridLoadDeactivateUser();
    $.contextMenu({
        selector: "#btnDeactivateUser",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnUnBlockUser(event) } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Deactivate + " </span>");
});
var data_up = [{ UserID: 100, LoginID: 11, LoginDesc: 'Arun kumar', EMailId: 'arunkumar.ar@gmail.com', UnsuccessfulAttempt: '1', LoginAttemptDate: '80', BlockSignIn: true,  ActiveStatus: true, edit: '' }];
function fnGridLoadDeactivateUser() {
    $("#jqgDeactivateUser").jqGrid('GridUnload');
    $("#jqgDeactivateUser").jqGrid({
        url: getBaseURL() + '/Deactivate/GetBlockedUsers',
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.UserId, localization.loginId, localization.UserDesc, localization.EmailId, localization.UnsuccessfulAttempts, localization.LoginAttemptDate, localization.BlockSignIn, localization.Active, localization.Actions],
        colModel: [
            { name: "UserID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginID", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "LoginDesc", width: 100, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "EMailId", width: 100, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "UnsuccessfulAttempt", width: 30, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "LoginAttemptDate", width: 30, editable: false, align: 'left', editrules: { required: true } },
            { name: "BlockSignIn", editable: false, width: 25, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", editable: false, width: 25, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 40, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDeactivateUser"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpDeactivateUser",
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
        caption: localization.DeactivateUser,
        onSelectRow: function (id) {
            if (id) { $('#jqgDeactivateUser').jqGrid('editRow', id, true); }
        },
        loadComplete: function () {
            fnJqgridSmallScreen("jqgDeactivateUser");
            fnAddGridSerialNoHeading();
        },
    }).jqGrid('navGrid', '#jqpDeactivateUser', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDeactivateUser', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGridDeactivateUser
    });
}


function fnUnBlockUser(e, actiontype) {
    var rowid = $("#jqgDeactivateUser").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDeactivateUser').jqGrid('getRowData', rowid);
    fnSaveUnBlockUser(rowData.UserID, rowData.LoginDesc);
}

function fnSaveUnBlockUser(userId, userName) {
    if (IsStringNullorEmpty(userId) || userId == '0' || userId == "0") {
        fnAlert("w", "EEU_11_00", "UI0208", error.EnterUserID_E2);
        return false;
    }
    else {
        
        bootbox.confirm({
            message: "Are you sure you want to deactivate this user " + userName + " ?",
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
                    $("#PopupDeactivateReason").modal('show');
                }
            }
        });
    }
    
    
}

function fnSaveDeactivateUser(objblock) {
    if ($("#txtReasonForDeactivate").val() == "" || $("#txtReasonForDeactivate").val() == null || $("#txtReasonForDeactivate").val() == undefined) {
        fnAlert("w", "EEU_11_00", "UI0135", errorMsg.Deactivate_E3);
        return false
    }
    else {
        var objblock = {
            UserID: userId,
            Reason: $("#txtReasonForDeactivate").val()
        };

        $.ajax({
            async: false,
            url: getBaseURL() + '/Deactivate/UpdateBlockSignIn',
            type: 'POST',
            data: {
                obj: objblock,

            },
            datatype: 'json',
            success: function (response) {
                if (response.Status) {
                    fnAlert("s", "", response.StatusCode, response.Message);
                    fnRefreshGridDeactivateUser();
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
function fnRefreshGridDeactivateUser() {
    $("#jqgDeactivateUser").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}