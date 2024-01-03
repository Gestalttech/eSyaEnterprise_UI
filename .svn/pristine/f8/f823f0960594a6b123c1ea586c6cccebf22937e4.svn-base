$(document).ready(function () {
      $.contextMenu({
            selector: "#btnVendorBlockList",
            trigger: 'left',
           items: {
               jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditVendorBlockList(event, 'edit') } },
               jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditVendorBlockList(event, 'view') } },
                jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnDeActivateVendor(event, 'delete') } },
            }
        });
        $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
        $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
        $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
     fnGridVendorBlockList();
});

function fnGridVendorBlockList() {
    $("#jqgVendorBlackList").jqGrid('GridUnload');
    $("#jqgVendorBlackList").jqGrid({
        //url:,
        //mtype: 'post',
        datatype: 'json',
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", localization.VendorName, localization.CreditType, localization.CreditPeriod, localization.VendorStatus, localization.ActiveStatus, localization.IsBlackListed, localization.Actions],
        colModel: [
            { name: "VendorCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorName", width: 150, editable: true, align: 'left', hidden: false },
            { name: "CreditType", width: 35, editable: true, align: 'left' },
            { name: "CreditPeriod", width: 35, editable: true, align: 'left', resizable: true },
            { name: "ApprovalStatus", editable: true, width: 35, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Approved;false: UnApproved" } },
            { name: "ActiveStatus", editable: true, width: 35, align: 'left', resizable: false, edittype: "select", formatter: 'select', editoptions: { value: "true: Active;false: Inactive" } },
            { name: "IsBlackListed", editable: true, width: 35, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', width:30, resizable: false,
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
        pager: "#jqpVendorBlackList",
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
        caption:localization.VendorBlackList,
        onSelectRow: function (rowid, status, e) {
            SelectedVndrCode = $("#jqgVendorBlackList").jqGrid('getCell', rowid, 'VendorCode');
            SelectedVndrNam = $("#jqgVendorBlackList").jqGrid('getCell', rowid, 'VendorName');
        },
    }).jqGrid('navGrid', '#jqpVendorBlackList', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}

function fnEditBlackListed(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorBlackList').jqGrid('getRowData', rowid);
      
}
function fnUnblackVendor(Vendorcode) {
    
}

function Refresh() {
    $("#jqgVendorBlackList").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}