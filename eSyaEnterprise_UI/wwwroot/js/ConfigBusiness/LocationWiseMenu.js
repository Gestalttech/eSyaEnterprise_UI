﻿$("#jstLocationMenuLinkList").on('loaded.jstree', function () {
    $("#jstLocationMenuLinkList").jstree('open_all');

    fnTreeSize("#jstLocationMenuLinkList");

});
$(document).ready(function () {
    /*fnGetLocationWiseMenuList();*/
});
function fnLoadLocationwiseMenu() {
    fnProcessLoading(true);
    fnGetLocationWiseMenuList();
}
function fnTreeSize() {
    $("#jstLocationMenuLinkList").css({
        'max-height': $(window).height() - 190,
        'overflow': 'auto'
    });
}
function fnGetLocationWiseMenuList() {
    $('#jstLocationMenuLinkList').jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/LocationMenu/GetLocationMenuLinkbyBusinessKey?businesskey=' + $("#cboBusinessKey").val(),
        type: 'GET',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            fnProcessLoading(false);
            $('#jstLocationMenuLinkList').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true, 'expand_selected_onload': false },
                "plugins": ["checkbox"],
                "checkbox": {
                    "keep_selected_style": true
                },

            });
            $("#jstLocationMenuLinkList").on('loaded.jstree', function () {
                $("#jstLocationMenuLinkList").jstree('open_all');

                fnTreeSize("#jstLocationMenuLinkList");

            });
            $("#divActionsforTree").css('display', 'block');
            $(window).on('resize', function () {
                fnTreeSize("#jstLocationMenuLinkList");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function fnSaveLocationwiseMenuLink() {

    if ($('#cboBusinessKey').val() == '' || $('#cboBusinessKey').val() == '0' || $('#cboBusinessKey').val() == 0) {
        fnAlert("w", "ECB_03_00", "UI0064", errorMsg.BusinessLocation_E1);
        $('#cboBusinessKey').focus();
        return;
    }

    var businessKey = $('#cboBusinessKey').val();
    var LocationMenuLink = [];

    var treeUNodes = $('#jstLocationMenuLinkList').jstree(true).get_json('#', { 'flat': true });
    $.each(treeUNodes, function () {
        if (this.id.startsWith("FM") && this.id != "SM" && this.id != "MM") {
            var sbl = {
                BusinessKey: businessKey,
                MenuKey: this.id.split('_')[1],
                ActiveStatus: this.state.selected
            }
            LocationMenuLink.push(sbl);
        }
    });

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/LocationMenu/InsertOrUpdateLocationMenuLink',
        type: 'POST',
        datatype: 'json',
        data: {
            obj: LocationMenuLink
        },
        success: function (response) {
            if (response.Status == true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnGetLocationWiseMenuList();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSave").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSave").attr("disabled", false);
        }
    });
}

function fnExpandAll() {
    $("#jstLocationMenuLinkList").jstree('open_all');
    fnTreeSize("#jstLocationMenuLinkList");
}

function fnCollapseAll() {
    $("#jstLocationMenuLinkList").jstree('close_all');
}


