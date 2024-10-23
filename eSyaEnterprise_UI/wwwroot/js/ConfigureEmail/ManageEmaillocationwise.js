$(function () {
//    fnLoadFormsTree();
});
var prevSelectedID = "";
var FormID = "";
function fnLoadFormsTree() {
    $("#pnlLinkedEmail").css('display', 'none');

    $('#jstManageEmailLocation').jstree('destroy');

    $.ajax({
        
        url: getBaseURL() + '/Engine/GetFormForEmaillinking?businesskey=' + $("#cboBusinessLocation").val(),
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {
            $("#jstManageEmailLocation").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstManageEmailLocation");
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstManageEmailLocation").on('loaded.jstree', function () {
        $("#jstManageEmailLocation").jstree()._open_to(prevSelectedID);
        $('#jstManageEmailLocation').jstree().select_node(prevSelectedID);
    });

    $('#jstManageEmailLocation').on("changed.jstree", function (e, data) {
        FormID = "";
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstManageEmailLocation").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedFormName").text(data.node.text);
                    FormID = data.node.id;
                    fnGridLoadEmailLocationWise(FormID);
                    $("#pnlLinkedEmail").css('display', 'block');
                }
                else {
                    $("#pnlLinkedEmail").css('display', 'none');
                }

            }
        }
    });
    $('#jstManageEmailLocation').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstManageEmailLocation').jstree().deselect_node(closingNode.children);
    });
}
function fnGridLoadEmailLocationWise(_FormID) {
    $("#jqgEmailLocationWise").jqGrid('GridUnload');
    $("#jqgEmailLocationWise").jqGrid({
        url: getBaseURL() + '/Engine/GetEmailInformationFormLocationWise?formId=' + _FormID + '&businessKey=' + $("#cboBusinessLocation").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.EmailTempid, localization.EmailDescription, localization.FormId, localization.Active],
        colModel: [
            { name: "EmailTempid", width: 70, editable: true, align: 'left' },
            { name: "EmailTempDesc", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "FormId", width: 45, editable: true, align: 'center', hidden: true, resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "ActiveStatus", editable: true, width: 48, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
            ],
        pager: "#jqpEmailLocationWise",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: '55',
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: localization.EmailLocationWise,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnAddGridSerialNoHeading();
            //fnJqgridSmallScreen("jqgEmailLocationWise");

        },

    }).jqGrid('navGrid', '#jqpEmailLocationWise', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpEmailLocationWise', {
        caption: '<span class="fa fa-sync btn-pager"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGridEmailLocationWise
    })
    fnAddGridSerialNoHeading();
    $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
}

function fnSaveLinkedEmail() {
    debugger;
    if ($("#cboBusinessLocation").val().trim().length <= 0) {
        fnAlert("w", "ESE_04_00", "UI0064", errorMsg.SelectBusinessLocation_E5);
        return;
    }
    if (IsStringNullorEmpty(FormID)) {

        fnAlert("w", "ESE_04_00", "UI0102", "Please select form");
        return;
    }

    $("#jqgEmailLocationWise").jqGrid('editCell', 0, 0, false);
    var s_LW = [];
    var ids = jQuery("#jqgEmailLocationWise").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgEmailLocationWise').jqGrid('getRowData', rowId);

        s_LW.push({
            BusinessKey: $("#cboBusinessLocation").val(),
            EmailTempid: rowData.EmailTempid,
            FormId: FormID, 
           ActiveStatus: rowData.ActiveStatus
        });
    }
   
    $("#btnAddLinkedEmail").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Engine/InsertOrUpdateEmailInformationFLW',
        type: 'POST',
        datatype: 'json',
        data: { l_obj: s_LW },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnAddLinkedEmail").attr('disabled', false);
                fnRefreshGridEmailLocationWise();
                $('#btnAddLinkedEmail').modal('hide');
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnAddLinkedEmail").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnAddLinkedEmail").attr("disabled", false);
        }
    });
}

$("#btnCancelLinkedEmail").click(function () {
    fnRefreshGridEmailLocationWise()
    $("#jqgEmailLocationWise").jqGrid('resetSelection');
    $("#pnlLinkedEmail").css('display', 'none');
});
 
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
function fnRefreshGridEmailLocationWise() {
    $("#jqgEmailLocationWise").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnExpandAllEmailLocWise() {
    $("#jstManageEmailLocation").jstree('open_all');
    fnTreeSize("#jstManageEmailLocation");
}

function fnCollapseAllEmailLocWise() {
    $("#jstManageEmailLocation").jstree('close_all');
}

