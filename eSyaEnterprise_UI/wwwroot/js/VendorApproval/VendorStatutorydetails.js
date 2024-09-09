function fnloadAPvendorLocationDetailsGrid() {
    fnClearAPStatutoryDetails();
    $("#jqgAPLocationDetails").GridUnload();

    $("#jqgAPLocationDetails").jqGrid({
        
        url: getBaseURL() + '/Approve/GetVendorLocationsByVendorcode?vendorID=' + $("#txtAPVendorCode").val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.VendorId, localization.VendorLocation, localization.VendorAddress, localization.ContactPerson, localization.LocationID, localization.IsDefaultLocation,localization.Active],
        colModel: [
            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocation", width: 150, editable: true, align: 'left', hidden: false },
            { name: "VendorAddress", width: 150, editable: true, align: 'left', hidden: false },
            { name: "ContactPerson", width: 150, editable: true, align: 'left', },
            { name: "VendorLocationId", width: 100, editable: true, align: 'left', hidden: false },
            { name: "IsLocationDefault", editable: true, width: 105, align: 'center !important', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "ActiveStatus", width: 60, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

        ],
        rowNum: 10,
        rowList: [10, 20, 40],
        rownumWidth:55,
        loadonce: true,
        pager: "#jqpAPLocationDetails",
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
        caption: localization.VendorStatutoryDetails,
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgAPLocationDetails");
        },
        onSelectRow: function (rowid) {
          
           var locId = $("#jqgAPLocationDetails").jqGrid('getCell', rowid, 'VendorLocationId');
            var vcode = $("#jqgAPLocationDetails").jqGrid('getCell', rowid, 'VendorId');
            fnGetAPStatutorydetails(vcode,locId);
           
        },

    }).jqGrid('navGrid', '#jqpAPLocationDetails', { add: false, edit: false, search: false, del: false, refresh: false }); fnAddGridSerialNoHeading();
}

function fnGetAPStatutorydetails(vcode,locId) {
    $("#txtAPstatutorylocationId").val(locId);
    $("#txtAPstatutoryvendorcode").val(vcode);
    $("#txtAPstatdetailsDesc").val('');
    $("#chkAPstatutorystatus").parent().removeClass("is-checked");
    fnloadAPVendorStatutorydetails();
    $("#chkAPstatutorystatus").parent().addClass("is-checked");
    $("#divAPstatutorydetailsform").show();
    $("#lblAPlocationId").text(locId);
    $("#btnAPsavestatutory").html('<i class="fa fa-save"></i>  Save');
}

function fnloadAPVendorStatutorydetails() {
    
    $("#jqgAPStatutoryDetails").GridUnload();
    var locationId = $("#txtAPstatutorylocationId").val();
    var vndcode = $("#txtAPstatutoryvendorcode").val();
    $("#jqgAPStatutoryDetails").jqGrid({

      
        url: getBaseURL() + '/Approve/GetStatutorydetailsbyVendorcodeAndLocationId?vendorID=' + vndcode + '&locationId=' + locationId,
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.VendorId, localization.VendorLocationId, localization.StatutoryCode,  localization.StatutoryDescription, localization.Active, localization.Actions],
        colModel: [
            { name: "VendorId", width: 70, editable: true, align: 'left', hidden: true },
            { name: "VendorLocationId", width: 150, editable: true, align: 'left', hidden: true },
            { name: "StatutoryCode", width: 40, editable: true, align: 'left', hidden: true},
            { name: "StatutoryDescription", width: 120, editable: true, align: 'left' },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 50, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="btn-xs btn-jqgrid" title="Edit" onclick="return fnEditStatutoryDetails(event)"><i class="fas fa-pen"></i>' + localization.Edit+' </button>';
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        pager: "#jqpAPStatutoryDetails",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
       
        }).jqGrid('navGrid', '#jqpAPStatutoryDetails', { add: false, edit: false, search: false, del: false, refresh: false });
    fnAddGridSerialNoHeading();
}

function fnSaveAPStatutorydetails() {
    if (IsStringNullorEmpty($("#txtAPVendorCode").val())) {
        fnAlert("w", "EVN_02_00", "UI0217", errorMsg.CreateVendordetails_E5);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPstatutorylocationId").val())) {
        fnAlert("w", "EVN_02_00", "UI0223", errorMsg.VendorLocation_E11);
        return false;
    }
    if (IsStringNullorEmpty($("#txtAPstatdetailsDesc").val())) {
        fnAlert("w", "EVN_02_00", "UI0224", errorMsg.Statutorydetails_E14);
        return;
    }

      var statutorydetails = {
            VendorId: $("#txtAPstatutoryvendorcode").val(),
            VendorLocationId: $("#txtAPstatutorylocationId").val(),
            StatutoryCode: $("#txtAPstatutorycode").val() === '' ? 0 : $("#txtAPstatutorycode").val(),
            StatutoryDescription: $("#txtAPstatdetailsDesc").val(),
            ActiveStatus: $("#chkAPstatutorystatus").parent().hasClass("is-checked")
        };
   
    $.ajax({
        url: getBaseURL() + '/Approve/InsertOrUpdateStatutorydetails',
        type: 'POST',
        datatype: 'json',
        data: { statutorydetails },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnClearAPStatutoryDetails();
                $("#jqgAPStatutoryDetails").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

                return true;
            } 
            else{
                fnAlert("e", "", response.StatusCode, response.Message);
                return false;
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}

function fnEditStatutoryDetails(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgAPStatutoryDetails').jqGrid('getRowData', rowid);
    
    $("#txtAPstatutoryvendorcode").val(rowData.VendorId);
    $("#txtAPstatutorylocationId").val(rowData.VendorLocationId);
    $("#txtAPstatutorycode").val(rowData.StatutoryCode);
    $("#txtAPstatdetailsDesc").val(rowData.StatutoryDescription);
    if (rowData.ActiveStatus == 'true') {
        $("#chkAPstatutorystatus").parent().addClass("is-checked");
    }
    else {
        $("#chkAPstatutorystatus").parent().removeClass("is-checked");
    }
    $("#btnAPsavestatutory").html('<i class="fa fa-sync"></i> ' +localization.Update);
}

function fnClearAPStatutoryDetails() {
    $("#txtAPstatutorycode").val('');
    $("#txtAPstatdetailsDesc").val('');
    $("#btnAPsavestatutory").html('<i class="fa fa-save"></i> '+localization.Save);
}