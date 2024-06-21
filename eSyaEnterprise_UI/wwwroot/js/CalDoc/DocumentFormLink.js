var documentID = "0";
var prevSelectedID = '';
function fnLoadDocumentsTree() {

    $.ajax({
        url: getBaseURL() + '/MapForms/GetActiveDocumentControls',
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $("#jstDocumentMaster").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstDocumentMaster");
            $(window).on('resize', function () {
                fnTreeSize("#jstDocumentMaster");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstDocumentMaster").on('loaded.jstree', function () {
        $("#jstDocumentMaster").jstree()._open_to(prevSelectedID);
        $('#jstDocumentMaster').jstree().select_node(prevSelectedID);
    });

    $('#jstDocumentMaster').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstDocumentMaster").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedDocumentName").text(data.node.text);

                    documentID = data.node.id;
                    fnLoadDocumentGrid(documentID);
                    $("#dvFormControl").css('display', 'block');
                }
                else {
                    $("#dvFormControl").css('display', 'none');
                }

            }
        }
    });
    $('#jstDocumentMaster').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstDocumentMaster').jstree().deselect_node(closingNode.children);
    });
}

$(function () {
    //fnLoadDocumentGrid();
    fnLoadDocumentsTree();
})

function fnLoadDocumentGrid(_documentID) {

    $("#jqgDocumentFormLink").GridUnload();
    $("#jqgDocumentFormLink").jqGrid({
        url: getBaseURL() + '/MapForms/GetDocumentFormlink?documentID=' + _documentID,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.DocID, localization.FormID, localization.FormName, localization.Active],
        colModel: [
            { name: "DocumentId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "FormId", width: 150, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "FormName", width: 450, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false },
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
        forceFit: true,
        caption: localization.FormDocumentLink,
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

function fnSaveDocumentFormLink() {

    $("#jqgDocumentFormLink").jqGrid('editCell', 0, 0, false);
    var Doc_Links = [];
    var id_list = jQuery("#jqgDocumentFormLink").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgDocumentFormLink').jqGrid('getRowData', rowId);

        Doc_Links.push({
            FormId: rowData.FormId,
            DocumentId: rowData.DocumentId,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/MapForms/UpdateDocumentFormlink',
        type: 'POST',
        datatype: 'json',
        data: { obj: Doc_Links },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgDocumentFormLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                $("#jstDocumentMaster").jstree("destroy");
                fnLoadDocumentsTree();
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
    $("#dvFormControl").css('display', 'none');
    $("#jstDocumentMaster").jstree("deselect_all");
    $('#jstDocumentMaster').jstree().select_node('FM');

}