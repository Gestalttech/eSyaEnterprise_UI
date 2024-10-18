function CheckDigits(e) {

    if (e.which == 46) {
        if ($(this).val().indexOf('.') != -1) {
            return false;
        }
    }

    if (e.which != 8 && e.which != 0 && e.which != 46 && (e.which < 48 || e.which > 57)) {
        return false;
    }

}

function fnCboISDCodes_change() {
    GetVendorStatutoryDetails();
}


function fnGridRefreshVendorProfileStatutoryDetails() {
    $("#jqgVendorProfileStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearStatutoryDetails() {

    fnGridRefreshVendorProfileStatutoryDetails();
}

function LoadVendorStatutorydetails() {
    fnBindStatutoryISDCodes();
    fnBindVendorLocationAddress();
    GetVendorStatutoryDetails();
}
function fnBindStatutoryISDCodes() {
    $("#cboStatutoryISDCode").empty();

    $.ajax({
        url: getBaseURL() + '/CreateVendor/GetISDCodesbyVendorId?vendorID=' + $("#txtVendorCode").val(),
        type: 'Post',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        //success: function (response, data) {
        success: function (data) {

            if (data != null) {
                //refresh each time
                $("#cboStatutoryISDCode").empty();
                $("#cboStatutoryISDCode").append($("<option value='0'>" + localization.Select + "</option>"));
                var $select = $("#cboStatutoryISDCode");

                data.forEach(function (item) {
                    var optionContent = '<img src="' + item["CountryFlag"] + '" style="width: 20px; height: 20px; margin-right: 8px;" />' + item["CountryName"] + ' (+' + item["Isdcode"] + ')';
                    $select.append($('<option></option>')
                        .val(item["Isdcode"])
                        .attr('data-content', optionContent)
                        .text(item["CountryName"] + '  (+' + item["Isdcode"] + ')'));
                });

                // Refresh the selectpicker to apply changes
                $select.selectpicker('refresh');
            }
            else {
                $("#cboStatutoryISDCode").empty();
                $("#cboStatutoryISDCode").append($("<option value='0'>" +localization.Select +"</option>"));
                $("#cboStatutoryISDCode").val(_cnfISDCode);
                $("#cboStatutoryISDCode").val('0');
                $('#cboStatutoryISDCode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function fnBindVendorLocationAddress() {
    $("#cboVendorAddress").empty();
    $.ajax({
        url: getBaseURL() + '/CreateVendor/GetVendorAddressLocationsByVendorID?vendorID=' + $("#txtVendorCode").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboVendorAddress").empty();

                $("#cboVendorAddress").append($("<option value='0'> Select </option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboVendorAddress").append($("<option></option>").val(response[i]["VendorLocationId"]).html(response[i]["VendorLocation"]));
                }
                $('#cboVendorAddress').selectpicker('refresh');
            }
            else {
                $("#cboVendorAddress").empty();
                $("#cboVendorAddress").append($("<option value='0'> Select</option>"));
                $('#cboVendorAddress').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function GetVendorStatutoryDetails() {
    $("#jqgVendorProfileStatutoryDetails").jqGrid('GridUnload');
    $("#jqgVendorProfileStatutoryDetails").jqGrid({
        url: getBaseURL() + '/CreateVendor/GetVendorStatutoryDetails?vendorID=' + $("#txtVendorCode").val() + '&isdCode=' + $("#cboStatutoryISDCode").val()
            + '&locationId=' + $("#cboVendorAddress").val(),
        datatype: 'json',
        mtype: 'POST',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.VendorId, localization.VendorLocationId, localization.IsdCode, "Statutory Code", "Statutory Short Code", "Statutory Description", "Statutory Value", "ActiveStatus"],
        colModel: [
            { name: "VendorId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "VendorLocationId", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "Isdcode", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryCode", width: 70, editable: false, editoptions: { disabled: true }, align: 'left', hidden: true },
            { name: "StatutoryShortCode", width: 70, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "StatutoryDescription", width: 350, editable: false, editoptions: { disabled: true }, align: 'left' },
            { name: "StatutoryValue", width: 200, align: 'left', editable: true, edittype: "text", editoptions: { maxlength: 25 }, },
            { name: "ActiveStatus", editable: true, width: 70, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false }, }

        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        loadonce: true,
        pager: "#jqpVendorProfileStatutoryDetails",
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
        cellEdit: true,
        cellsubmit: 'clientArray',

        onSelectRow: function (rowid, iRow, iCol, e) {

        },
        caption: 'Vendor Statutory Details',
        loadComplete: function () {
            fnJqgridSmallScreen("jqgVendorProfileStatutoryDetails");
        },
    
    }).jqGrid('navGrid', '#jqpVendorProfileStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpVendorProfileStatutoryDetails', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshVendorProfileStatutoryDetails
        })
}

function fnSaveVendorStatutoryDetails() {
    if ($('#txtVendorCode').val() == '' || $('#txtVendorCode').val() == '0') {
        fnAlert("w", "EVN_01_00", "UI0440", errorMsg.CreateVendor_E7);
        return;
    }
    if ($('#cboStatutoryISDCode').val() == '' || $('#cboStatutoryISDCode').val() == '0') {
        fnAlert("w", "EVN_01_00", "UI0056", errorMsg.SelectIsdCode_E8);
        return;
    }
    if ($('#cboVendorAddress').val() == '' || $('#cboVendorAddress').val() == '0') {
        fnAlert("w", "EVN_01_00", "UI0441", errorMsg.VendorAddress_E9);
        return;
    }
    $("#jqgVendorProfileStatutoryDetails").jqGrid('editCell', 0, 0, false);

    var obj = [];
    var gvT = $('#jqgVendorProfileStatutoryDetails').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['StatutoryValue'])) {
            var bu_bd = {
                VendorId: $('#txtVendorCode').val(),
                VendorLocationId: $('#cboVendorAddress').val(),
                Isdcode: $('#cboStatutoryISDCode').val(),
                StatutoryCode: gvT[i]['StatutoryCode'],
                //StatutoryDescription: gvT[i]['StatutoryDescription'],
                StatutoryValue: gvT[i]['StatutoryValue'],
                ActiveStatus: gvT[i]['ActiveStatus']
            }
            obj.push(bu_bd);
        }
    }

    $("#btnsavestatutory").attr('disabled', true);

    $.ajax({
        url: getBaseURL() + '/CreateVendor/InsertOrUpdateVendorStatutoryDetails',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefreshVendorProfileStatutoryDetails();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnsavestatutory").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnsavestatutory").attr("disabled", false);
        }
    });

    $("#btnsavestatutory").attr("disabled", false);
}


//function fnloadvendorLocationDetailsGrid() {
//    //fnClearStatutoryDetails();
//    $("#jqgLocationDetails").GridUnload();

//    $("#jqgLocationDetails").jqGrid({
        
//        url: getBaseURL() + '/CreateVendor/GetVendorLocationsByVendorcode?vendorID=' + $("#txtVendorCode").val(),
//        mtype: 'POST',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        colNames: [localization.VendorId, localization.VendorLocation, localization.VendorAddress, localization.ContactPerson, localization.LocationID, localization.IsDefaultLocation,localization.Active],
//        colModel: [
//            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true },
//            { name: "VendorLocation", width: 150, editable: true, align: 'left', hidden: false },
//            { name: "VendorAddress", width: 150, editable: true, align: 'left', hidden: false },
//            { name: "ContactPerson", width: 150, editable: true, align: 'left', },
//            { name: "VendorLocationId", width: 100, editable: true, align: 'left', hidden: false },
//            { name: "IsLocationDefault", editable: true, width: 105, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
//            { name: "ActiveStatus", width: 60, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

//        ],
//        rowNum: 10,
//        rowList: [10, 20, 40],
//        rownumWidth:55,
//        loadonce: true,
//        pager: "#jqpLocationDetails",
//        viewrecords: true,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        forceFit: true,
//        scrollOffset: 0,
//        caption: localization.VendorStatutoryDetails,
//        loadComplete: function (data) {
//            fnJqgridSmallScreen("jqgLocationDetails");
//        },
//        onSelectRow: function (rowid) {
          
//           var locId = $("#jqgLocationDetails").jqGrid('getCell', rowid, 'VendorLocationId');
//            var vcode = $("#jqgLocationDetails").jqGrid('getCell', rowid, 'VendorId');
//            fnGetStatutorydetails(vcode,locId);
           
//        },

//    }).jqGrid('navGrid', '#jqpLocationDetails', { add: false, edit: false, search: false, del: false, refresh: false }); fnAddGridSerialNoHeading();
//}

//function fnGetStatutorydetails(vcode,locId) {
//    $("#txtstatutorylocationId").val(locId);
//    $("#txtstatutoryvendorcode").val(vcode);
//    $("#txtstatdetailsDesc").val('');
//    $("#chkstatutorystatus").parent().removeClass("is-checked");
//    fnloadVendorStatutorydetails();
//    $("#chkstatutorystatus").parent().addClass("is-checked");
//    $("#divstatutorydetailsform").show();
//    $("#lbllocationId").text(locId);
//    $("#btnsavestatutory").html('<i class="fa fa-save"></i>  Save');
//}

//function fnloadVendorStatutorydetails() {
    
//    $("#jqgStatutoryDetails").GridUnload();
//    var locationId = $("#txtstatutorylocationId").val();
//    var vndcode = $("#txtstatutoryvendorcode").val();
//    $("#jqgStatutoryDetails").jqGrid({

      
//        url: getBaseURL() + '/CreateVendor/GetStatutorydetailsbyVendorcodeAndLocationId?vendorID=' + vndcode + '&locationId=' + locationId,
//        mtype: 'POST',
//        datatype: 'json',
//        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
//        colNames: [localization.VendorId, localization.VendorLocationId, localization.StatutoryCode,  localization.StatutoryDescription, localization.Active, localization.Actions],
//        colModel: [
//            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true },
//            { name: "VendorLocationId", width: 150, editable: true, align: 'left', hidden: true },
//            { name: "StatutoryCode", width: 40, editable: true, align: 'left', hidden: true},
//            { name: "StatutoryDescription", width: 120, editable: true, align: 'left' },
//            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
//            {
//                name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
//                formatter: function (cellValue, options, rowdata, action) {
//                    return '<button class="btn-xs btn-jqgrid" title="Edit" onclick="return fnEditStatutoryDetails(event)"><i class="fas fa-pen"></i>' + localization.Edit+' </button>';
//                }
//            },
//        ],
//        rowNum: 10,
//        rowList: [10, 20, 50, 100],
//        rownumWidth: 55,
//        loadonce: true,
//        pager: "#jqpStatutoryDetails",
//        viewrecords: true,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        scrollOffset: 0,
       
//        }).jqGrid('navGrid', '#jqpStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });
//    fnAddGridSerialNoHeading();
//}

//function fnSaveStatutorydetails() {
//    if (IsStringNullorEmpty($("#txtVendorCode").val())) {
//        fnAlert("w", "EVN_01_00", "UI0217", errorMsg.CreateVendordetails_E5);
//        return false;
//    }
//    if (IsStringNullorEmpty($("#txtstatutorylocationId").val())) {
//        fnAlert("w", "EVN_01_00", "UI0223", errorMsg.VendorLocation_E11);
//        return false;
//    }
//    if (IsStringNullorEmpty($("#txtstatdetailsDesc").val())) {
//        fnAlert("w", "EVN_01_00", "UI0224", errorMsg.Statutorydetails_E14);
//        return;
//    }

//      var statutorydetails = {
//            VendorId: $("#txtstatutoryvendorcode").val(),
//            VendorLocationId: $("#txtstatutorylocationId").val(),
//            StatutoryCode: $("#txtstatutorycode").val() === '' ? 0 : $("#txtstatutorycode").val(),
//            StatutoryDescription: $("#txtstatdetailsDesc").val(),
//            ActiveStatus: $("#chkstatutorystatus").parent().hasClass("is-checked")
//        };
   
//    $.ajax({
//        url: getBaseURL() + '/CreateVendor/InsertOrUpdateStatutorydetails',
//        type: 'POST',
//        datatype: 'json',
//        data: { statutorydetails },
//        success: function (response) {
//            if (response.Status) {
//                fnAlert("s", "", response.StatusCode, response.Message);
//                fnClearStatutoryDetails();
//                $("#jqgStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

//                return true;
//            } 
//            else{
//                fnAlert("e", "", response.StatusCode, response.Message);
//                return false;
//            }
//        },
//        error: function (error) {
//            fnAlert("e", "", error.StatusCode, error.statusText);
//        }
//    });
//}

//function fnEditStatutoryDetails(e) {
//    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
//    var rowData = $('#jqgStatutoryDetails').jqGrid('getRowData', rowid);
    
//    $("#txtstatutoryvendorcode").val(rowData.VendorId);
//    $("#txtstatutorylocationId").val(rowData.VendorLocationId);
//    $("#txtstatutorycode").val(rowData.StatutoryCode);
//    $("#txtstatdetailsDesc").val(rowData.StatutoryDescription);
//    if (rowData.ActiveStatus == 'true') {
//        $("#chkstatutorystatus").parent().addClass("is-checked");
//    }
//    else {
//        $("#chkstatutorystatus").parent().removeClass("is-checked");
//    }
//    $("#btnsavestatutory").html('<i class="fa fa-sync"></i> ' +localization.Update);
//}

//function fnClearStatutoryDetails() {
//    $("#txtstatutorycode").val('');
//    $("#txtstatdetailsDesc").val('');
//    $("#btnsavestatutory").html('<i class="fa fa-save"></i> '+localization.Save);
//}