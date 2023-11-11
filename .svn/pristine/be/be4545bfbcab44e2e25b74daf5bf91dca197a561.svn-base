

function fnLoadVendorItemLink() {

    $("#jqgVendorItemLink").trigger("GridUnload");

    $("#jqgVendorItemLink").jqGrid({
        //url:,
        //mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        serializeGridData: function (postdata) {
            postdata.Vendorcode = $("#txtVendorCode").val();
            return JSON.stringify(postdata.Vendorcode);
        },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["","Item Description", "Business share (in %)", "Min. Supply Qty.", "Rate Plan", "Effective From", "Effective Till", "Active Status", ""],
        colModel: [{ name: 'VendorCode', width: '40', resizable: false, hidden: true },
            { name: 'ItemDesc', width: '200', resizable: false, hidden: false },
            { name: 'BusinessShare', width: '170', resizable: false, align: 'right'},
            { name: 'MinimumSupplyQuantity', width: '100', resizable: false, align: 'right'},
            { name: 'RatePlan', width: '80', resizable: false },
            { name: 'EffectiveFrom', width: '100', resizable: false ,align:'right'},
            { name: 'EffectiveTill', width: '100', resizable: false, align: 'right' },
        
        { name: 'ActiveStatus', width: '100', resizable: false },
        {
            name: '', width: '100', resizable: false,
            formatter: function (cellValue, option, rowObject) {
                var ret = '<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit"> Edit </button>'
                return ret;
            },
        }],
        rowNum: 10,
        rowList: [10, 20, 40],
        rownumWidth:55,
        pager: "#jqpVendorItemLink",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        scroll: false,
        loadonce: true,
        width: 'auto',
        height: 'auto',
        autowidth: 'auto',
        shrinkToFit: true,
        forceFit: true,
    }).jqGrid('navGrid', '#jqpVendorItemLink', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpVendorItemLink', {
        caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'custReload', position: 'first', onClickButton: toRefresh
    });
    fnAddGridSerialNoHeading();
}

function toRefresh() {
    $("#jqgVendorItemLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}




//function fnSaveVendorItemLink()

//{
//    debugger;
//    if (Isvalidation() == false) {
//        return;
//    }


//    if (Isadd == 0) {
//        var Taxstructuremodel = {
//            // Number($('#cboISDCode').val()),
//            Isdcode: Number($('#cbopopupISDCode').val()),
//            TaxType: $("#txttaxtype").val(),
//            TaxCategory: $("#txttaxcategory").val(),
//            TaxPerc: Number($('#txttaxpercentage').val()),
//            EffectiveFrom: $("#txteffectivefrom").val(),
//            EffectiveTill: $("#txteffectivetill").val(),
//            TaxDesc: $("#txttaxdescription").val(),
//            TaxCategoryDesc: $("#txttaxcategorydescription").val(),
//            UsageStatus: false,
//            ActiveStatus: $("#cbostatus").val(),
//            Isadd: 0
//        };
//    }
//    if (Isadd == 1) {
//        var Taxstructuremodel = {
//            Isdcode: $("#cbopopupISDCode").val(),
//            TaxType: $("#txttaxtype").val(),
//            TaxCategory: $("#txttaxcategory").val(),
//            TaxPerc: $("#txttaxpercentage").val(),
//            EffectiveFrom: $("#txteffectivefrom").val(),
//            EffectiveTill: $("#txteffectivetill").val(),
//            TaxDesc: $("#txttaxdescription").val(),
//            TaxCategoryDesc: $("#txttaxcategorydescription").val(),
//            UsageStatus: false,
//            ActiveStatus: $("#cbostatus").val(),
//            Isadd: 1
//        };

//    }

//    $.ajax({
//        type: "post",
//        data: JSON.stringify(Taxstructuremodel),
//        url: getBaseURL() + '/TaxStructure/Insert_TaxStructure',
//        contentType: "application/json",

//        error: function (xhr) {
//            fnAlert('Error: ' + xhr.statusText, "e");
//        },
//        success: function (res) {
//            var MSGKey = JSON.parse(res);
//            //var MSGKey = JSON.stringify(res);
//            if (MSGKey.Status == false) {
//                $("#errmsg").show().html(MSGKey.Message);
//                return false;
//            }

//            if (MSGKey.Status == true) {
//                $("#succmsg").show().html(MSGKey.Message);
//                Refresh();
//                closePopUp();
//                return true;
//            }

//            function closePopUp() {
//                setTimeout(function () {
//                    $("#PopupTaxStructure").modal('hide');
//                }, 3000);
//                ClearFields();
//            }
//        }
//    });

//}



//function Isvalidation() {

 
//    var ItemDescription = $("#txtItemDescription").val();
//    var Businessshare = $("#txtBusinessshare").val();
//    var MinimumSupplyQuantity = $("#txtMinimumSupplyQuantity").val();
//    var RatePlan = $("#txtRatePlan").val();
//    var taxpercentage = $("#txttaxpercentage").val();
//    var effectivefrom = $("#txtEffectiveFrom").val();
//    var effectivetill = $("#txtEffectiveTill").val();
//    var statusforitemLink = $("#cbostatusforitemLink").val();

//    if (ItemDescription == "" || ItemDescription == null) {
//        fnAlert("Please select the Item", "e");
//        return false;
//    }

//    if (Businessshare == "" || Businessshare == null) {
//        fnAlert("Please Enter Business Share", "e");
//        return false;
//    }

//    if (MinimumSupplyQuantity == "" || MinimumSupplyQuantity == null) {
//        fnAlert("Please Enter Supply Quantity", "e");
//        return false;
//    }

//    if (RatePlan == "" || RatePlan == null) {
//        fnAlert("Please Enter Rate Plane", "e");
//        return false;
//    }

//    if (taxpercentage == "" || taxpercentage == null) {
//        fnAlert("Please Enter Tax Percentage", "e");
//        return false;
//    }

//    if (effectivefrom == "" || effectivefrom == null) {
//        fnAlert("Please Select From date", "e");
//        return false;
//    }
//    if (effectivetill == "" || effectivetill == null) {
//        fnAlert("Please Select To date", "e");
//        return false;
//    }
//}