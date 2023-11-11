
$(document).ready(function () {
     
    $("#jqvApprovalList").GridUnload();

    $("#jqvApprovalList").jqGrid({
        //url:,
        //mtype: 'post',
        datatype: 'json',

        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Vendor Name", "Credit Type", "Credit Period", "Is Supply Group Created?", "Is Vendor Locations Created?", "Is Business Link Created?", "Is Statutory Details Created?",  "Is Bank Details Created?", "Vendor Status", ""],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorName", width: 140, editable: true, align: 'left', hidden: false },
            { name: "CreditType", width: 70, editable: true, align: 'left' },
            { name: "CreditPeriod", width:60, editable: true, align: 'left', resizable: true },
            { name: "SupplyGroup", editable: true, width: 105, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "VendorLocations", editable: true, width:105, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "BusinessLink", editable: true, width: 85, align: 'center !important' ,edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "StatutoryDetails", editable: true, width: 105, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "BankDetails", editable: true, width: 85, align: 'center !important', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ApprovalStatus", editable: true, width: 65, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Approved;false: UnApproved" } },

            {
                name: '', width: 65, resizable: false,
                formatter: function (cellValue, option, rowObject) {
                    var ret = '<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit" onclick="fnEdit_ApprovalVendorList(event)"> Approve </button>'
                    return ret;
                },
            },
        ],
        rowList: [10, 20, 50],
        rowNum: 10,
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpApprovalList",
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
            SelectedVndrCode = $("#jqvApprovalList").jqGrid('getCell', rowid, 'VendorCode');
            SelectedVndrNam = $("#jqvApprovalList").jqGrid('getCell', rowid, 'VendorName');

        },

    }).jqGrid('navGrid', '#jqpApprovalList', { add: false, edit: false, search: false, del: false, refresh: false })
    fnAddGridSerialNoHeading();
});

function fnEdit_ApprovalVendorList(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqvApprovalList').jqGrid('getRowData', rowid);
    

}
function fn_ApproveVendor(Vendorcode) {

    
}

function Refresh() {
    $("#jqvApprovalList").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}