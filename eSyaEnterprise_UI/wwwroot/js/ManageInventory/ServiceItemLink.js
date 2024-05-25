var prevSelectedID;

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
                $('#Add').remove();
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
                        fnGridLoadServiceItemLink(data.node.id);

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
                        fnGridLoadServiceItemLink(data.node.id);

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
   
   
    $("#jqgServiceItemLink").jqGrid('GridUnload');
    $("#jqgServiceItemLink").jqGrid({
        //url: URL,
        url: '',
        mtype: 'Post',
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.BusinessKey, localization.ServiceClass, localization.ServiceID, localization.ItemDescription,localization.Quantity, localization.Active],
        colModel: [
            { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ServiceClass", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ServiceID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ItemDescription", width: 270, editable: true, align: 'left', hidden: false },
            { name: "Quantity", width: 90, editable: true, align: 'left', hidden: false },
            { name: "ActiveStatus", editable: false, width: 100, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },

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
        caption: localization.ServiceItemLink,
        loadComplete: function (data) {
            SetGridControlByAction();
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        },
        onSelectRow: function (rowid, status, e) {
        },
    }).jqGrid('navGrid', '#jqpServiceItemLink', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpServiceItemLink', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGrid('#jqgServiceItemLink')
    });
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}


function fnGridAddItemtoBusinessStores() {
    fnClearFields();
    fnLoadGridStoreBusinessLink();
    $("#btnSaveItem").html(localization.Save);
    $('#PopupItemtoBusinessStores').modal('show');
    $('#PopupItemtoBusinessStores').find('.modal-title').text(localization.AddItem);
    $("input[type=checkbox]").attr('disabled', false);
   
    $("#PopupItemtoBusinessStores").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });
}


function fnClearFields() {
    $("#txtItemCode").val('');
    $("#txtSkuCode").val('');
    $("#txtSkuId").val('');
    $('#txtItemDescription').val('');
    $('#cboUnitOfMeasure').val('');
    $('#cboUnitOfMeasure').selectpicker('refresh');
    $('#txtPackSize').val('');
    $('#cboInventoryClass').val('');
    $('#cboInventoryClass').selectpicker('refresh');
    $('#cboItemClass').val('');
    $('#cboItemClass').selectpicker('refresh');
    $('#cboItemSource').val('');
    $('#cboItemSource').selectpicker('refresh');
    $('#cboItemCriticality').val('');
    $('#cboItemCriticality').selectpicker('refresh');
    $('#txtBarCodeID').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    //eSyaParams.ClearValue();
}


function fnRefreshGrid(id) {
    $(id).setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

