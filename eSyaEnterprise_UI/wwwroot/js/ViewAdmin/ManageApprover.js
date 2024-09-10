$(function () {
    $("#pnlApprovedForms").hide();
})
function fnOnChangeBusinessKey() {

    if ($("#cboBusinessKey").val() != "0") {
        GetApprovedFormslist();
        $('#jstApprovedForms').jstree("destroy");
        $("#pnlApprovedForms").hide();
    }
    else {
        $("#pnlApprovedForms").hide(); $('#jstApprovedForms').jstree("destroy");
    }
}
function GetApprovedFormslist() {
    prevSelectedID = '';
    $("#jstApprovedForms").jstree("destroy");
    $.ajax({
        url: getBaseURL() + '/ViewAdmin/Approver/GetApprovedFormsbyBusinesskey?Businesskey=' + $("#cboBusinessKey").val(),
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $("#jstApprovedForms").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstApprovedForms");
            $(window).on('resize', function () {
                fnTreeSize("#jstApprovedForms");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstApprovedForms").on('loaded.jstree', function () {
        $("#jstApprovedForms").jstree()._open_to(prevSelectedID);
        $('#jstApprovedForms').jstree().select_node(prevSelectedID);
    });

    $('#jstApprovedForms').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstApprovedForms").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedFormName").text(data.node.text);
                    FormID = data.node.id;

                    fnLoadGridGetApproverUsresbyBusinesskey(FormID);
                    
                    $("#pnlApprovedForms").css('display', 'block');
                }
                else {
                    $("#pnlApprovedForms").css('display', 'none');
                }

            }
        }
    });
    $('#jstApprovedForms').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstApprovedForms').jstree().deselect_node(closingNode.children);
    });
}


function fnALExpandAll() {
    GetApprovedFormslist();
    $('#jstApprovedForms').jstree('open_all');
}

function fnALCollapseAll() {
    $("#pnlApprovedForms").hide();
    $('#jstApprovedForms').jstree('close_all');
}




function fnLoadGridGetApproverUsresbyBusinesskey(_formId) {
    $("#pnlApprovedForms").show();
    $("#jqgUserDetailsForApproval").jqGrid('GridUnload');

    $("#jqgUserDetailsForApproval").jqGrid({
        url: getBaseURL() + '/ViewAdmin/Approver/GetApproverUsresbyBusinesskey?Businesskey=' + $("#cboBusinessKey").val() + '&FormID=' + _formId,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.UserId, "", localization.ApproverName, localization.ApproverLevels],
        colModel: [
            { name: "UserID", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "ApprovalLevel", width: 50, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
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
            fnJqgridSmallScreen("jqgUserDetailsForApproval");
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpUserDetailsForApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpUserDetailsForApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshApproverUsresbyBusinesskey
    });
    fnAddGridSerialNoHeading();
}
function fnGridRefreshApproverUsresbyBusinesskey() {
    
    $("#jqgUserDetailsForApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}