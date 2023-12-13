var ISDCode = 0;

$(document).ready(function () {
    fnGridLoadUserRoleActionLink();
});

function fnUserRoleChange() {
    fnGridLoadUserRoleActionLink();
}

function fnGridLoadUserRoleActionLink() {
    $("#jqgUserRoleActionLink").jqGrid('GridUnload');
    $("#jqgUserRoleActionLink").jqGrid({
        url: getBaseURL() + '/UserCreation/GetUserRoleActionLink?userRole=' + $("#cboUserRole").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["ActionId", localization.ActionDesc, localization.Active],
        colModel: [
            { name: "ActionId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "ActionDesc", width: 150, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "ActiveStatus", editable: true, width: 30, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpUserRoleActionLink",
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
            if (id) { $('#jqgUserRoleActionLink').jqGrid('editRow', id, true); }
        },
        caption: 'User Role Action Link',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgUserRoleActionLink");
        },
    }).jqGrid('navGrid', '#jqpUserRoleActionLink', { add: false, edit: false, search: false, del: false, refresh: false });
}

$(document).on('focusout', '[role="gridcell"] *', function () {
    $("#jqgUserRoleActionLink").jqGrid('editCell', 0, 0, false);

});

function fnSaveUserRoleActionLink() {
    if (IsStringNullorEmpty($("#cboUserRole").val()) || $("#cboUserRole").val() === 0 || $("#cboUserRole").val() === '0') {

        fnAlert("w", "EPS_26_00", "UI0202", errorMsg.SelectUserRole_E1);
        return;
    }
    var obj = [];
    var gvT = $('#jqgUserRoleActionLink').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {

        var objact = {
            UserRole: $('#cboUserRole').val(),
            ActionId: gvT[i]['ActionId'],
            ActiveStatus: gvT[i]['ActiveStatus']
        }
        obj.push(objact);

    }
    $("#btnSaveUserRoleActionLink").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserRoleActionLink',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefresh();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUserRoleActionLink").attr("disabled", false);
        }
    });

    $("#btnSaveUserRoleActionLink").attr("disabled", false);
}

function fnGridRefresh() {
    $("#jqgUserRoleActionLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearUserRoleActionLink() {

    fnGridRefresh();
}

