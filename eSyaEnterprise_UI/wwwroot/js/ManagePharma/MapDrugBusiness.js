$(document).ready(function () {

    fnGridLoadMapDrugBusiness();

    $.contextMenu({
        selector: "#btnMapDrugBusiness",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditMapDrugBusiness(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewMapDrugBusiness(event) } },
        }
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});



function fnGridLoadMapDrugBusiness() {

    $("#jqgMapDrugBusiness").jqGrid('GridUnload');
    $("#jqgMapDrugBusiness").jqGrid({
        //url: URL,
        url: '',
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.CompositionID, localization.FormulationID, localization.TradeID, localization.TradeName, localization.PackSize, localization.Packing, localization.ManufacturerID, localization.ISDCode, localization.BarCodeID, localization.Active, localization.Actions],
        colModel: [
            { name: "CompositionID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "FormulationID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "TradeID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "TradeName", width: 170, editable: true, align: 'left', hidden: false },
            { name: "PackSize", width: 40, editable: true, align: 'left', hidden: false },
            { name: "Packing", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ManufacturerID", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ISDCode", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "BarCodeID", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnMapDrugBusiness"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpMapDrugBusiness",
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
        caption: localization.MapDrugBusiness,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
        onSelectRow: function (rowid, status, e) {

        },
    }).jqGrid('navGrid', '#jqpMapDrugBusiness', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpMapDrugBusiness', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshMapDrugBusiness
    }) 
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}
 
function fnGridRefreshMapDrugBusiness() {
    $("#jqgMapDrugBusiness").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditMapDrugBusiness(e) {

    var rowid = $("#jqgMapDrugBusiness").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMapDrugBusiness').jqGrid('getRowData', rowid);

    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
        return;
    }
    $("#btnSaveMapDrugBusiness").html(localization.Update);
    $('#PopupMapDrugBusiness').find('.modal-title').text(localization.EditMapDrugBusiness);
    $('#PopupMapDrugBusiness').modal('show');
        
    eSyaParams.ClearValue();
    $.ajax({
        url:'',
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response != null) {
                eSyaParams.ClearValue();
                eSyaParams.SetJSONValue(response.l_FormParameter);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });

    $("#btnSaveMapDrugBusiness").attr('disabled', false);
}

function fnViewMapDrugBusiness(e) {
    var rowid = $("#jqgMapDrugBusiness").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgMapDrugBusiness').jqGrid('getRowData', rowid);

    if (_userFormRole.IsView === false) {
        fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
        return;
    }
    $('#PopupMapDrugBusiness').modal('show');
    $('#PopupMapDrugBusiness').find('.modal-title').text(localization.ViewMapDrugBusiness);
    $('#PopupMapDrugBusiness').modal('show');

    

    eSyaParams.ClearValue();
    $.ajax({
        url:'',
        type: 'POST',
        datatype: 'json',
        success: function (response) {
            if (response != null) {
                eSyaParams.SetJSONValue(response.l_FormParameter);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);

        }
    });

    $("#btnSaveMapDrugBusiness").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("#PopupMapDrugBusiness").on('hidden.bs.modal', function () {
        $("#btnSaveMapDrugBusiness").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
    })
}

function fnSaveMapDrugBusiness() {

     


}

function fnClearFields() {
     eSyaParams.ClearValue();
}

function fnValidateMapDrugBusiness() {

    

}

