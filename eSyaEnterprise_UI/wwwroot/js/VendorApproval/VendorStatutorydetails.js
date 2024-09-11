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
    GetAPVendorStatutoryDetails();
}


function fnGridRefreshAPVendorProfileStatutoryDetails() {
    $("#jqgAPVendorProfileStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnClearAPStatutoryDetails() {

    fnGridRefreshAPVendorProfileStatutoryDetails();
}

function LoadAPVendorStatutorydetails() {
    fnBindAPStatutoryISDCodes();
    fnBindAPVendorLocationAddress();
    GetAPVendorStatutoryDetails();
}
function fnBindAPStatutoryISDCodes() {
    $("#cboAPStatutoryISDCode").empty();

    $.ajax({
        url: getBaseURL() + '/Approve/GetISDCodesbyVendorId?vendorID=' + $("#txtAPVendorCode").val(),
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
                $("#cboAPStatutoryISDCode").empty();
                $("#cboAPStatutoryISDCode").append($("<option value='0'>" + localization.Select + "</option>"));
                var $select = $("#cboAPStatutoryISDCode");

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
                $("#cboAPStatutoryISDCode").empty();
                $("#cboAPStatutoryISDCode").append($("<option value='0'>" + localization.Select + "</option>"));
                $("#cboAPStatutoryISDCode").val(_cnfISDCode);
                $("#cboAPStatutoryISDCode").val('0');
                $('#cboAPStatutoryISDCode').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function fnBindAPVendorLocationAddress() {
    $("#cboAPVendorAddress").empty();
    $.ajax({
        url: getBaseURL() + '/Approve/GetVendorAddressLocationsByVendorID?vendorID=' + $("#txtAPVendorCode").val(),
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        error: function (xhr) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        },
        success: function (response, data) {
            if (response != null) {
                //refresh each time
                $("#cboAPVendorAddress").empty();

                $("#cboAPVendorAddress").append($("<option value='0'>" + localization.Select + "</option>"));
                for (var i = 0; i < response.length; i++) {

                    $("#cboAPVendorAddress").append($("<option></option>").val(response[i]["VendorLocationId"]).html(response[i]["VendorLocation"]));
                }
                $('#cboAPVendorAddress').selectpicker('refresh');
            }
            else {
                $("#cboAPVendorAddress").empty();
                $("#cboAPVendorAddress").append($("<option value='0'>" + localization.Select + "</option>"));
                $('#cboAPVendorAddress').selectpicker('refresh');
            }
        },
        async: false,
        processData: false
    });


}

function GetAPVendorStatutoryDetails() {
    $("#jqgAPVendorProfileStatutoryDetails").jqGrid('GridUnload');
    $("#jqgAPVendorProfileStatutoryDetails").jqGrid({
        url: getBaseURL() + '/Approve/GetVendorStatutoryDetails?vendorID=' + $("#txtAPVendorCode").val() + '&isdCode=' + $("#cboAPStatutoryISDCode").val()
            + '&locationId=' + $("#cboAPVendorAddress").val(),
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
        pager: "#jqpAPVendorProfileStatutoryDetails",
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
            fnJqgridSmallScreen("jqgAPVendorProfileStatutoryDetails");
        },

    }).jqGrid('navGrid', '#jqpAPVendorProfileStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpAPVendorProfileStatutoryDetails', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAPVendorProfileStatutoryDetails
    })
}

function fnSaveAPVendorStatutoryDetails() {
    if ($('#txtAPVendorCode').val() == '' || $('#txtAPVendorCode').val() == '0') {
        fnAlert("w", "EVN_01_00", "UI0314", "Create Vendor");
        return;
    }
    if ($('#cboAPStatutoryISDCode').val() == '' || $('#cboAPStatutoryISDCode').val() == '0') {
        fnAlert("w", "EVN_01_00", "UI0034", "Please Select ISD Code");
        return;
    }
    if ($('#cboAPVendorAddress').val() == '' || $('#cboAPVendorAddress').val() == '0') {
        fnAlert("w", "EVN_01_00", "UI0034", "Please Select Vendor Location Address");
        return;
    }
    $("#jqgAPVendorProfileStatutoryDetails").jqGrid('editCell', 0, 0, false);

    var obj = [];
    var gvT = $('#jqgAPVendorProfileStatutoryDetails').jqGrid('getRowData');
    for (var i = 0; i < gvT.length; ++i) {
        if (!IsStringNullorEmpty(gvT[i]['StatutoryValue'])) {
            var bu_bd = {
                VendorId: $('#txtAPVendorCode').val(),
                VendorLocationId: $('#cboAPVendorAddress').val(),
                Isdcode: $('#cboAPStatutoryISDCode').val(),
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
        url: getBaseURL() + '/Approve/InsertOrUpdateVendorStatutoryDetails',
        type: 'POST',
        datatype: 'json',
        data: { obj: obj },
        success: function (response) {
            if (response.Status === true) {

                fnAlert("s", "", response.StatusCode, response.Message);
                fnGridRefreshAPVendorProfileStatutoryDetails();
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




//function fnloadAPvendorLocationDetailsGrid() {
//    fnClearAPStatutoryDetails();
//    $("#jqgAPLocationDetails").GridUnload();

//    $("#jqgAPLocationDetails").jqGrid({
        
//        url: getBaseURL() + '/Approve/GetVendorLocationsByVendorcode?vendorID=' + $("#txtAPVendorCode").val(),
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
//        pager: "#jqpAPLocationDetails",
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
//            fnJqgridSmallScreen("jqgAPLocationDetails");
//        },
//        onSelectRow: function (rowid) {
          
//           var locId = $("#jqgAPLocationDetails").jqGrid('getCell', rowid, 'VendorLocationId');
//            var vcode = $("#jqgAPLocationDetails").jqGrid('getCell', rowid, 'VendorId');
//            fnGetAPStatutorydetails(vcode,locId);
           
//        },

//    }).jqGrid('navGrid', '#jqpAPLocationDetails', { add: false, edit: false, search: false, del: false, refresh: false }); fnAddGridSerialNoHeading();
//}

//function fnGetAPStatutorydetails(vcode,locId) {
//    $("#txtAPstatutorylocationId").val(locId);
//    $("#txtAPstatutoryvendorcode").val(vcode);
//    $("#txtAPstatdetailsDesc").val('');
//    $("#chkAPstatutorystatus").parent().removeClass("is-checked");
//    fnloadAPVendorStatutorydetails();
//    $("#chkAPstatutorystatus").parent().addClass("is-checked");
//    $("#divAPstatutorydetailsform").show();
//    $("#lblAPlocationId").text(locId);
//    $("#btnAPsavestatutory").html('<i class="fa fa-save"></i>  Save');
//}

//function fnloadAPVendorStatutorydetails() {
    
//    $("#jqgAPStatutoryDetails").GridUnload();
//    var locationId = $("#txtAPstatutorylocationId").val();
//    var vndcode = $("#txtAPstatutoryvendorcode").val();
//    $("#jqgAPStatutoryDetails").jqGrid({

      
//        url: getBaseURL() + '/Approve/GetStatutorydetailsbyVendorcodeAndLocationId?vendorID=' + vndcode + '&locationId=' + locationId,
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
//        pager: "#jqpAPStatutoryDetails",
//        viewrecords: true,
//        gridview: true,
//        rownumbers: true,
//        height: 'auto',
//        align: "left",
//        width: 'auto',
//        autowidth: true,
//        shrinkToFit: true,
//        scrollOffset: 0,
       
//        }).jqGrid('navGrid', '#jqpAPStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });
//    fnAddGridSerialNoHeading();
//}

//function fnSaveAPStatutorydetails() {
//    if (IsStringNullorEmpty($("#txtAPVendorCode").val())) {
//        fnAlert("w", "EVN_02_00", "UI0217", errorMsg.CreateVendordetails_E5);
//        return false;
//    }
//    if (IsStringNullorEmpty($("#txtAPstatutorylocationId").val())) {
//        fnAlert("w", "EVN_02_00", "UI0223", errorMsg.VendorLocation_E11);
//        return false;
//    }
//    if (IsStringNullorEmpty($("#txtAPstatdetailsDesc").val())) {
//        fnAlert("w", "EVN_02_00", "UI0224", errorMsg.Statutorydetails_E14);
//        return;
//    }

//      var statutorydetails = {
//            VendorId: $("#txtAPstatutoryvendorcode").val(),
//            VendorLocationId: $("#txtAPstatutorylocationId").val(),
//            StatutoryCode: $("#txtAPstatutorycode").val() === '' ? 0 : $("#txtAPstatutorycode").val(),
//            StatutoryDescription: $("#txtAPstatdetailsDesc").val(),
//            ActiveStatus: $("#chkAPstatutorystatus").parent().hasClass("is-checked")
//        };
   
//    $.ajax({
//        url: getBaseURL() + '/Approve/InsertOrUpdateStatutorydetails',
//        type: 'POST',
//        datatype: 'json',
//        data: { statutorydetails },
//        success: function (response) {
//            if (response.Status) {
//                fnAlert("s", "", response.StatusCode, response.Message);
//                fnClearAPStatutoryDetails();
//                $("#jqgAPStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

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
//    var rowData = $('#jqgAPStatutoryDetails').jqGrid('getRowData', rowid);
    
//    $("#txtAPstatutoryvendorcode").val(rowData.VendorId);
//    $("#txtAPstatutorylocationId").val(rowData.VendorLocationId);
//    $("#txtAPstatutorycode").val(rowData.StatutoryCode);
//    $("#txtAPstatdetailsDesc").val(rowData.StatutoryDescription);
//    if (rowData.ActiveStatus == 'true') {
//        $("#chkAPstatutorystatus").parent().addClass("is-checked");
//    }
//    else {
//        $("#chkAPstatutorystatus").parent().removeClass("is-checked");
//    }
//    $("#btnAPsavestatutory").html('<i class="fa fa-sync"></i> ' +localization.Update);
//}

//function fnClearAPStatutoryDetails() {
//    $("#txtAPstatutorycode").val('');
//    $("#txtAPstatdetailsDesc").val('');
//    $("#btnAPsavestatutory").html('<i class="fa fa-save"></i> '+localization.Save);
//}