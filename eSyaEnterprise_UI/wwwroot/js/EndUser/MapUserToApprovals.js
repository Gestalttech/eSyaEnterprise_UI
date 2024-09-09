var _UserID = "0";
var _FormID = "0";

$(function () {
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

function fnOnChangeBusinessLocation() {
    
    if ($("#cboBusinessKey").val() != "0") {
        fnLoadGridMapUserToApprovals();
        $('#jstApprovalForms').jstree("destroy");
    }
}

function fnLoadGridMapUserToApprovals() {
    $("#jqgMapUserToApprovals").GridUnload();

    $("#jqgMapUserToApprovals").jqGrid({
        url: getBaseURL() + '/Approval/GetApproverUserListbyBusinessKey?BusinessKey=' + $("#cboBusinesskey").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.UserId, localization.LoginDescription,localization.Actions],
        colModel: [
            { name: "UserID", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "LoginDesc", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnMapUserToApprovals"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
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
    GetUserApprovalFormlist(rowData.UserID);
    _UserID = rowData.UserID;
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



function GetUserApprovalFormlist(_ID) {
    $('#jstApprovalForms').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Approval/GetApprovalRequiredFormMenulist?BusinessKey=' + $("#cboBusinesskey").val() + '&UserID=' + _ID,
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
                        fnGetApprovalLevales(parts[1]);
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
function fnGetApprovalLevales(_aplevel) {
    $("#PopupUserFormApproval").modal('show');
    fnLoadGridLevelBasedApproval(_aplevel);
}
function fnLoadGridLevelBasedApproval(_aplevel) {
   
    $("#jqgUserFormApproval").GridUnload();

    $("#jqgUserFormApproval").jqGrid({
        url: getBaseURL() + '/Approval/GetApprovalLevelsbyFormID?businesskey=' + $("#cboBusinesskey").val()
            + '&formId=' + _aplevel,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["LevelId", "Level Description", "Active"],
        colModel: [
            { name: "ApprovalLevel", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ApprovalLevelDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 110, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false }, },
        ],
        pager: "#jqpUserFormApproval",
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
        forceFit: true, caption: localization.LevelBasedApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgUserFormApproval");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');

        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpUserFormApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpUserFormApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshLevelBasedApproval
    });


    fnAddGridSerialNoHeading();
}
function fnGridRefreshLevelBasedApproval() {
    $("#jqgUserFormApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnSaveUserFormApproval() {
    if ($("#cboBusinesskey").val() <= 0) {
        fnAlert("w", "EEU_12_00", "UI0064", errorMsg.SelectBusinessLocation_E4);
        return;
    }
    if (_UserID == "0") {
        fnAlert("w", "EEU_12_00", "UI0064", "Please select User");
        return;
    }
    if (_FormID == 0) {
        fnAlert("w", "EEU_12_00", "UI0064", "Please select Form");
        return;
    }
    if (!validateAtLeastOneCheckboxValues('jqgUserFormApproval')) {
        fnAlert("w", "EEU_12_00", "UI0064", "Please check at least one Approval Level.");
        return;
    }
    var _valuelinks = [];
    var ids = jQuery("#jqgUserFormApproval").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgUserFormApproval').jqGrid('getRowData', rowId);


        _valuelinks.push({
            BusinessKey: $("#cboBusinesskey").val(),
            FormID: _FormID,
            UserID: _UserID,
            ApprovalLevel: rowData.ApprovalLevel,
            ActiveStatus: rowData.ActiveStatus
        });
    }
    $("#btnUserFormApproval").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Approval/InsertOrUpdateUserApprovalForm',
        type: 'POST',
        datatype: 'json',
        data: { obj: _valuelinks },

        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnUserFormApproval").attr('disabled', false);

                $("#PopupUserFormApproval").modal('hide');
                fnGridRefreshLevelBasedApproval();
                //fnLoadFormsTree();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnUserFormApproval").attr('disabled', false);
                return false;
            }

        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveApprovalValues").attr('disabled', false);
        }
    });
}

function validateAtLeastOneCheckboxValues(jqgUserFormApproval) {

    let isChecked = false;
    const rows = $("#" + jqgUserFormApproval).getDataIDs(); // Get all row IDs
    for (let i = 0; i < rows.length; i++) {
        const isRowChecked = $("#" + jqgUserFormApproval).jqGrid('getCell', rows[i], 'ActiveStatus');
        if (isRowChecked == 'true') {
            isChecked = true;
            break;
        }
    }
    return isChecked;
}

