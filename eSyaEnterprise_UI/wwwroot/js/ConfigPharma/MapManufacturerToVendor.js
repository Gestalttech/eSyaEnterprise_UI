var manufId = "0";
var prevSelectedID = '';
function fnLoadManufacturerTree() {

    $.ajax({
        url: getBaseURL() + '/ConfigPharma/Vendor/GetActiveManufacturerList',
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {

            $("#jstManufacturer").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstManufacturer");
            $(window).on('resize', function () {
                fnTreeSize("#jstManufacturer");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstManufacturer").on('loaded.jstree', function () {
        $("#jstManufacturer").jstree()._open_to(prevSelectedID);
        $('#jstManufacturer').jstree().select_node(prevSelectedID);
    });

    $('#jstManufacturer').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstManufacturer").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {
                    $("#lblSelectedManufacturer").text(data.node.text);
                    manufId = data.node.id;
                    fnLoadVendorGrid(manufId);
                    $("#dvMapVendorManufacturer").css('display', 'block');
                }
                else {
                    $("#dvMapVendorManufacturer").css('display', 'none');
                }

            }
        }
    });
    $('#jstManufacturer').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstManufacturer').jstree().deselect_node(closingNode.children);
    });
}

$(function () {
     fnLoadManufacturerTree();
})

function fnLoadVendorGrid(_manufId) {

    $("#jqgManufacturerToVendorLink").GridUnload();
    $("#jqgManufacturerToVendorLink").jqGrid({
        url: getBaseURL() + '/ConfigPharma/Vendor/GetMappedVendorListbyManufacturer?manufId=' + _manufId,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ManufacturerId, localization.VendorId, localization.VendorName,  localization.Active],
        colModel: [
            { name: "ManufacturerId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "VendorId", width: 50, align: 'left', editable: false, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "VendorName", width: 250, align: 'left', editable: false, editoptions: { maxlength: 50 }, resizable: false },
            { name: "ActiveStatus", width: 150, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        pager: "#jqpManufacturerToVendorLink",
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
        forceFit: true, caption: localization.ManufacturerVendorLink,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        loadComplete: function (data) {
            //SetGridControlByAction(); 
            fnJqgridSmallScreen("jqpManufacturerToVendorLink");
         },
    })

}

function fnSaveManufacturerVendorLink() {
   
    if (manufId == "" || manufId == "0") {
        fnAlert("w", "EPH_02_00", "UI0273", errorMsg.nodeadd_E6);
        return;
    }
    $("#jqgManufacturerToVendorLink").jqGrid('editCell', 0, 0, false);
    var vendor_Links = [];
    var id_list = jQuery("#jqgManufacturerToVendorLink").jqGrid('getDataIDs');
    
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgManufacturerToVendorLink').jqGrid('getRowData', rowId);

        vendor_Links.push({
            ManufacturerId: rowData.ManufacturerId,
            VendorId: rowData.VendorId,
            ActiveStatus: rowData.ActiveStatus
        });

    }
    objdata = {
        ManufacturerId: manufId,
        vendorlist: vendor_Links
    };
    $("#btnSave").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/ConfigPharma/Vendor/InsertOrUpdateManufacturer',
        type: 'POST',
        datatype: 'json',
        data: { obj: objdata },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#jqgManufacturerToVendorLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                manufId = "0";
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
    $("#dvMapVendorManufacturer").css('display', 'none');
    $("#jstManufacturer").jstree("deselect_all");
    $('#jstManufacturer').jstree().select_node('FM');
    
}