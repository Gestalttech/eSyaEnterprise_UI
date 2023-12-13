
$(document).ready(function () {
    $('#cboUserID').selectpicker('refresh');
    fnGridUserToUserGroup();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnUserToUserGroup",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Save, icon: "edit", callback: function (key, opt) { fnEditUserToUserGroup(event, 'edit') } },

        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-save'></i>" + localization.Save + " </span>");

});

function fnGridUserToUserGroup() {
    $("#jqgUserToUserGroup").jqGrid('GridUnload');
    $("#jqgUserToUserGroup").jqGrid({
        url: getBaseURL() + '/UserCreation/GetMappedUserGroupByUserID?UserID=' + $("#cboUserID").val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.UserID, localization.BusinessKey, localization.UserGroup, localization.UserRole, localization.Location, localization.UserGroup, localization.UserRole, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Save],
        colModel: [
            { name: "UserID", width: 70, editable: true, align: 'left', hidden: true },

            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "UserGroup", width: 70, editable: true, align: 'left', hidden: true },
            { name: "UserRole", width: 70, editable: true, align: 'left', hidden: true },

            { name: "LocationDesc", width: 70, editable: true, align: 'left', hidden: false },
            { name: "UserGroupDesc", width: 70, editable: true, align: 'left', hidden: false },
            { name: "UserRoleDesc", width: 70, editable: true, align: 'left', hidden: false },

            {
                name: 'EffectiveFrom', index: 'EffectiveFrom', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: 'EffectiveTill', index: 'EffectiveTill', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },

            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline btn-sm" style="" id="btnUserToUserGroup"><i class="fa fa-ellipsis-v"></i> </button>'
                }
            },
        ],
        
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        pager: "#jqpUserToUserGroup",
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
        caption: 'Mapped User To User Group',
        loadComplete: function (data) {
            SetGridControlByAction();
            //fnSetGridWidth("jqpCalendarHeader");
            fnJqgridSmallScreen("jqgUserToUserGroup");
        },
    }).jqGrid('navGrid', '#jqpUserToUserGroup', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpUserToUserGroup', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: RefreshUserToUserGroupGrid

    });
    fnAddGridSerialNoHeading();
}

function RefreshUserToUserGroupGrid() {
    $("#jqgUserToUserGroup").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditUserToUserGroup(e, actiontype) {
    fnCancelUserToUserGroup();
   
    var rowid = $("#jqgUserToUserGroup").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgUserToUserGroup').jqGrid('getRowData', rowid);

    $('#txtLocationID').val(rowData.BusinessKey);
    $('#lblLocation').text(rowData.LocationDesc);
    $('#txtUserGroup').val(rowData.UserGroup);
    $('#lblUserGroup').text(rowData.UserGroupDesc);
    $('#txtUserRole').val(rowData.UserRole);
    $('#lblUserRole').text(rowData.UserRoleDesc);

    if (rowData.EffectiveFrom !== null) {
        setDate($('#txtEffectiveFrom'), fnGetDateFormat(rowData.EffectiveFrom));
    }
    else {
        $('#txtEffectiveFrom').val('');
    }
    //document.getElementById("txtEffectiveFrom").disabled = true;
    if (rowData.EffectiveTill !== null) {
        setDate($('#txtEffectiveTill'), fnGetDateFormat(rowData.EffectiveTill));
    }
    else {
        $('#txtEffectiveTill').val('');
    }
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    $("#PopupMapUserToUserGroup").modal('show');

    GetMappedUserRoleMenulist();
   
    if (IsStringNullorEmpty(rowData.EffectiveTill)) {
        
        document.getElementById("txtEffectiveFrom").disabled = false;
    }
    
    else {
        document.getElementById("txtEffectiveFrom").disabled = true;
    }


    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $("#btnSaveUserToUserGroup").show();
        fnEnableInformationDetail(false);
        $("#chkActiveStatus").attr('disabled', false);
        $("#btnSaveUserToUserGroup").html("<i class='fa fa-sync'></i> " + localization.Save);
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $("#btnSaveUserToUserGroup").hide();
        fnEnableInformationDetail(true);
        $("#chkActiveStatus").attr('disabled', true);
    }
}
function fnEnableInformationDetail(val) {
    $("input,textarea").attr('readonly', val);
}
function fnSaveUserToUserGroup()
{ 
    if (IsStringNullorEmpty($("#cboUserID").val()) || $("#cboUserID").val() == "0" || $("#cboUserID").val() == '0') {
        fnAlert("w", "EEU_04_00", "", "Please select User");
        return;
    }
    if (IsStringNullorEmpty($("#txtLocationID").val())) {
        fnAlert("w", "EEU_04_00", "", "Business Location required");
        return;
    }
    if (IsStringNullorEmpty($("#txtUserGroup").val())) {
        fnAlert("w", "EEU_04_00", "", "User Group required");
        return;
    }
    if (IsStringNullorEmpty($("#txtUserRole").val())) {
        fnAlert("w", "EEU_04_00", "", "User Role required");
        return;
    }
   
    obj = {
        UserID: $("#cboUserID").val(),
        BusinessKey: $("#txtLocationID").val(),
        UserGroup: $("#txtUserGroup").val(),
        UserRole: $("#txtUserRole").val(),
        EffectiveFrom: getDate($("#txtEffectiveFrom")),
        EffectiveTill: getDate($("#txtEffectiveTill")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };


    $.ajax({
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserGroupMappedwithUser',
        type: 'POST',
        datatype: 'json',
        data: { obj },
        success: function (response) {

            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#PopupMapUserToUserGroup").modal('hide');
                RefreshUserToUserGroupGrid();
                fnCancelUserToUserGroup();
                $("#btnSaveUserToUserGroup").attr('disabled', false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnSaveUserToUserGroup").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveUserToUserGroup").attr('disabled', false);
        }
    });
}
function SetGridControlByAction(jqg) {
    $('#' + jqg + '_iledit').removeClass('ui-state-disabled');

    if (_userFormRole.IsEdit === false) {
        $('#' + jqg + '_iledit').addClass('ui-state-disabled');
    }

}

function fnCancelUserToUserGroup() {
    $('#txtLocationID').val('');
    $('#lblLocation').text('');
    $('#txtUserGroup').val('');
    $('#lblUserGroup').text('');
    $('#txtUserRole').val('');
    $('#lblUserRole').text('');
    $('#txtEffectiveFrom').val('');
    $('#txtEffectiveTill').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveUserToUserGroup").attr('disabled', false);
}
/*--------------Treeview*/
$("#jqtMapUserToUserGroup").on('loaded.jstree', function () {
    $("#jqtMapUserToUserGroup").jstree('open_all');

    fnTreeSize("#jqtMapUserToUserGroup");

});

$("#PopupMapUserToUserGroup").on('shown.bs.modal', function () {
    var winH = $(window).height();
    var winW = $(window).width();
    var modalHeaderH = $('.modal-header').outerHeight(true);
    fnProcessLoading(true);
    if ($(window).height() > '500px') {
        $(".modal-body").css({ 'height': (winH - modalHeaderH), 'overflow-y': 'auto', 'overflow-x': 'hidden' });

        $("#divJqtMapUserToUserGroup").css('height', $(".modal-body").height());
    }
});

function fnTreeSize() {
    $("#jqtMapUserToUserGroup").css({
        'height': $('.modal-body').height(),
        'overflow-y': 'auto'
    });
}


function GetMappedUserRoleMenulist() {
    $('#jqtMapUserToUserGroup').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/UserCreation/GetMappedUserRoleMenulist?UserGroup=' + $("#txtUserGroup").val() + '&UserRole=' + $("#txtUserRole").val() + '&BusinessKey=' + $("#txtLocationID").val(),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#jqtMapUserToUserGroup').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                

            });
            fnProcessLoading(false);
            /*$("#divUserActionsforTree").css('display', 'block');*/
            $("#jqtMapUserToUserGroup").on('loaded.jstree', function () {
                $("#jqtMapUserToUserGroup").jstree('open_all');

                fnTreeSize("#jqtMapUserToUserGroup");
                fnProcessLoading(false);
            });

            $(window).on('resize', function () {
                fnTreeSize("#jqtMapUserToUserGroup");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}