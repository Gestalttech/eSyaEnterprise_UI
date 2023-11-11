
$(document).ready(function () {

    LoadBlockListGrid();
        
});

function LoadBlockListGrid() {
    $("#jqvBlackListed").jqGrid('GridUnload');

    $("#jqvBlackListed").jqGrid({
        //url:,
        //mtype: 'post',
        datatype: 'json',

        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Vendor Name", "Credit Type", "Credit Period", "Vendor Status", "Active Status", "Is Black Listed", ""],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorName", width: 70, editable: true, align: 'left', hidden: false },
            { name: "CreditType", width: 70, editable: true, align: 'left' },
            { name: "CreditPeriod", width: 100, editable: true, align: 'left', resizable: true },
            { name: "ApprovalStatus", editable: true, width: 95, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Approved;false: UnApproved" } },
            { name: "ActiveStatus", editable: true, width: 95, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            { name: "IsBlackListed", editable: true, width: 105, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

            {
                name: '', width: '100', resizable: false,
                formatter: function (cellValue, option, rowObject) {
                    var ret = '<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit" onclick="fnEdit_BlackListed(event)"> Remove Black List </button>'
                    return ret;
                },
            },
        ],
        rowList: [10, 20, 50],
        rowNum: 10,
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpBlackListed",
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
        onSelectRow: function (rowid, status, e) {
            SelectedVndrCode = $("#jqvBlackListed").jqGrid('getCell', rowid, 'VendorCode');
            SelectedVndrNam = $("#jqvBlackListed").jqGrid('getCell', rowid, 'VendorName');

        },

    }).jqGrid('navGrid', '#jqpBlackListed', { add: false, edit: false, search: false, del: false, refresh: false }); fnAddGridSerialNoHeading();
}

function fnEdit_BlackListed(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqvBlackListed').jqGrid('getRowData', rowid);
   
     
       
}
function fn_UnblackVendor(Vendorcode) {
    
}

function Refresh() {
    $("#jqvBlackListed").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}