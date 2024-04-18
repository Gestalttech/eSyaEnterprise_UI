var ServiceID = "0";
var prevSelectedID = '';
var Editable = false;
var businesskey = '0';
$(function () {
    $.contextMenu({
        selector: "#btnBusinessDocument",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.MapDocument, icon: "edit", callback: function (key, opt) { fnEditBusinessDocument(event, 'edit') } },
          //  jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditBusinessDocument(event, 'view') } },
           // jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditBusinessDocument(event, 'delete') } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.MapDocument + " </span>");
   // $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
   // $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
   
});


function fnCalendarKey_onchange() {
    
    var _calendarKey = $("#cboCalendarKey").val();
    if (_calendarKey == "0") {
        $('#jstBusinessDocumentLink').css('display', 'none');
        $('#dvBusinessDocument').css('display', 'none');
        fnLoadDocumentsTree(_calendarKey);
    }
    else {
        $('#dvBusinessDocument').css('display', 'none');
        fnLoadDocumentsTree(_calendarKey);
    }
    
}
function fnLoadDocumentsTree(_calendarKey) {
    $("#jstBusinessDocumentLink").jstree('destroy');
         
    $.ajax({
        url: getBaseURL() + '/Document/GetBusinessLocationbyCalendarkeys?calendarkey='+_calendarKey,
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstBusinessDocumentLink").jstree('destroy');
            $("#jstBusinessDocumentLink").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstBusinessDocumentLink");
            $('#jstBusinessDocumentLink').css('display', 'block');
           
            $(window).on('resize', function () {
                fnTreeSize("#jstBusinessDocumentLink");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#dvBusinessDocument").css('display', 'none');
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

                    businesskey = data.node.id;
                    fnLoadGridBusinesssDocument(businesskey);
                    $("#dvBusinessDocument").css('display', 'block');
                    fnRefreshGridBusinessDocumentLink();
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

function fnLoadGridBusinesssDocument(businesskey) {
   
    $("#jqgBusinesssDocumentLink").GridUnload();
    $("#jqgBusinesssDocumentLink").jqGrid({
        url: getBaseURL() + '/Document/GetDocumentFormlinkwithLocation?calendarkey=' + $("#cboCalendarKey").val() + '&businesskey=' + businesskey,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.FormID, localization.BusinessKey, localization.CalendarKey, localization.FormName, localization.DocumentName ,localization.DocID, localization.SchemaId, localization.ComboId, localization.InUse, localization.Active, localization.Actions],
        colModel: [
            { name: "FormId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "BusinessKey", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "CalendarKey", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "FormName", width: 150, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false },
            { name: "DocumentName", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "DocumentId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "SchemaId", width: 60, editable: false, align: 'left', resizable: false, hidden: false },
            { name: "ComboId", width: 40, editable: false, align: 'left', resizable: false, hidden: false },
            { name: "UsageStatus", width: 40, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 50, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
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
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width','100%');
        },
        onSelectRow: function (rowid, status, e) {

        },
    })
    fnAddGridSerialNoHeading();
}


function fnEditBusinessDocument(e,actiontype) {
    var rowid = $("#jqgBusinesssDocumentLink").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgBusinesssDocumentLink').jqGrid('getRowData', rowid);
    $('#PopupBusinessDocument').find('.modal-title').text(localization.UpdateBusinessDocument);
    $('#PopupBusinessDocument').modal('show');
    fnLoadPopupGridBusinessDocumentLink(rowData.FormId);
    $("#btnSaveBusinessDocument").html("<i class='fa fa-sync'></i>" + localization.Update);
}

function fnRefreshGridBusinessDocumentLink()
{ 
 $("#jqgBusinesssDocumentLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
function fnSaveBusinessDocument() {
    

    if (IsStringNullorEmpty(businesskey) || businesskey == '0') {

        fnAlert("w", "EAD_02_00", "UI0179", "Please select Location");
        return;
    }
    if (IsStringNullorEmpty($("#cboCalendarKey").val()) || $("#cboCalendarKey").val() === 0 || $("#cboCalendarKey").val() === "0") {
        fnAlert("w", "EAD_02_00", "UI0178", "Please select Calendar Key");
        return;
    }

    var $grid = $("#jqgDocContManagement");
    var r_doc = [];
    var ids = jQuery("#jqgDocContManagement").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgDocContManagement').jqGrid('getRowData', rowId);

        r_doc.push({
            BusinessKey: businesskey,
            CalendarKey: $("#cboCalendarKey").val(),
            ComboId: rowData.ComboId,
            FormId: rowData.FormId,
            DocumentId: rowData.DocumentId,
            SchemaId: rowData.SchemaId,
            UsageStatus: rowData.UsageStatus,
            //FreezeStatus: rowData.FreezeStatus,
            ActiveStatus: rowData.ActiveStatus

        });

    }
  
    if (r_doc.length <= 0) {
        fnAlert("w", "EAD_02_00", "UI0179", "Please select any Document control");
        return;
    }


    $("#btnSaveBusinessDocument").attr('disabled', true);
  
    $("#btnSaveBusinessDocument").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Document/InsertOrUpdateBusinesswiseDocumentControl',
        type: 'POST',
        datatype: 'json',
        data: { obj: r_doc },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveBusinessDocument").attr('disabled', false);
                fnRefreshGridBusinessDocumentLink();
                $('#PopupBusinessDocument').modal('hide');
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnSaveBusinessDocument").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveBusinessDocument").attr("disabled", false);
        }
    });
}



function fnLoadPopupGridBusinessDocumentLink(formId)
{

    $("#jqgDocContManagement").jqGrid('GridUnload');

    $("#jqgDocContManagement").jqGrid({
        
        url: getBaseURL() + '/Document/GetDocumentControlMaster?formId=' + formId,
        mtype: 'GET',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.FormID,localization.DocumentId, localization.GenLogic, localization.CalendarType, localization.IsTransationMode, localization.IsStoreCode, localization.IsPaymentMode, localization.SchemaId, localization.ComboId, localization.DocumentDescription, localization.ShortDesc, localization.DocumentType, localization.InUse, localization.Active],
        colModel: [
            { name: "FormId", index: "DocumentId", width: 90, editable: false, align: 'left', hidden: false },
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
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', '100%');
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
    businesskey = '0'
}