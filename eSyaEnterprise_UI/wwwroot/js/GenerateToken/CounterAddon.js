﻿
$(document).ready(function () {
    fnGridLoadCounterMappingHeader();
    $.contextMenu({
        selector: ".btn-actions",
        trigger: 'left',
        items: {
            edit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCounterMappingHeader(event, 'edit') } },

        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-plus'></i> " + localization.AddOn + "</span>");

});
function fnBusinessLocation_onChange() {
    fnGridLoadCounterMappingHeader();
}
function fnGridLoadCounterMappingHeader() {
    $("#jqgCounterMappingHeader").GridUnload();
    $("#jqgCounterMappingHeader").jqGrid({
        url: getBaseURL() + '/AddOn/GetMappedCounterbyBusinessKey?businesskey=' + $("#cboBusinessLocation").val(),
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.TokenType, localization.TokenPrefix, localization.TokenDesc, localization.CounterNumber, localization.CounterNumberDesc, localization.FloorId, localization.FloorName, localization.CounterKey, localization.Active, localization.Actions],
        colModel: [
            { name: "BusinessKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TokenType", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TokenPrefix", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TokenDesc", editable: true, width: '100' },
            { name: "CounterNumber", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: true },
            { name: "CounterNumberdesc", width: 40, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "FloorId", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "FloorName", width: 80, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CounterKey", width: 50, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    var i = options.rowId;
                    return '<button class="mr-1 btn btn-outline btn-actions" id="btnTokenActions' + i + '"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpCounterMappingHeader",
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
        forceFit: true,
        caption: localization.CounterMappingHeader,
        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgCounterMappingHeader");
        },
    }).jqGrid('navGrid', '#jqpCounterMappingHeader', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCounterMappingHeader', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCounterMappingHeader
    });

    fnAddGridSerialNoHeading();

}

function fnEditCounterMappingHeader(e) {

    var rowid = $("#jqgCounterMappingHeader").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCounterMappingHeader').jqGrid('getRowData', rowid);
    fnClearFields();
    $("#PopupCounterAddon").modal('show');
    fnGridLoadCounterAddon(rowData.BusinessKey, rowData.FloorId, rowData.TokenPrefix, rowData.CounterNumber);
    $("#lblBusinessKey").text($("#cboBusinessLocation option:selected").text());
    $("#lblTokenPrefix").text(rowData.TokenPrefix);
    $("#lblTokenDescription").text(rowData.TokenDesc);
    $("#lblFloor").text(rowData.FloorName);
    $("#lblCounterNumber").text(rowData.CounterNumber);
    $("#txtCounterKey").val(rowData.CounterKey);
}

function fnGridRefreshCounterMappingHeader() {
    $("#jqgCounterMappingHeader").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

}



function fnGridLoadCounterAddon(BusinessKey, FloorId, TokenPrefix, CounterNumber) {
    $("#jqgCounterAddon").GridUnload();
    $("#jqgCounterAddon").jqGrid({
        url: getBaseURL() + '/AddOn/GetAddOnMappedCounters?businesskey=' + BusinessKey + '&floorId=' + FloorId + '&tokenprefix=' + TokenPrefix + '&counterNo=' + CounterNumber,
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.BusinessKey, localization.CounterKey, localization.AddOnToken, localization.TokenDesc, localization.Floor, localization.ExistingCounter, localization.AddonStatus],
        colModel: [
            { name: "BusinessKey", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "CounterKey", width: 100, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: true },
            { name: "TokenPrefix", width: 200, align: 'left', editable: true, editoptions: { maxlength: 15 }, resizable: false, hidden: false },
            { name: "TokenDesc", editable: true, width: 350 },
            { name: "FloorName", width: 250, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "CounterNumber", width: 150, align: 'left', editable: true, editoptions: { maxlength: 6 }, resizable: false, hidden: false },
            { name: "ActiveStatus", width: 100, editable: true, align: 'center', hidden: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false } },

        ],
        pager: "#jqpCounterAddon",
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
        forceFit: true,
        caption: localization.CounterAddon,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',

        loadComplete: function (data) {
            fnJqgridSmallScreen("jqgCounterAddon");
        },
    }).jqGrid('navGrid', '#jqpCounterAddon', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpCounterMappingHeader', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshAddOnToken
    });

    fnAddGridSerialNoHeading();

}

function fnGridRefreshAddOnToken() {
    $("#jqgCounterAddon").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');

}
function fnSaveAddOnToken() {

    $("#jqgCounterAddon").jqGrid('editCell', 0, 0, false);
    var addon_tokens = [];
    var id_list = jQuery("#jqgCounterAddon").jqGrid('getDataIDs');
    for (var i = 0; i < id_list.length; i++) {
        var rowId = id_list[i];
        var rowData = jQuery('#jqgCounterAddon').jqGrid('getRowData', rowId);

        addon_tokens.push({
            BusinessKey: $("#cboBusinessLocation").val(),
            CounterKey: $("#txtCounterKey").val(),
            AddOn: rowData.TokenPrefix,
            ActiveStatus: rowData.ActiveStatus
        });

    }

    $("#btnSaveCounterAddon").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/AddOn/InsertOrUpdateAddOnCounters',
        type: 'POST',
        datatype: 'json',
        data: { obj: addon_tokens },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                //$("#jqgCounterAddon").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
                //fnLoadDocumentsTree();
                fnGridRefreshAddOnToken();
                fnClearFields();
                $("#PopupCounterAddon").modal('hide');
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveCounterAddon").attr("disabled", false);
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveCounterAddon").attr("disabled", false);
        }
    });

}
function fnClearFields() {
    $("#lblBusinessKey").text('');
    $("#lblTokenPrefix").text('');
    $("#lblTokenDescription").text('');
    $("#lblFloor").text('');
    $("#lblCounterNumber").text('');
    $("#txtCounterKey").val('');
}