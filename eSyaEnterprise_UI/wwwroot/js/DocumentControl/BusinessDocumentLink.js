var ServiceID = "0";
var prevSelectedID = '';
var Editable = false;
$(function () {
    $.contextMenu({
        selector: "#btnBusinessDocument",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditBusinessDocument(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditBusinessDocument(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditBusinessDocument(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");

    fnLoadDocumentsTree();
    
});

function fnLoadDocumentsTree() {
    $('#jstBusinessDocumentLink').jstree({
        'core': {
            'data': [
                 
                { "id": "ajson2", "parent": "#", "text": "Business Location" },
                { "id": "ajson3", "parent": "ajson2", "text": "Bengaluru" },
                { "id": "ajson4", "parent": "ajson2", "text": "Chennai" },
            ]
        }
    });
         
    

    $("#jstBusinessDocumentLink").on('loaded.jstree', function () {
        $("#jstBusinessDocumentLink").jstree()._open_to(prevSelectedID);
        $('#jstBusinessDocumentLink').jstree().select_node(prevSelectedID);
    });

    $('#jstBusinessDocumentLink').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstBusinessDocumentLink").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedDocumentName").text(data.node.text);

                    documentID = data.node.id;
                    fnLoadGridBusinesssDocument(documentID);
                    $("#dvBusinessDocument").css('display', 'block');
                }
                else {
                    $("#dvBusinessDocument").css('display', 'none');
                }

            }
        }
    });
    $('#jstBusinessDocumentLink').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstBusinessDocumentLink').jstree().deselect_node(closingNode.children);
    });
}

function fnLoadGridBusinesssDocument(_BusinessKey) {
    var _dBusinessDocument = [{ FormId: '1', FormName: 'Map Forms', DocumentId: '1', SchemaId: 'GT_PTBtot', ComboId: false, UsageStatus: false, ActiveStatus:'',edit:'' }]
    $("#jqgBusinesssDocumentLink").GridUnload();
    $("#jqgBusinesssDocumentLink").jqGrid({
       // url: getBaseURL() + '/Document/GetDocumentFormlink?BusinessKey=' + _BusinessKey,
        datatype: 'local',
        data: _dBusinessDocument,
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.FormID, localization.FormName, localization.DocID, localization.SchemaId, localization.ComboId, localization.UsageStatus, localization.Active, localization.Actions],
        colModel: [
            { name: "FormId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "FormName", width: 150, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false },
            { name: "DocumentId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "SchemaId", width: 60, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "ComboId", width: 40, editable: true, align: 'left', resizable: false, hidden: false },
            { name: "UsageStatus", width: 40, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 50, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
            {
                name: 'edit', search: false, align: 'left', width: 40, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {

                    return '<button class="mr-1 btn btn-outline" id="btnBusinessDocument"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },

        ],
        pager: "#jqpBusinesssDocumentLink",
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
        caption: localization.BusinesssDocumentLink,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqpBusinesssDocumentLink");
        },
    })
    fnAddGridSerialNoHeading();
}


function fnEditBusinessDocument(e,actiontype) {
    var rowid = $("#jqgBusinesssDocumentLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBusinesssDocumentLink').jqGrid('getRowData', rowid);
    $('#PopupBusinessDocument').find('.modal-title').text(localization.UpdateBusinessDocument);
    $('#PopupBusinessDocument').modal('show');
    fnLoadPopupGridBusinessDocumentLink();
}


function fnSaveBusinesssDocumentLink() {

}



function fnLoadPopupGridBusinessDocumentLink() {
    var _griddata = [{ DocumentId: '11', GeneLogic: 'C', CalendarType: 'FY', IsTransationMode: true, IsStoreCode: true, IsPaymentMode: true, SchemaId: 'GT_GTPTKT', ComboId: 'ididid', DocumentDesc: 'document', ShortDesc: 'Sdesc', DocumentType: 'ddd', UsageStatus: true, ActiveStatus: false },
    { DocumentId: '12', GeneLogic: 'Y', CalendarType: 'CY', IsTransationMode: true, IsStoreCode: true, IsPaymentMode: true, SchemaId: 'GT_GTPDKT', ComboId: 'idiwid', DocumentDesc: 'document1', ShortDesc: 'Sdesc1', DocumentType: 'dddds', UsageStatus: true, ActiveStatus: false }];

    $("#jqgDocContManagement").jqGrid('GridUnload');

    $("#jqgDocContManagement").jqGrid({
        
       // url: getBaseURL() + '/CalendarControl/GetDocumentControlMaster',
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.DocumentId, localization.GenLogic, localization.CalendarType, localization.IsTransationMode, localization.IsStoreCode, localization.IsPaymentMode, localization.SchemaId, localization.ComboId, localization.DocumentDescription, localization.ShortDesc, localization.DocumentType, localization.UsageStatus, localization.Active],
        colModel: [
            { name: "DocumentId",index: "DocumentId", width: 90, editable: false, align: 'left', hidden: false },
            { name: "GeneLogic", index: "GeneLogic", width: 90, editable: false, align: 'left', resizable: false, hidden: false, formatter: 'select', edittype: 'select', editoptions: { value: "C:Continuous;Y:Yearwise;M:Monthwise;D:Datewise" } },
            { name: "CalendarType", index: "CalendarType", width: 90, editable: false, align: 'left', resizable: false, hidden: false, formatter: 'select', edittype: 'select', editoptions: { value: "NA:NotApplicable;FY:FinancialYear;CY:CalendarYear" } },
            { name: "IsTransationMode", index: "IsTransationMode", width: 90, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "IsStoreCode", index: "IsStoreCode", width: 90, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "IsPaymentMode", index: "IsPaymentMode", width: 90, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            { name: "SchemaId", index: "SchemaId", width: 90, editable: false, align: 'left', resizable: false, hidden: false },
            { name: "ComboId", index: "ComboId", width: 90, editable: false, align: 'left', resizable: false, hidden: true },
            { name: "DocumentDesc", index: "DocumentDesc", width: 180, editable: false, align: 'left', resizable: false, hidden: false },
            { name: "ShortDesc", index: "ShortDesc", width: 90, editable: false, align: 'left', resizable: false, hidden: true },
            { name: "DocumentType", index: "DocumentType", width: 85, editable: false, align: 'left', resizable: false, hidden: true },
            { name: "UsageStatus", index: "UsageStatus", width: 85, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus",index: "ActiveStatus", width: 60, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },
             
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpDocContManagement",
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
        caption: localization.DocumentControlManagement,
        loadComplete: function () {
            fnJqgridSmallScreen("jqgDocContManagement");
        },
        onSelectRow: function (rowid, status, e) {
             var ch = $(this).find('#' + rowid + 'td:last-child input[type=checkbox]').prop('checked');
                if (ch) {
                    $(this).find('#' + rowid + 'td:last-child input[type=checkbox]').prop('checked', false);
                } else {
                    $(this).find('#' + rowid + 'td:last-child input[type=checkbox]').prop('checked', true);
                }  
           
            if (rowid) { $('#jqgDocContManagement').jqGrid('editRow', rowid, true); }
        },

    }).jqGrid('navGrid', '#jqpDocContManagement', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDocContManagement', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshDocumentControlGrid
    })
    fnAddGridSerialNoHeading();
}

 
function fnRefreshDocumentControlGrid() {
    $("#jqgDocContManagement").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnClearFields() {
    $("#cboCalendarKey").val('0').selectpicker('refresh');
}