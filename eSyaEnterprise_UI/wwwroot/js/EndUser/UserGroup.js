
// User Group Menu and User Group Action
var prevSelectedID;
var formID;
var UserGroup;
var UserType;
var UserRole;
var errorMsg = {
    UserGroupEdit_E1: '@Localizer["UI0129"]',
    UserGroupSelect_E2: '@Localizer["UI0130"]',
    UserTypeSelect_E3: '@Localizer["UI0131"]',
    UserRoleSelect_E4: '@Localizer["UI0132"]',
  }
$(document).ready(function () {

    $('#txtSearch').keyup(function () {
        var searchString = $(this).val();
        $('#jstUserGroup').jstree('search', searchString);
    });
    fnGridRefreshFormAction();
    fnFormaction();
    $("#dvForm").hide();

});

$("#PopupMenuLink").on("hidden.bs.modal", function () {
    $("#dvForm").hide();
})

function fnGridRefreshFormAction() {
    $("#jqgFormAction").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

$(window).on('resize', function () {
    $("#PopupMenuLinkbody").css({ 'height': $(document).height() - 148, 'overflow-x': 'hidden' });
})

function fnOnChangeUserGroup() {
    $("#dvForm").hide();
    fnFormaction();
}

function fnOnChangeUserType() {
    $("#dvForm").hide();
    fnFormaction();
}

function fnOnChangeUserRole() {
    $("#dvForm").hide();
    fnFormaction();
}

function fnFormaction() {

    $('#btnSaveFormAction').show();
    $.ajax({
        url: getBaseURL() + '/UserCreation/GetMenulistbyUserGroup?UserGroup=' + $("#cboUsergroup").val() + '&UserType=' + $("#cboUserType").val() + '&UserRole=' + $("#cboUserRole").val(),
        type: 'POST',
        datatype: 'json',
        success: function (result) {

            fnGetUserMenuList_Success(result);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnGetUserMenuList_Success(dataArray) {
    debugger;
    $('#jstUserGroup').jstree('destroy');
    $("#jstUserGroup").jstree({
        core: { 'data': dataArray, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
        "plugins": ["search"],

        "search": {
            "case_sensitive": false,
            "show_only_matches": true,
            "show_only_matches_children": true
        }

    });

    $("#jstUserGroup").on('loaded.jstree', function () {
        $("#jstUserGroup").jstree('open_all');
        $("#jstUserGroup").jstree()._open_to(prevSelectedID);
        $('#jstUserGroup').jstree().select_node(prevSelectedID);
        fnTreeSize("#jstUserGroup");

    });

    $('#jstUserGroup').on("changed.jstree", function (e, data) {
        if (data.node != undefined) {
            //if (prevSelectedID != data.node.id) {
            prevSelectedID = data.node.id;

            if (data.node.id == "0") {
                fnGridRefreshFormAction();
                $("#dvForm").hide();
            }
            else {
                if (data.node.parent == "#") {
                    fnGridRefreshFormAction();
                    $("#dvForm").hide();
                }
                else if (data.node.id.startsWith("FM")) {
                    $("#dvForm").show();

                    formID = 0;
                    formID = data.node.id.substring(2).split(".")[1];
                    $('#UserActionTitle').text(data.node.text);
                    $('.lblFormName').text(data.node.text);

                    if (data.node.id.substring(2).split(".")[2] == "1")
                        $("#chkFormName").parent().addClass("is-checked");
                    else
                        $("#chkFormName").parent().removeClass("is-checked");

                    $("input[type=checkbox]").attr('disabled', false);

                    $("#jqgFormAction").GridUnload();

                    fnUserActionGrid(formID);
                }
                else {
                    fnGridRefreshFormAction();
                    $("#dvForm").hide();
                }
            }
        }
    });

    $('#jstUserGroup').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstUserGroup').jstree().deselect_node(closingNode.children);
    });
    fnTreeSize();
};

function fnUserActionGrid(formID) {

    $("#jqgFormAction").jqGrid('GridUnload');
    $("#jqgFormAction").jqGrid({
        url: getBaseURL() + '/UserCreation/GetFormActionLinkbyUserGroup?UserGroup=' + $("#cboUsergroup").val() + '&UserType=' + $("#cboUserType").val() + '&UserRole=' + $("#cboUserRole").val() + '&MenuKey=' + formID,
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: ["Action ID", localization.Action, localization.Active],
        colModel: [
            { name: 'ActionID', key: true, index: 'ActionId', width: 0, sortable: false, hidden: true },
            { name: 'ActionDesc', index: 'ActionDesc', width: 150, sortable: false, editable: false },
            { name: 'ActiveStatus', index: 'ActiveStatus', width: 75, align: 'center', sortable: false, formatter: 'checkbox', editable: true, edittype: "checkbox", formatoptions: { disabled: false } }
        ],
        caption: "Form Action",
        height: 'auto',
        width: '200',
        rowNum: 15,
        rownumbers: true,
        viewrecords: true,
        gridview: true,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        cellEdit: true,
        loadComplete: function () {
            fnJqgridSmallScreen('jqgFormAction');
        },
    });
}
function fnSaveFormAction() {

    if (IsStringNullorEmpty($("#cboUsergroup").val()) || $("#cboUsergroup").val() === "0" || $("#cboUsergroup").val() === 0) {
        fnAlert("w", "EEU_01_00", "UI0130", errorMsg.UserGroupSelect_E2);
        return;
    }
    if (IsStringNullorEmpty($("#cboUserType").val()) || $("#cboUserType").val() === "0" || $("#cboUserType").val() === 0) {
        fnAlert("w", "EEU_01_00", "UI0131", errorMsg.UserTypeSelect_E3);
        return;
    }
    if (IsStringNullorEmpty($("#cboUserRole").val()) || $("#cboUserRole").val() === "0" || $("#cboUserRole").val() === 0) {
        fnAlert("w", "EEU_01_00", "UI0132", errorMsg.UserRoleSelect_E4);
        return;
    }

    var IsForChecked = $("#chkFormName").parent().hasClass("is-checked");
    var uml = {
        UserGroup: $("#cboUsergroup").val(),
        UserType: $("#cboUserType").val(),
        UserRole: $("#cboUserRole").val(),
        MenuKey: formID,
        ActiveStatus: IsForChecked
    };

    var formAction = [];
    var jqgFormAction = jQuery("#jqgFormAction").jqGrid('getRowData');
    for (var i = 0; i < jqgFormAction.length; ++i) {
        if (parseFloat(jqgFormAction[i]["ActionID"]) > 0) {
            formAction.push({
                ActionID: jqgFormAction[i]["ActionID"],
                Active: jqgFormAction[i]["ActiveStatus"]
            });
        }
    }

    uml.l_formAction = formAction;

    $("#btnSaveFormAction").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/UserCreation/InsertIntoUserGroupMenuAction',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: uml
        },
        async: false,
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveFormAction").attr('disabled', true);
                fnReloadTreeAfterSave();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveFormAction").attr('disabled', false);
            $("#btnSaveFormAction").show();
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveFormAction").attr("disabled", false);
        }
    });
}

function fnReloadTreeAfterSave() {

    UserID = $("#txtUserId").val();

    if (UserGroup <= 0) {
        fnAlert("w", "EEU_01_00", "UI0129", errorMsg.UserGroupEdit_E1);
        return;
    }
    if (UserType <= 0) {
        fnAlert("w", "EEU_01_00", "UI0129", errorMsg.UserGroupEdit_E1);
        return;
    }

    fnGridRefreshFormAction();
    fnFormaction();
}

function fnCancelFormAction() {
    $("#dvForm").hide();
}

function fnTreeSize() {

    $('#jstUserGroup').css({
        'height': $(window).innerHeight() - 215,
        'overflow': 'auto'
    });

}
