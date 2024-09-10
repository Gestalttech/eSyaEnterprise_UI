$(function () {
    $("#pnlAddForms").hide();
})
function fnOnChangeBusinessLocation() {

    if ($("#cboBusinessKey").val() != "0") {
        GetUserApprovalFormlist();
        $('#jstApprovalForms').jstree("destroy");
    }
}
function GetUserApprovalFormlist() {
    $('#jstApprovalForms').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Approval/GetFormsForApproval?BusinessKey=' + $("#cboBusinesskey").val(),
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

            // Listen for node selection
            $('#jstApprovalForms').on('select_node.jstree', function (e, data) {


                // Get selected node IDs
                var selectedNodeIds = $('#jstApprovalForms').jstree('get_selected');

                selectedNodeIds.forEach(function (nodeId) {
                    if (nodeId.startsWith("FM")) {
                        // Get the value after the '.'
                        var parts = nodeId.split('.');
                        fnLoadGridUserDetailsForApproval(parts[1]);
                        _FormID = parts[1];

                    } else {
                        _FormID = "";
                    }
                });
                //    alert("Selected node IDs: "+ selectedNodeIds);
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




function fnLoadGridUserDetailsForApproval() {
    $("#pnlAddForms").show();
    $("#jqgUserDetailsForApproval").GridUnload();

    $("#jqgUserDetailsForApproval").jqGrid({
        url: getBaseURL() + '/Approval/GetApproverUserListbyBusinessKey',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.UserId, localization.LoginDescription, localization.ApprovalLevelDesc],
        colModel: [
            { name: "UserID", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "LoginDesc", width: 200, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ApprovalLevelDesc", width: 150, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
       ],
        pager: "#jqpUserDetailsForApproval",
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
        forceFit: true, caption: localization.UserDetailsForApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgUserDetailsForApproval");
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpUserDetailsForApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpUserDetailsForApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshUserDetailsForApproval
    });
    fnAddGridSerialNoHeading();
}