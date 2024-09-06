$(function () {
    fnLoadGridMapUserToApprovals();
    $.contextMenu({
        selector: "#btnMapUserToApprovals",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditMapUserToApprovals('edit') } },
            /*jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditMapUserToApprovals('view') } }*/
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Select + " </span>");
    /*$(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");*/
});

function fnBusinessKey_OnChange() {
    //fnLoadGridMapUserToApprovals();
}

function fnLoadGridMapUserToApprovals() {
    $("#jqgMapUserToApprovals").GridUnload();

    $("#jqgMapUserToApprovals").jqGrid({
        //url: getBaseURL() + '/Approval/GetApproverUserListByBusinesskey?businesskey=' + $("#cboBusinessKey").val(),
        url: '',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.UserId, localization.LoginDescription, localization.Active],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "UserId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "UserDesc", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        pager: "#jqpMapUserToApprovals",
        rowNum: 10,
        sortable: false,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        scroll: false,
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true, caption: localization.MapUserToApprovals,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgMapUserToApprovals");
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpMapUserToApprovals', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpMapUserToApprovals', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshMapUserToApprovals
    });
    fnAddGridSerialNoHeading();
}

function fnEditMapUserToApprovals() {
    var rowid = $("#jqgMapUserToApprovals").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMapUserToApprovals').jqGrid('getRowData', rowid);
    GetMappedUserRoleMenulist();
}
function fnGridRefreshMapUserToApprovals() {
    $("#jqgMapUserToApprovals").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}



function GetMappedUserRoleMenulist() {
    $('#jstApprovalForms').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/UserCreation/GetMappedUserRoleMenulist?UserGroup=' + $("#txtUserGroup").val() + '&UserRole=' + $("#txtUserRole").val() + '&BusinessKey=' + $("#txtLocationID").val(),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#jstApprovalForms').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },


            });
            fnProcessLoading(false);
            /*$("#divUserActionsforTree").css('display', 'block');*/
            $("#jstApprovalForms").on('loaded.jstree', function () {
                $("#jstApprovalForms").jstree('open_all');

                fnTreeSize("#jstApprovalForms");
                fnProcessLoading(false);
            });

            $(window).on('resize', function () {
                fnTreeSize("#jstApprovalForms");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}