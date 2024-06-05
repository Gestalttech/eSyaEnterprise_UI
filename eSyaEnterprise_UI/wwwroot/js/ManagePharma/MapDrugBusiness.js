var prevSelectedID = "";
$(document).ready(function () {

    fnGridLoadMapDrugBusiness();
    fnLoadGridStoreBusinessLink();
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
    
    fnLoadBusinessTree();
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
    $('#PopupMapDrugBusiness').modal('show');
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
    fnLoadBusinessTree(); 
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
$(".modal").on('show.bs.modal', function (e) {
    fnLoadGridStoreBusinessLink();
    fnTreeSizePopup("#jstBusinessLocation");
});


function fnLoadBusinessTree() {
    $("#jstBusinessLocation").jstree('destroy');

    $.ajax({
        url: getBaseURL() + '/Stores/GetAllBusinessLocations',
        type: 'Post',
        datatype: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $("#jstBusinessLocation").jstree('destroy');
            $("#jstBusinessLocation").jstree({ core: { data: result, multiple: false } });
            fnTreeSize("#jstBusinessLocation");
            $('#jstBusinessLocation').css('display', 'block');

            $(window).on('resize', function () {
                fnTreeSize("#jstBusinessLocation");
            })
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#dvBusinessDocument").css('display', 'none');
        }
    });

    $("#jstBusinessLocation").on('loaded.jstree', function () {
        $("#jstBusinessLocation").jstree()._open_to(prevSelectedID);
        $('#jstBusinessLocation').jstree().select_node(prevSelectedID);
    });

    $('#jstBusinessLocation').on("changed.jstree", function (e, data) {

        if (data.node != undefined) {
            if (prevSelectedID != data.node.id) {
                prevSelectedID = data.node.id;

                var parentNode = $("#jstBusinessLocation").jstree(true).get_parent(data.node.id);

                if (parentNode == "FM") {

                    businesskey = data.node.id;
                    $("#jqgLinkedStores").show();
                    fnLoadGridStoreBusinessLink(businesskey);
                }
                else {
                    $("#dvBusinessDocument").css('display', 'none');
                }

            }
        }
    });
    $('#jstBusinessLocation').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstBusinessLocation').jstree().deselect_node(closingNode.children);
    });
}

function fnLoadGridStoreBusinessLink() {
   
    $("#jqgLinkedStores").GridUnload();
    $("#jqgLinkedStores").jqGrid(
        {
            url: '',
            mtype: 'Post',
            datatype: 'local',
            contentType: 'application/json; charset=utf-8',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: [localization.BusinessKey, localization.ItemCode, localization.StoreCode, localization.StoreDesc, localization.Active],
            colModel: [
                { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
                { name: "ItemCode", width: 70, editable: true, align: 'left', hidden: true },
                { name: "StoreCode", width: 70, editable: true, align: 'left', hidden: true },
                { name: "StoreDesc", width: 170, resizable: false,hidden:false },
                {
                    name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center', editable: true,
                    formatter: "checkbox", formatoptions: { disabled: false },
                    edittype: "checkbox", editoptions: { value: "true:false" }
                },
            ],
            rowNum: 100000,
            pgtext: null,
            pgbuttons: null,
            loadonce: true,
            rownumWidth: '55',
            pager: "#jqpLinkedStores",
            viewrecords: false,
            gridview: true,
            rownumbers: true,
            height: 'auto',
            width: 'auto',
            autowidth: true,
            shrinkToFit: true,
            forceFit: true,
            scroll: false, scrollOffset: 0,
            caption: localization.LinkedStores,
            onSelectRow: function (rowid) {

               /* fnLoadPortfolioStoreBusinessLinkGrid();*/
            },
            loadComplete: function (data) {
                $('.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-hdiv,.ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-bdiv,.ui-jqgrid-pager').css('width', 100 + '%');
            },
        }).jqGrid('navGrid', '#jqpLinkedStores', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpLinkedStores', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGrid("#jqgLinkedStores")
        });
    fnAddGridSerialNoHeading();
}

function fnRefreshGrid(id) {
    $(id).setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}
