var actiontype = "";
var _isInsert = true;

$(function () {
    fnLoadGridLevelBasedApproval();
    fnLoadGridValueBasedApproval();
    $("#txtAPEffectiveFrom").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $("#txtAPEffectiveTill").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $.contextMenu({
        selector: "#btnValueBasedApproval",
        trigger: 'left',
         items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditValueBasedApproval('edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditValueBasedApproval('view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditValueBasedApproval('delete') } },
        }
       
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});



/* Dropdown change function starts */
function fnOnChangeApproval() {
    var _approvalType = $("#cboApprovalType").val();
    if (_approvalType == "l") {
        $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        $("#secValueBasedApproval").hide();
        $("#secLevelBasedApproval").show();
    }
    if (_approvalType == "v") {
        $("#secLevelBasedApproval").hide();
        $("#secValueBasedApproval").show();
        $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
        fnLoadGridLevelBasedApproval_popup();
    }
    if (_approvalType == "0" || _approvalType == 0) {
        $("#secValueBasedApproval").hide(); $("#secLevelBasedApproval").hide();
    }
}

/* Dropdown change function ends */




/* Jstree starts*/ 
function fnLoadFormsTree() {
    $.ajax({

        url: getBaseURL() + '/Engine/GetFormForStorelinking',
        type: 'POST',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (result) {
            $("#jstApprovalProcess").jstree({ core: { data: result, multiple: false } });
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
        }
    });

    $("#jstApprovalProcess").on('loaded.jstree', function () {
        $("#jstApprovalProcess").jstree()._open_to(prevSelectedID);
        $('#jstApprovalProcess').jstree().select_node(prevSelectedID);
    });

    $('#jstApprovalProcess').on("changed.jstree", function (e, data) {
        FormID = "";
        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstApprovalProcess").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    $("#lblSelectedFormName").text(data.node.text);
                    FormID = data.node.id;
                    
                    $("#pnlApprovalProcess").css('display', 'block');
                }
                else {
                    $("#pnlApprovalProcess").css('display', 'none');
                }

            }
        }
    });
    $('#jstApprovalProcess').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstApprovalProcess').jstree().deselect_node(closingNode.children);
    });
}
/* Jstree ends*/ 
function fnClearApprovalProcess() {

}

/*Level Based Approval Starts*/
function fnLoadGridLevelBasedApproval() {

    $("#jqgLevelBasedApproval").GridUnload();

    $("#jqgLevelBasedApproval").jqGrid({
        url:'',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.LevelId, localization.LevelDescription, localization.Active],
        colModel: [
            { name: "LevelId", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "LevelDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 110, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false }, },
        ],
        pager: "#jqpLevelBasedApproval",
        rowNum: 10,
        sortable: false,
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
        forceFit: true, caption: localization.LevelBasedApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgLevelBasedApproval");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');

        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpLevelBasedApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpLevelBasedApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshLevelBasedApproval
    });

   
    fnAddGridSerialNoHeading();
}
function fnGridRefreshLevelBasedApproval() {
    $("#jqgLevelBasedApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

/*Level Based Approval Ends*/

/*Value Based Approval Starts*/
function fnLoadGridValueBasedApproval() {

    $("#jqgValueBasedApproval").GridUnload();

    $("#jqgValueBasedApproval").jqGrid({
        url: '',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ValueFrom, localization.ValueTo, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "ValueFrom", width:100, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ValueTo", width:100, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            {
                name: "EffectiveFrom", index: 'FromDate', width: 80, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", index: 'FromTill', width:80, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 55, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 55, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnValueBasedApproval"><i class="fa fa-ellipsis-v"></i></button>'
                }
            }, ],
        pager: "#jqpValueBasedApproval",
        rowNum: 10,
        sortable: false,
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
        forceFit: true, caption: localization.ValueBasedApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgValueBasedApproval");
        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpValueBasedApproval', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpValueBasedApproval', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshValueBasedApproval
    }).jqGrid('navButtonAdd', '#jqpValueBasedApproval', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddValueBasedApproval
    });

  
    fnAddGridSerialNoHeading();
}


function fnAddValueBasedApproval() {
    $("#PopupApprovalProcess").modal('show');
    $("#chkAPActiveStatus").parent().addClass("is-checked");
    $("#chkAPActiveStatus").prop('disabled', true);
    $("#btnDeactiveApprovalProcess").hide();
}

function fnEditValueBasedApproval() {
    var rowid = $("#jqgValueBasedApproval").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgValueBasedApproval').jqGrid('getRowData', rowid);
    if (rowData.ActiveStatus == 'true') {
        $("#chkAPActiveStatus").parent().addClass("is-checked");
     }
    else {
        $("#chkAPActiveStatus").parent().removeClass("is-checked");
    }
    if (actiontype.trim() == "edit") {
        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EAP_01_00", "UIC02", errorMsg.editauth_E2);
            return;
        }
        $('#PopupApprovalProcess').modal('show');
        $('#PopupApprovalProcess').find('.modal-title').text(localization.EditValueBasedApproval);
        $("#chkActiveStatus").prop('disabled', true);
    }

    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EAP_01_00", "UIC03", errorMsg.vieweauth_E3);
            return;
        }
        $('#PopupApprovalProcess').modal('show');
        $('#PopupApprovalProcess').find('.modal-title').text(localization.ViewValueBasedApproval);
        $("#chkActiveStatus").prop('disabled', true);
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EAP_01_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupApprovalProcess').modal('show');
        $('#PopupApprovalProcess').find('.modal-title').text(localization.DeactivateValueBasedApproval);
        $("#chkActiveStatus").prop('disabled', true);
    }
}

function fnGridRefreshValueBasedApproval() {
    $("#jqgValueBasedApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');

    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}


function fnClearApproval() {
    $("#chkAPActiveStatus").parent().addClass("is-checked");
    $("#chkAPActiveStatus").prop('disabled', true);
}

/*Value Based Approval Ends*/

/* For Popup -  Level Based Approval grid Starts */
function fnLoadGridLevelBasedApproval_popup() {

    $("#jqgLevelBasedApproval_popup").GridUnload();

    $("#jqgLevelBasedApproval_popup").jqGrid({
        url: '',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.LevelId, localization.LevelDescription, localization.Active],
        colModel: [
            { name: "LevelId", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "LevelDesc", width: 300, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 120, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false }, },
        ],
        pager: "#jqpLevelBasedApproval_popup",
        rowNum: 10,
        sortable: false,
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
        forceFit: true, caption: localization.LevelBasedApproval,
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgLevelBasedApproval_popup");
            $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');

        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpLevelBasedApproval_popup', { add: false, edit: false, search: false, del: false, refresh: false, refreshtext: 'Reload' }).jqGrid('navButtonAdd', '#jqpLevelBasedApproval_popup', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshLevelBasedApproval_popup
    });
    fnAddGridSerialNoHeading();
}

function fnGridRefreshLevelBasedApproval_popup() {
    $("#jqgLevelBasedApproval_popup").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}


$("#PopupApprovalProcess").on('shown.bs.modal', function () {
    $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
})
/* Level Based Approval grid Ends */