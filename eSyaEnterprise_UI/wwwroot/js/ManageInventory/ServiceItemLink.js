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
    $("#dvServiceItemLink").hide();
    //fnGridLoadServiceItemLink();

    //$('#jstServiceItemLink').jstree({
    //    'core': {
    //        'data': [

    //            { "id": "ajson2", "parent": "#", "text": "Services", state: { 'opened': true } },
    //            { "id": "ajson3", "parent": "ajson2", "text": "O.P Doctor Consultation(Clinic) - New" },
    //            { "id": "ajson4", "parent": "ajson2", "text": "O.P Doctor Consultation(Clinic) - Established" },
    //            { "id": "ajson5", "parent": "ajson2", "text": "O.P Doctor Consultation(Clinic) - Revisit" },
    //            { "id": "ajson6", "parent": "ajson2", "text": "O.P Doctor Consultation(Clinic) - Followup" },
    //        ]
    //    }
    //});
    //fnTreeSize("#jstServiceItemLink");
});

function fnLoadServiceLink() {
    
    $('#jstServiceItemLink').jstree('destroy');
    if ($('#cboBusinessKey').val() === '')
        return;
    if ($('#cboServiceClass').val() === '')
        return;
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
                //$("#dvServiceItemLink").Show();
                if (data.node.parent === "FM") {
                    //if (data.node.id.startsWith("N")) {
                    //    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Add" style="padding-left:10px;padding-right:10px">&nbsp;<i class="fa fa-plus" style="color:#337ab7"aria-hidden="true"></i></span>');
                    //    $('#Add').on('click', function () {
                    //        fnGridLoadServiceItemLink(data.node.id);
                    //        $(".mdl-card__title-text").text(localization.AddSpecialtyLink);
                    //        $("#btnSaveServiceItem").html('<i class="fa fa-plus"></i> ' + localization.Save);
                    //        $("#btnSaveServiceItem").attr("disabled", _userFormRole.IsInsert === false);
                    //        $("#dvServiceItemLink").show();
                    //        $("#btnSaveServiceItem").show();
                    //    });
                    //}
                    //else {
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="View" style="padding-left:10px">&nbsp;<i class="fa fa-eye" style="color:#337ab7"aria-hidden="true"></i></span>');
                    $('#' + data.node.id + "_anchor").html($('#' + data.node.id + "_anchor").html() + '<span id="Edit" style="padding-left:10px">&nbsp;<i class="fa fa-pen" style="color:#337ab7"aria-hidden="true"></i></span>');

                    $('#View').on('click', function () {
                        if (_userFormRole.IsView === false) {
                            $('#dvServiceItemLink').hide();
                            fnAlert("w", "ECP_05_00", "UIC03", errorMsg.vieweauth_E3);
                            return;
                        }
                        ServiceId = data.node.id;
                        fnGridLoadServiceItemLink(ServiceId);

                        $(".mdl-card__title-text").text(localization.ViewItem);
                        $("#btnSaveServiceItem").hide();
                        $("#dvServiceItemLink").show();
                    });

                    $('#Edit').on('click', function () {
                        if (_userFormRole.IsEdit === false) {
                            $('#dvServiceItemLink').hide();
                            fnAlert("w", "ECP_05_00", "UIC02", errorMsg.editauth_E2);
                            return;
                        }
                        ServiceId = data.node.id;
                        fnGridLoadServiceItemLink(ServiceId);

                        $(".mdl-card__title-text").text(localization.EditItem);
                        $("#btnSaveServiceItem").html('<i class="fa fa-sync"></i> ' + localization.Update);
                        $("#btnSaveServiceItem").attr("disabled", _userFormRole.IsEdit === false);
                        $("#dvServiceItemLink").show();
                        $("#btnSaveSpecialty").show();
                    });
                    //}
                }
                else {
                    $("#dvServiceItemLink").hide();
                    fnClearFields();
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
        mtype: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.ServiceClass, localization.ServiceId, localization.SKUID, localization.ItemDescription,localization.Quantity, localization.Active],
        colModel: [
            { name: "BusinessKey", width: 70, editable: false, align: 'left', hidden: true },
            { name: "ServiceClass", width: 70, editable: false, align: 'left', hidden: true },
            { name: "ServiceID", width: 70, editable: false, align: 'left', hidden: true },
            { name: "SKUID", width: 70, editable: false, align: 'left', hidden: true },
            { name: "ItemDescription", width: 270, editable: false, align: 'left', hidden: false },
            //{ name: "Quantity", width: 90, editable: true, align: 'left', hidden: false, disabled: false },
            {
                name: 'Quantity', index: 'Quantity', editable: true, edittype: "text", width: 150,
                editoptions: { maxlength: 10, onkeypress: 'return CheckDigits(event)' }
            },
            { name: "ActiveStatus", editable: false, width: 100, align: 'center', hidden: true, resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            //{
            //    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center', editable: true,
            //    formatter: "checkbox", formatoptions: { disabled: false },
            //    edittype: "checkbox", editoptions: { value: "true:false" }
            //},
        ],
        pager: "#jqpServiceItemLink",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth: 55,
        loadonce: true,
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        scrollOffset: 0,
        cellEdit: true,
        editurl: 'url',
        cellsubmit: 'clientArray',
        caption: localization.ServiceItemLink,
        loadComplete: function (data) {
            //SetGridControlByAction();
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpServiceItemLink', { add: false, edit: false, search: false, del: false, refresh: false });
    //}).jqGrid('navGrid', '#jqpServiceItemLink', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpServiceItemLink', {
    //    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGrid('#jqgServiceItemLink')
    //});
    //fnAddGridSerialNoHeading();
}

//function SetGridControlByAction() {
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }

//}


function fnSaveServiceItemLink() {
    if (IsStringNullorEmpty($("#cboBusinessKey").val()) || $('#cboBusinessKey').val() == '0') {
        fnAlert("w", "EMI_03_00", "UI0064", errorMsg_cr.BusinessLocation_E2);
        return;
    }
    if (IsStringNullorEmpty($("#cboServiceClass").val()) || $('#cboServiceClass').val() == '0') {
        fnAlert("w", "EMI_03_00", "UI0064", errorMsg_cr.BusinessLocation_E2);
        return;
    }
    if (ServiceId == '0') {
        fnAlert("w", "EMI_03_00", "UI0064", errorMsg_cr.BusinessLocation_E2);
        return;
    }
    $("#jqpServiceItemLink").jqGrid('editCell', 0, 0, false);
    var r_doc = [];
    var ids = jQuery("#jqpServiceItemLink").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqpServiceItemLink').jqGrid('getRowData', rowId);

        r_doc.push({
            BusinessKey: rowData.BusinessKey,
            ServiceClass: rowData.ItemCode,
            ServiceId: rowData.StoreCode,
            Skuid: rowData.Skuid,
            Skutype: rowData.Skutype,
            Quantity: rowData.Quantity,
            ActiveStatus: rowData.ActiveStatus
        });
    }

    if (r_doc.length <= 0) {
        fnAlert("w", "EMI_03_00", "UI0308", errorMsg.Documentcontrol_E3);
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
    //eSyaParams.ClearValue();
}


function fnRefreshGrid(id) {
    $(id).setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

