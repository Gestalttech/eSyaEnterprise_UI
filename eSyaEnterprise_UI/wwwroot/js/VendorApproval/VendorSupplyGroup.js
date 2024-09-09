function fnLoadAPSupplyGroupGrid() {
    
    $("#jqgAPSupplyGroup").GridUnload();

    $("#jqgAPSupplyGroup").jqGrid(

        {
            url: getBaseURL() + '/Approve/GetVendorSuuplyGroupParameterList?vendorID=' + $("#txtAPVendorCode").val(),
            mtype: 'POST',
            datatype: 'json',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

            serializeGridData: function (postdata) {
                postdata.Vendorcode = $("#txtAPVendorCode").val();
                return JSON.stringify(postdata.Vendorcode);
            },
            colNames: [localization.ParameterId, localization.ParameterDescription, localization.Active],
            colModel: [
                { name: "ParameterId", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'ParameterDesc', index: 'ParameterDesc', width: '228', resizable: false },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth: 55,
            loadonce: true,
            pager: "#jqpAPSupplyGroup",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false, scrollOffset: 0,
            caption: localization.VendorSupplyGroup,
            loadComplete: function () {
                fnJqgridSmallScreen("jqgAPSupplyGroup");
            },
            onSelectRow: function (rowid) {
                ParameterId = $("#jqgAPSupplyGroup").jqGrid('getCell', rowid, 'ParameterId');

            },
            loadComplete: function (data) {
                fnDisableAPActivecheckboxs();
                $(this).find(">tbody>tr.jqgrow:odd").addClass("myAltRowClassEven");
                $(this).find(">tbody>tr.jqgrow:even").addClass("myAltRowClassOdd");
            },
        })

        .jqGrid('navGrid', '#jqpAPSupplyGroup', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpAPSupplyGroup', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshAPSupplyGroupGrid
        });
    fnAddGridSerialNoHeading();
}

function fnSaveSupplyGroup() {
    if (IsValidAPSupplyGroup() == false) {
        return;
    }
    
    var val = [];
    var numberOfRecords = $("#jqgAPSupplyGroup").getGridParam("records");

    for (i = 1; i <= numberOfRecords; i++) {
        var rowData = $('#jqgAPSupplyGroup').getRowData(i);
        if (rowData.ActiveStatus == "true") {
            val.push({
                ParameterID: rowData.ParameterId,
                ActiveStatus: rowData.ActiveStatus,
            });

        }
    }

    var objsupply = {
        vendorID: $("#txtAPVendorCode").val(),
        l_SupplyGroupParam: val
    };

    $.ajax({
        url: getBaseURL() + "/Approve/InsertSuuplyGroupforVendor",
        type: 'POST',
        datatype: 'json',
        data: { objsupply },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshAPSupplyGroupGrid();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                return false;
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });
}
function IsValidAPSupplyGroup() {
    if (IsStringNullorEmpty($("#txtAPVendorCode").val())) {
        fnAlert("w", "EVN_01_00", "UI0217", errorMsg.CreateVendordetails_E5);
        return false;
    }
} 
function fnRefreshAPSupplyGroupGrid() {
    $("#jqgAPSupplyGroup").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnDisableAPActivecheckboxs() {
    if (businesslocation === true) {
        $("input[type=checkbox]").attr('disabled', true);
    }
    if (businesslocation === false) {
        $("input[type=checkbox]").attr('disabled', false);
    }
}