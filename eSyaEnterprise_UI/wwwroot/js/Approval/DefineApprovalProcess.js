var actiontype = "";
var _isInsert = true;

$(function () {
    fnLoadGridLevelBasedApproval();
    fnLoadGridValueBasedApproval();
    $("#txtEffectiveTill").datepicker({
        minDate: 0,
        dateFormat: _cnfDateFormat,
    });
    $("#txtEffectiveFrom").datepicker({
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


function fnLoadGridLevelBasedApproval() {

    $("#jqgLevelBasedApproval").GridUnload();

    $("#jqgLevelBasedApproval").jqGrid({
        url: getBaseURL() + '//',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.LevelId, localization.LevelDesc, localization.Active],
        colModel: [
            { name: "LevelId", width: 250, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: true },
            { name: "LevelDesc", width: 180, align: 'left', editable: true, editoptions: { maxlength: 150 }, resizable: false },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: false }, },
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

function fnLoadGridValueBasedApproval() {

    $("#jqgValueBasedApproval").GridUnload();

    $("#jqgValueBasedApproval").jqGrid({
        url: getBaseURL() + '',
        datatype: 'json',
        mtype: 'POST',
        contentType: 'application/json; charset=utf-8',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        colNames: [localization.ValueFrom, localization.ValueTo, localization.EffectiveFrom, localization.EffectiveTill, localization.Active, localization.Actions],
        colModel: [
            { name: "ValueFrom", width: 30, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            { name: "ValueTo", width: 30, align: 'left', editable: true, editoptions: { maxlength: 10 }, resizable: false, hidden: false },
            {
                name: "EffectiveFrom", index: 'FromDate', width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            {
                name: "EffectiveTill", index: 'FromTill', width: 40, hidden: false, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }
            },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
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
}

function fnGridRefreshValueBasedApproval() {
    $("#jqgValueBasedApproval").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}