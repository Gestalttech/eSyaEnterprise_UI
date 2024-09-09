function fnLoadAPBusinessLinkGrid() {
    $("#jqgAPBusinessLink").GridUnload();

    $("#jqgAPBusinessLink").jqGrid(

        {
            url: getBaseURL() + '/Approve/GetBusinessKeysByVendorcode?vendorID=' + $("#txtAPVendorCode").val(),
            mtype: 'POST',
            datatype: 'json',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

            serializeGridData: function (postdata) {
                postdata.Vendorcode = $("#txtAPVendorCode").val();
                return JSON.stringify(postdata.Vendorcode);
            },
            colNames: [localization.BusinessKey,  localization.BusinessLocation, localization.Select],
            colModel: [
                { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'BusinessLocation', index: 'BusinessLocation', width: '228', resizable: false },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 10,
            rowList: [10, 20, 50, 100],
            rownumWidth:55,
            loadonce: true,
            pager: "#jqpAPBusinessLink",
            viewrecords: true,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false, scrollOffset: 0,
            caption: localization.VendorBusinessLink,
            onSelectRow: function (rowid) {
                BusinessKey = $("#jqgAPBusinessLink").jqGrid('getCell', rowid, 'BusinessKey');

            },
            loadComplete: function (data) {
                fnAPDisableActivecheckboxs();
                fnJqgridSmallScreen("jqgAPBusinessLink");
            },
        })

        .jqGrid('navGrid', '#jqpAPBusinessLink', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpAPBusinessLink', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshAPBusinessLinkGrid
        });  
    fnAddGridSerialNoHeading();
}

function fnSaveAPBusinessLinks() {
    if (IsValidAPBusinessLinks() == false) {
        return;
    }
    var val = [];
    var numberOfRecords = $("#jqgAPBusinessLink").getGridParam("records");
    for (i = 1; i <= numberOfRecords; i++) {
        var rowData = $('#jqgAPBusinessLink').getRowData(i);
        if (rowData.ActiveStatus == "true") {
            val.push(rowData.BusinessKey);

        }
    }

    var bkeys = {
        vendorID: $("#txtAPVendorCode").val(),
        Businesslink: val
    };

    $.ajax({
        url: getBaseURL() + "/Approve/InsertBusinesskeyforVendor",
        type: 'POST',
        datatype: 'json',
        data: { bkeys },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                fnRefreshAPBusinessLinkGrid();
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
function IsValidAPBusinessLinks() {
    if (IsStringNullorEmpty($("#txtAPVendorCode").val())) {
        fnAlert("w", "EVN_01_00", "UI0217", errorMsg.CreateVendordetails_E5);
        return false;
    }
}
function fnRefreshAPBusinessLinkGrid() {
    $("#jqgAPBusinessLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid')
}

function fnAPDisableActivecheckboxs() {
    if (businesslocation === true) {
        $("input[type=checkbox]").attr('disabled', true);
    }
    if (businesslocation === false) {
        $("input[type=checkbox]").attr('disabled', false);
    }
}