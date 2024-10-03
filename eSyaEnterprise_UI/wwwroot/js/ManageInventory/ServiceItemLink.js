var prevSelectedID;
var ServiceId = '0';
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
$(document).ready(function () {
    $("#pnlServiceItemLink").hide();
});

function fnLoadServiceLink() {
    
    $('#jstServiceItemLink').jstree('destroy');
    if ($('#cboBusinessKey').val() === '')
        return;
    if ($('#cboServiceClass').val() === '')
        return;
    $('#pnlServiceItemLink').hide();
    fnCreateServiceTree();
}

function fnCreateServiceTree() {
    var BusinessKey = $("#cboBusinessKey").val();
    var ServiceClass = $("#cboServiceClass").val();

    $.ajax({
        url: getBaseURL() + '/Item/GetServiceItemLinkTree?BusinessKey=' + BusinessKey + '&ServiceClassId=' + ServiceClass,
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            
            $('#jstServiceItemLink').jstree({
                core: { 'data': result, 'check_callback': true, 'multiple': true }
            });
        }
    });

    $("#jstServiceItemLink").on('loaded.jstree', function () {
        $("#jstServiceItemLink").jstree('open_all');
    });

    $('#jstServiceItemLink').on("changed.jstree", function (e, data) {
        if (data.node !== undefined) {
            if (prevSelectedID !== data.node.id) {
                prevSelectedID = data.node.id;
                $('#View').remove();
                $('#Edit').remove();
                ServiceId = '0';
                if (data.node.parent === "FM") {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#555555"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#555555"aria-hidden="true"></i></span>');

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#pnlServiceItemLink').hide();
                            fnAlert("w", "EMI_03_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        ServiceId = data.node.id;
                        fnGridLoadServiceItemLink(ServiceId);

                        $(".mdl-card__title-text").text(localization.ViewItem);
                        $("#btnSaveServiceItem").hide();
                        $("#pnlServiceItemLink").show();
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#pnlServiceItemLink').hide();
                            fnAlert("w", "EMI_03_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        ServiceId = data.node.id;
                        fnGridLoadServiceItemLink(ServiceId);

                        $(".mdl-card__title-text").text(localization.EditItem);
                        $("#btnSaveServiceItem").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        $("#btnSaveServiceItem").attr("disabled", _userFormRole.IsEdit === false);  
                        $("#pnlServiceItemLink").show();
                        $("#btnSaveServiceItem").show();
                    });
                }
                else {
                    $("#pnlServiceItemLink").hide();
                }
            }
        }
    });
}

function fnGridLoadServiceItemLink(ServiceId) {

    var BusinessKey = $("#cboBusinessKey").val();
    var ServiceClass = $("#cboServiceClass").val();

    var URL = getBaseURL() + '/Item/GetServiceItemLinkInfo?BusinessKey=' + BusinessKey + '&ServiceClass=' + ServiceClass + '&ServiceId=' + ServiceId;

    $("#jqgServiceItemLink").jqGrid('GridUnload');
    $("#jqgServiceItemLink").jqGrid({
        url: URL,
        datatype: 'json',
        mtype: 'Post',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.ServiceClass, localization.ServiceId, localization.SKUID, localization.SKUType, localization.ItemDescription,localization.Quantity, localization.Active],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, align: 'left', hidden: true },
            { name: "ServiceClass", width: 70, editable: false, align: 'left', hidden: true },
            { name: "ServiceID", width: 70, editable: false, align: 'left', hidden: true },
            { name: "SKUID", width: 70, editable: false, align: 'left', hidden: true },
            { name: "SKUType", width: 70, editable: false, align: 'left', hidden: true },
            { name: "ItemDescription", width: 270, editable: false, align: 'left', hidden: false },
            {
                name: 'Quantity', index: 'Quantity', editable: true, edittype: "text", width: 150,
                editoptions: { maxlength: 10, onkeypress: 'return CheckDigits(event)' }
            },
            { name: "ActiveStatus", editable: false, width: 100, align: 'center', hidden: true, resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
        ],
        rowNum: 10,
        rowList: [10, 20, 30, 50],
        emptyrecords: "No records to Veiw",
        pager: "#jqpServiceItemLink",
        viewrecords: true,
        gridview: true,
        rownumbers: false,
        height: 'auto',
        width: 'auto',
        scroll: false,
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        loadonce: true,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        loadComplete: function (data) {
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpServiceItemLink', { add: false, edit: false, search: false, del: false, refresh: false });
}

function fnSaveServiceItemLink() {
    //debugger;
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $('#cboBusinessKey').val() == '0') {
        fnAlert("w", "EMI_03_00", "UI0064", errorMsg.BusinessLocation_E4);
        return;
    }
    if (IsStringNullorEmpty($("#cboServiceClass").val()) || $('#cboServiceClass').val() == '0') {
        fnAlert("w", "EMI_03_00", "UI0332", errorMsg.serviceclass_E5);
        return;
    }
    if (ServiceId == '0') {
        fnAlert("w", "EMI_03_00", "UI0333", errorMsg.service_E6);
        return;
    }
    $("#jqgServiceItemLink").jqGrid('editCell', 0, 0, false);
    var r_doc = [];
    var ids = '';
    ids = jQuery("#jqgServiceItemLink").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgServiceItemLink').jqGrid('getRowData', rowId);

        r_doc.push({
            BusinessKey: rowData.BusinessKey,
            ServiceClass: rowData.ServiceClass,
            ServiceID: rowData.ServiceID,
            SKUID: rowData.SKUID,
            SKUType: rowData.SKUType,
            Quantity: rowData.Quantity,
        });
    }

    if (r_doc.length <= 0) {
        fnAlert("w", "EMI_03_00", "UI0334", errorMsg.gridItem_E7);
        return;
    }

    $("#btnSaveServiceItem").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Item/InsertOrUpdateServiceItemLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: r_doc },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveServiceItem").attr('disabled', false);
                fnRefreshGridData();
                $('#btnSaveServiceItem').modal('hide');
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnSaveServiceItem").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveServiceItem").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $('#cboBusinessKey').val('');
    $('#cboBusinessKey').selectpicker('refresh');
    $('#cboServiceClass').val('');
    $('#cboServiceClass').selectpicker('refresh');
    
    $('#jstServiceItemLink').jstree('destroy');
}

function fnExpandAll() {
    $('#jstServiceItemLink').jstree('open_all');
}

function fnCollapseAll() {
    $("#pnlServiceItemLink").hide();
    $('#jstServiceItemLink').jstree('close_all');
}

function fnRefreshGridData() {
    $("#jstServiceItemLink").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnRefreshGrid(id) {
    $(id).setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

