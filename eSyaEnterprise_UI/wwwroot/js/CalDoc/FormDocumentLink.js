﻿var FormID = "0";
var prevSelectedID = '';
function fnLoadFormsTree() {

    $.ajax({
        url: getBaseURL() + '/MapForms/GetFormsForDocumentControl',
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $("#jstFormMaster").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstFormMaster");
            $(window).on('resize', function () {
                fnTreeSize("#jstFormMaster");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstFormMaster").on('loaded.jstree', function () {
        $("#jstFormMaster").jstree()._open_to(prevSelectedID);
        $('#jstFormMaster').jstree().select_node(prevSelectedID);
    });

    $('#jstFormMaster').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstFormMaster").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedFormName").text(data.node.text);
                    FormID = data.node.id;
                    fnLoadDocumentGrid(FormID);
                    $("#dvDocumentControl").css('display', 'block');
                }
                else {
                    $("#dvDocumentControl").css('display', 'none');
                }

            }
        }
    });
    $('#jstFormMaster').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstFormMaster').jstree().deselect_node(closingNode.children);
    });
}

$(function () {
    //fnLoadDocumentGrid();
    fnLoadFormsTree();
})

function fnLoadDocumentGrid(_formID) {

    $("#jqgFormtoDocumentLink").GridUnload();
    $("#jqgFormtoDocumentLink").jqGrid({
        url: getBaseURL() + '/MapForms/GetFormDocumentlink?formID=' + _formID,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.FormID, localization.DocID, localization.DocName, localization.Active],
        colModel: [
            { name: "FormId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "DocumentId", width: 150, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "DocumentName", width: 450, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", width: 50, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        pager: "#jqpFormtoDocumentLink",
        rowNum: 10,
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
        forceFit: true, caption: 'Form Document Link',
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        loadComplete: function (data) {
            //SetGridControlByAction(); 
            fnJqgridSmallScreen("jqpFormtoDocumentLink");

        },


    })
    fnAddGridSerialNoHeading();
}

function fnSaveFormDocumentLink() {

    $("#jqgFormtoDocumentLink").jqGrid('editCell', 0, 0, false);
    var Doc_Links = [];
    var id_list = jQuery("#jqgFormtoDocumentLink").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgFormtoDocumentLink').jqGrid('getRowData', rowId);

        Doc_Links.push({
            FormId: rowData.FormId,
            DocumentId: rowData.DocumentId,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/MapForms/UpdateFormDocumentLinks',
        type: 'POST',
        datatype: 'json',
        data: { obj: Doc_Links },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgFormtoDocumentLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                $("#jstFormMaster").jstree("destroy");
                fnLoadFormsTree();
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

function fnCancel() {
    $("#dvDocumentControl").css('display', 'none');
    $("#jstFormMaster").jstree("deselect_all");
    $('#jstFormMaster').jstree().select_node('FM');
}