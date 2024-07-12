$(function () {
    fnProcessLoading(true);
    fnGetUserRoleMenulist();
});
function fnOnChangeUserGroup()
{
    fnProcessLoading(true);
    fnGetUserRoleMenulist();
}
$("#jstUserGroup").on('loaded.jstree', function () {
    $("#jstUserGroup").jstree('open_all');

    fnTreeSize("#jstUserGroup");

});
$(document).ready(function () {
//    fnGetUserRoleMenulist();
});


function fnGetUserRoleMenulist() {
    $('#jstUserGroup').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/UserCreation/GetUserRoleMenulist?UserGroup=' + $("#cboUsergroup").val() + '&UserRole=' + $("#cboUserRole").val() + '&BusinessKey=' + $("#cboBusinesskey").val(),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#jstUserGroup').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": true
                },

            });
            fnProcessLoading(false);
            $("#divUserActionsforTree").css('display', 'block');
            $("#jstUserGroup").on('loaded.jstree', function () {
                $("#jstUserGroup").jstree('open_all');

                fnTreeSize("#jstUserGroup");

            });

            $(window).on('resize', function () {
                fnTreeSize("#jstUserGroup");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function fnSaveRoleMenulist() {
     if ($('#cboBusinesskey').val() == '' || $('#cboBusinesskey').val() == null || $('#cboBusinesskey').val() == '0' || $('#cboBusinesskey').val() == 0) {
        fnAlert("w", "EEU_01_00", "UI0064", errorMsg.BusinessLocation_E1);
        $('#cboBusinesskey').focus();
        return;
    }
    if ($('#cboUsergroup').val() == '' || $('#cboUsergroup').val() == null ||  $('#cboUsergroup').val() == '0' || $('#cboUsergroup').val() == 0) {
        fnAlert("w", "EEU_01_00", "UI0130", errorMsg.UserGroup_E6);
        $('#cboUsergroup').focus();
        return;
    }
    if ($('#cboUserRole').val() == '' || $('#cboUserRole').val() == null || $('#cboUserRole').val() == '0' || $('#cboUserRole').val() == 0) {
        fnAlert("w", "EEU_01_00", "UI0132", errorMsg.UserRole_E7);
        $('#cboUserRole').focus();
        return;
    }

    var businessKey = $('#cboBusinesskey').val();
    var userGroup = $('#cboUsergroup').val();
    var userRole = $('#cboUserRole').val();
    var UserRoleMenuLink = [];

    var treeUNodes = $('#jstUserGroup').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.id.startsWith("FM") && this.id != "SM" && this.id != "MM") {
            var sbl = {
                BusinessKey: businessKey,
                UserGroup: userGroup,
                UserRole: userRole,
                MenuKey: this.id.split('_')[1],
                ActiveStatus: this.state.selected
            }
            UserRoleMenuLink.push(sbl);
        }
    });

    $("#btnSaveRoleMenulist").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/UserCreation/InsertOrUpdateUserRoleBusinessMenuLink',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: UserRoleMenuLink
        },
        success: function (response) {
            if (response.Status == true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveRoleMenulist").attr("disabled", false);
                fnGetUserRoleMenulist();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveRoleMenulist").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveRoleMenulist").attr("disabled", false);
        }
    });
}

function fnExpandAll() {
    $('#jstUserGroup').jstree('open_all');
}

function fnCollapseAll() {
    $('#jstUserGroup').jstree('close_all');
}