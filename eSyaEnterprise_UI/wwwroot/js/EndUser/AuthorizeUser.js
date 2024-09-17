
$(document).ready(function () {
    fnGridLoadUnlockAuthorizeUser();
    $("input[name='rduser']").change(function () {
        //reload dropdownlist
        RadioLoadUserData();
    })
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
function RadioLoadUserData() {
    $("input[name='rduser']").each(function () {
        if ($(this).is(":checked")) {
            fnGridLoadUnlockAuthorizeUser($(this).val());
            
        }
    });
}
function fnGridLoadUnlockAuthorizeUser(_typeofuser) {
    $("#jqgAuthorizeUser").jqGrid('GridUnload');
    $("#jqgAuthorizeUser").jqGrid({
        url: getBaseURL() + '/Authorize/GetUnAuthenticatedUsers?authenticate=' + _typeofuser,
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

        //bootbox.confirm({
        //    message: "Are you sure you want to authorize this user " + userName + " ?",
        //    buttons: {
        //        confirm: {
        //            label: 'Yes',
        //            className: 'btn-success'
        //        },
        //        cancel: {
        //            label: 'No',
        //            className: 'btn-danger'
        //        }
        //    },
        //    callback: function (result) {
        //        if (result) {
        //            objblock = {
        //                UserID: userId,

        //            };

        //            $.ajax({
        //                async: false,
        //                url: getBaseURL() + '/Authorize/AuthenticateUser',
        //                type: 'POST',
        //                data: {
        //                    obj: objblock,

        //                },
        //                datatype: 'json',
        //                success: function (response) {
        //                    if (response.Status) {
        //                        fnAlert("s", "", response.StatusCode, response.Message);
        //                        fnRefreshGridAuthorizeUser();
        //                    }
        //                    else {
        //                        fnAlert("e", "", response.StatusCode, response.Message);
        //                    }
        //                },
        //                error: function (error) {
        //                    fnAlert("e", "", error.StatusCode, error.statusText);
        //                }
        //            });
        //        }
        //    }
        //    });
        $("#PopupAuthorizeUser").modal('show');
    }
}
function fnRefreshGridAuthorizeUser() {
    $("#jqgAuthorizeUser").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
/*--------------Treeview*/
$("#jstAuthorizeUser").on('loaded.jstree', function () {
    $("#jstAuthorizeUser").jstree('open_all');

    fnTreeSize("#jstAuthorizeUser");

});

$("#PopupAuthorizeUser").on('shown.bs.modal', function () {
    var winH = $(window).height();
    var winW = $(window).width();
    var modalHeaderH = $('.modal-header').outerHeight(true);
    fnProcessLoading(true);
    if ($(window).height() > '500px') {
        $(".modal-body").css({ 'height': (winH - modalHeaderH), 'overflow-y': 'auto', 'overflow-x': 'hidden' });

        $("#divjstAuthorizeUser").css('height', $(".modal-body").height());
    }
});

function GetMappedUserRoleMenulist() {
    $('#jstAuthorizeUser').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/Authorize/GetMappedUserRoleMenulist?UserGroup=' + $("#txtUserGroup").val() + '&UserRole=' + $("#txtUserRole").val() + '&BusinessKey=' + $("#txtLocationID").val(),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#jstAuthorizeUser').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },


            });
            fnProcessLoading(false);
            /*$("#divUserActionsforTree").css('display', 'block');*/
            $("#jstAuthorizeUser").on('loaded.jstree', function () {
                $("#jstAuthorizeUser").jstree('open_all');

                fnTreeSize("#jstAuthorizeUser");
                fnProcessLoading(false);
            });
            $('#jstAuthorizeUser').on('select_node.jstree', function (e, data) {


                // Get selected node IDs
                var selectedNodeIds = $('#jstAuthorizeUser').jstree('get_selected');

                selectedNodeIds.forEach(function (nodeId) {
                    if (nodeId.startsWith("FM")) {
                        // Get the value after the '.'
                        var parts = nodeId.split('.');
                        fnLoadGridUserActions(parts[1]);
                        _FormID = parts[1];

                    } else {
                        _FormID = "";
                    }
                });
                //    alert("Selected node IDs: "+ selectedNodeIds);
            });
            $(window).on('resize', function () {
                fnTreeSize("#jstAuthorizeUser");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function fnLoadGridUserActions(_formID) {

    $("#jqgUserActions").GridUnload();

    $("#jqgUserActions").jqGrid({
        url: getBaseURL() + '/Authorize/GetAllActions?formId=' + _formID,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ActionId, localization.ActionDesc, localization.DisplaySequence, localization.Active],
        colModel: [
            { name: "ActionId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ActionDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "DisplaySequence", width: 80, align: 'left', editable: true, editoptions: { maxlength: 150 }, hidden: false, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
          ],

        pager: "#jqpUserActions",
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
        forceFit: true, caption: localization.UserActions,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgActions");
        },
        onSelectRow: function (rowid, status, e) {
             
        },
    }).jqGrid('navGrid', '#jqpUserActions', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpUserActions', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshActions
    }).jqGrid('navButtonAdd', '#jqpUserActions', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddActions
    });

    $(window).on("resize", function () {
        var $grid = $("#jqgUserActions"),
            newWidth = $grid.closest(".Activitiescontainer").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    fnAddGridSerialNoHeading();
}