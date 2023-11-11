var Isadd = 0;
var Selected = 0;

function fnLoadPartNumber() {

    $("#jqgVendorPartNumber").jqGrid('GridUnload');
    
    $("#jqgVendorPartNumber").jqGrid({
        //url:,
        //mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        serializeGridData: function (postdata) {
            postdata.vendorcode = $("#txtVendorCode").val();
            return JSON.stringify(postdata.vendorcode);
        },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: ["", "Item Description", "Part Number", "Part Description", "Active Status", "" , ""],
        colModel: [
        { name: 'VendorCode', width: '40', resizable: false, hidden: true },
        { name: 'ItemCode', width: '200', resizable: false, hidden: false },
        { name: 'PartNumber', width: '170', resizable: false, align: 'left' },
        { name: 'PartDesc', width: '100', resizable: false, align: 'left' },
            {
                name: "ActiveStatus", editable: true, width: 85, align: "left", edittype: "select", resizable: false, formatter: 'select', editoptions: { value: "true: Active;false: Inactive" }
            },
        {
            name: '', width: 40, resizable: false,
            formatter: function (cellValue, option, rowObject) {
                return '<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit" onclick="return _fnEditPartNumber(event)"> Edit </button>'
                
            },
            },
            {
                name: '', width: 40, resizable: false,
                formatter: function (cellValue, option, rowObject) {
                    return'<button class="btn-xs ui-button ui- widget ui-corner-all" style="padding:2px 4px;background:#0b76bc !important;color:#fff !important; margin:3px;" title="Edit" onclick="return _fnDeletePartNumber(event)"> Delete </button>'
                      
                },
            }

        ],
        rowNum: 5,
        rowList: [5, 10, 20],
        rownumWidth:55,
        pager: "#jqpVendorPartNumber",
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
        onSelectRow: function (rowid) {
            Selected = 1;
            selectedPRTNUMVC = $("#jqgVendorPartNumber").jqGrid('getCell', rowid, 'VendorCode');
            SelectedPRTNUMITMC = $("#jqgVendorPartNumber").jqGrid('getCell', rowid, 'ItemCode');
            SelectedPRTNUMNumber = $("#jqgVendorPartNumber").jqGrid('getCell', rowid, 'PartNumber');
            SelectedPRTNUMDSC = $("#jqgVendorPartNumber").jqGrid('getCell', rowid, 'PartDesc');
            SelectedPRTNUMActiveStatus = $("#jqgVendorPartNumber").jqGrid('getCell', rowid, 'ActiveStatus');
        },
    }).jqGrid('navGrid', '#jqpVendorPartNumber', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpVendorPartNumber', {
        caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'custReload', position: 'first', onClickButton: toRefresh
    });
    fnAddGridSerialNoHeading();
}

function toRefresh() {
    $("#jqgVendorPartNumber").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


function fnPartNumberSavebtn() {
    if (_fnvalidationpartNumber() == false) {
        return;
    }
    

    if (Isadd === 1) {
        var partNumber = {
            VendorCode: $("#txtVendorCode").val(),
            ItemCode: $("#txtItemDescriptionforPartNumber").val(),
            PartNumber: $("#txtPartNumber").val(),
            PartDesc: $("#txtPartDescription").val(),
            ActiveStatus: $("#cbostatusforPartNumber").val(),
            Isadd: 1
        }
    }
    else {
        partNumber = {
            VendorCode: $("#txtVendorCode").val(),
            ItemCode: $("#txtItemDescriptionforPartNumber").val(),
            PartNumber: $("#txtPartNumber").val(),
            PartDesc: $("#txtPartDescription").val(),
            ActiveStatus: $("#cbostatusforPartNumber").val(),
            Isadd: 0
        };
    }
    $("#btnPartNumberDisabled").attr("disabled", true);

    $.ajax({
        type: "post",
        data: JSON.stringify(partNumber),
        url: getBaseURL() + '/VendorMaster/Insert_VendorPartNumber',
        contentType: "application/json",
        success: function (res) {

            var MSGKey = JSON.parse(res);
            if (MSGKey.Status === false) {
                fnAlert(MSGKey.Message, "e");
                $("#btnPartNumberDisabled").attr("disabled", false);
                return false;
            }

            if (MSGKey.Status == true) {
                fnAlert(MSGKey.Message, "s");
                $("#btnPartNumberDisabled").html('<i class="fa fa-spinner fa-spin"></i> wait');
                _fnClearPartNumber();
                $("#jqgVendorPartNumber").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                BTNName();
                return true;
            }
            function BTNName() {
                setTimeout(function () {
                    $("#btnPartNumberDisabled").attr("disabled", false);
                    $("#btnPartNumberDisabled").html("Save");
                }, 3000);
            }
        }
    })

}


function _fnEditPartNumber(e) {
    
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorPartNumber').jqGrid('getRowData', rowid);
    Isadd = 1;
    
    $("#btnPartNumberDisabled").html("Update");
}

function _fnDeletePartNumber(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgVendorPartNumber').jqGrid('getRowData', rowid);
     
    bootbox.confirm({
        title: 'Part Number',
        message: "Are you sure you want to delete" + rowData.PartNumber + "?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'mdl-button  primary-button'
            },
            cancel: {
                label: 'No',
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
            }
        },
        callback: function (result) {
            if (result == true) {
                
                $("#txtVendorCode").val(rowData.VendorCode);
                $("#txtItemDescriptionforPartNumber")[0].parentElement.MaterialTextfield.change(rowData.ItemCode);
                $("#txtPartNumber")[0].parentElement.MaterialTextfield.change(rowData.PartNumber);

                var partNumber = {
                    VendorCode: $("#txtVendorCode").val(),
                    ItemCode: $("#txtItemDescriptionforPartNumber").val(),
                    PartNumber: $("#txtPartNumber").val(),
                    Isadd: 1
                };

                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(partNumber),
                    //url: getBaseURL() + '',
                    contentType: "application/json",
                    success: function (res) {

                        var MSGPartDel = JSON.parse(res);
                        if (MSGPartDel.Status == false) {
                            fnAlert(MSGPartDel.Message, "e");
                            return false;
                        }

                        if (MSGPartDel.Status == true) {
                            fnAlert(MSGPartDel.Message, "s");
                            fnLoadPartNumber();
                            _fnClearPartNumber();
                            return true;
                        }
                    }

                });
             }
            
        }
    });
 
}

function _fnvalidationpartNumber() {
    var ItemDescription = $("#txtItemDescriptionforPartNumber").val();
    var PartNumber = $("#txtPartNumber").val();
    var PartDescription = $("#txtPartDescription").val();

    if (ItemDescription == null || ItemDescription == "") {
        fnAlert("Please Enter Item Description" , "e");
        return false;
    }

    if (PartNumber == null || PartNumber == "") {
        fnAlert("Please Enter  Part Number" , "e");
        return false;
    }

    if (PartDescription == null || PartDescription == "") {
        fnAlert("Please Enter Part Description" , "e");
        return false;
    }
}


function _fnClearPartNumber() {
    $("#txtItemDescriptionforPartNumber").attr('disabled', false);
    $("#txtItemDescriptionforPartNumber").val('');
    $("#txtPartNumber").attr('disabled', false);
    $("#txtPartNumber").val('');
    $("#txtPartDescription").val('');
    $("#cbostatusforPartNumber").val("true"),
    $('#cbostatusforPartNumber').selectpicker('refresh');
    Isadd= 0;
}

