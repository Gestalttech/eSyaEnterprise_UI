
var _isSubCategoryApplicable = 0;

$(document).ready(function () {
    _isSubCategoryApplicable = 0;
    fnGridLoadItemtoBusinessStores();

    $.contextMenu({
        selector: "#btnItemtoBusinessStores",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditItemtoBusinessStores(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewItemtoBusinessStores(event) } },
        }
    });

    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");

    $('#jstBusinessLocation').jstree({
        'core': {
            'data': [
                
                { "id": "ajson2", "parent": "#", "text": "Location", state: { 'opened': true } },
                { "id": "ajson3", "parent": "ajson2", "text": "Bengaluru" },
                { "id": "ajson4", "parent": "ajson2", "text": "Chennai" },
            ]
        }
    });
    fnTreeSizePopup("#jstBusinessLocation");

    $('#jstStores').jstree({
        'core': {
            'data': [

                { "id": "ajson2", "parent": "#", "text": "Stores", state: { 'opened': true } },
                { "id": "ajson3", "parent": "ajson2", "text": "Inventory Store" },
                { "id": "ajson4", "parent": "ajson2", "text": "Material Store" },
            ]
        }
    });
    
    fnTreeSizePopup("#jstStores");
});



function fnGetItemCategoryByItem(ItemCategory) {
    $("#cboItemCategory").empty().selectpicker('refresh');
    $("#cboItemSubCategory").empty().selectpicker('refresh');

    _isSubCategoryApplicable = 0;
    var ItemGroup = $("#cboItemGroup").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/SKU/GetItemCategory?ItemGroup=' + ItemGroup,
        success: function (result) {
            $("#cboItemCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboItemCategory').append('<option value="' + result[i]["ItemCategory"] + '">' + result[i]["ItemCategoryDesc"] + '</option>');
                }
            }
            $("#cboItemCategory").val(ItemCategory);
            $("#cboItemCategory").selectpicker('refresh');
        }
    });
}

function fnGetItemCategory() {
    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    $("#jqgItemtoBusinessStores").jqGrid("clearGridData");
    $("#cboItemCategory").empty().selectpicker('refresh');
    $("#cboItemSubCategory").empty().selectpicker('refresh');
    _isSubCategoryApplicable = 0;
    var ItemGroup = $("#cboItemGroup").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/SKU/GetItemCategory?ItemGroup=' + ItemGroup,
        success: function (result) {
            $("#cboItemCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $("#cboItemCategory").append($("<option></option>").val(result[i]["ItemCategory"]).html(result[i]["ItemCategoryDesc"]));
                }
            }
            $('#cboItemCategory').val($("#cboItemCategory option:first").val());
            $('#cboItemCategory').selectpicker('refresh');
        }
    });
}

function fnGetItemSubCategory() {

    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    $("#jqgItemtoBusinessStores").jqGrid("clearGridData");
    $("#cboItemSubCategory").empty().selectpicker('refresh');

    _isSubCategoryApplicable = 0;
    var ItemCategory = $("#cboItemCategory").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/SKU/GetItemSubCategory?ItemCategory=' + ItemCategory,
        success: function (result) {
            $("#cboItemSubCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboItemSubCategory").append($("<option></option>").val(result[i]["ItemSubCategory"]).html(result[i]["ItemSubCategoryDesc"]));
                }
                _isSubCategoryApplicable = 1;
            }
            $('#cboItemSubCategory').val($("#cboItemSubCategory option:first").val());
            $('#cboItemSubCategory').selectpicker('refresh');
        }
    });

    if (_isSubCategoryApplicable == 0) {
        fnGridLoadItemtoBusinessStores();
    }
}

function fnItemSubCategoryOnChanges() {
    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    fnGridLoadItemtoBusinessStores();
}

function fnGridLoadItemtoBusinessStores() {
    var ItemGroup = $("#cboItemGroup").val();
    var ItemCategory = $("#cboItemCategory").val();
    var ItemSubCategory = $("#cboItemSubCategory").val();
    var URL = getBaseURL() + '/SKU/GetItemMaster?ItemGroup=' + ItemGroup + '&ItemCategory=' + ItemCategory + '&ItemSubCategory=' + ItemSubCategory;
    $("#jqgItemtoBusinessStores").jqGrid('GridUnload');
    $("#jqgItemtoBusinessStores").jqGrid({
        //url: URL,
        url:'',
        mtype: 'Post',
        datatype: 'local',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ItemCode, localization.Skucode, localization.SkuId, localization.ItemDescription, localization.UnitOfMeasure, localization.PackUnit, localization.PackUnitDesc, localization.PackSize, localization.InventoryClass, localization.ItemClass, localization.ItemSource, localization.ItemCriticality, localization.BarcodeID, localization.Active, localization.Actions],
        colModel: [
            { name: "ItemCode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Skucode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Skuid", width: 70, editable: true, align: 'left', hidden: true },
            { name: "ItemDescription", width: 70, editable: true, align: 'left', hidden: false },
            { name: "UnitOfMeasure", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PackUnit", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "PackUnitDesc", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "PackSize", width: 40, editable: true, align: 'left', hidden: false },
            { name: "InventoryClass", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemClass", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ItemSource", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ItemCriticality", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "BarCodeID", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnItemtoBusinessStores"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpItemtoBusinessStores",
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
        caption: localization.ItemtoBusinessStores,

        loadComplete: function (data) {
            SetGridControlByAction();
        },
        onSelectRow: function (rowid, status, e) {
            var $self = $(this), $target = $(e.target),
                p = $self.jqGrid("getGridParam"),
                rowData = $self.jqGrid("getLocalRow", rowid),
                $td = $target.closest("tr.jqgrow>td"),
                iCol = $td.length > 0 ? $td[0].cellIndex : -1,
                cmName = iCol >= 0 ? p.colModel[iCol].name : "";

            switch (cmName) {
                case "id":
                    if ($target.hasClass("myedit")) {
                        alert("edit icon is clicked in the row with rowid=" + rowid);
                    } else if ($target.hasClass("mydelete")) {
                        alert("delete icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                case "serial":
                    if ($target.hasClass("mylink")) {
                        alert("link icon is clicked in the row with rowid=" + rowid);
                    }
                    break;
                default:
                    break;
            }

        },
    }).jqGrid('navGrid', '#jqpItemtoBusinessStores', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemtoBusinessStores', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGrid('#jqgItemtoBusinessStores')
    }).jqGrid('navButtonAdd', '#jqpItemtoBusinessStores', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddItemtoBusinessStores
    });
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}


function fnGridAddItemtoBusinessStores() {
    fnClearFields();

    if ($("#cboItemGroup").val() === "0" || $("#cboItemGroup").val() === "") {
        fnAlert("w", "EMI_02_00", "UI0147", errorMsg.ItemGroup_E6);
        $('#cboItemGroup').focus();
        return false;
    }
    if ($("#cboItemCategory").val() === "0" || $("#cboItemCategory").val() === "") {
        fnAlert("w", "EMI_02_00", "UI0148", errorMsg.ItemCategory_E7);
        $('#cboItemCategory').focus();
        return false;
    }
    if (_isSubCategoryApplicable == 1 && ($("#cboItemSubCategory").val() === "0" || $("#cboItemSubCategory").val() === "")) {
        fnAlert("w", "EMI_02_00", "UI0149", errorMsg.ItemSubCategory_E8);
        $('#cboItemSubCategory').focus();
        return false;
    }

    $("#btnSaveItem").html(localization.Save);
    $('#PopupItemtoBusinessStores').modal('show');
    $('#PopupItemtoBusinessStores').find('.modal-title').text(localization.AddItem);
    $("input[type=checkbox]").attr('disabled', false);
    fnLoadPortfolioStoreBusinessLinkGrid()
    $("#PopupItemtoBusinessStores").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });
}


function fnEditItemtoBusinessStores(e) {
    var rowid = $("#jqgItemtoBusinessStores").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgItemtoBusinessStores').jqGrid('getRowData', rowid);

    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
        return;
    }
    $('#PopupItemtoBusinessStores').find('.modal-title').text(localization.EditItem);
    $('#PopupItemtoBusinessStores').modal('show');
}
function fnViewItemtoBusinessStores(e) {
    var rowid = $("#jqgItemtoBusinessStores").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgItemtoBusinessStores').jqGrid('getRowData', rowid);

    if (_userFormRole.IsView === false) {
        fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
        return;
    }
    $('#PopupItemtoBusinessStores').modal('show');
    $('#PopupItemtoBusinessStores').find('.modal-title').text(localization.ViewItem);
    $('#PopupItemtoBusinessStores').modal('show');
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



function fnLoadPortfolioStoreBusinessLinkGrid() {

    $("#jqgPortfolioLink").GridUnload();

       $("#jqgPortfolioLink").jqGrid(

            {
                url: '',
                //url: getBaseURL() + "/Stores/GetPortfolioStoreBusinessLinkInfo?BusinessKey=" + $("#cboBusinessLocation").val() + "&StoreCode=" + $("#txtStoreCode").val(),
                datatype: 'local',
                mtype: 'POST',
                contentType: 'application/json; charset=utf-8',
                ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                colNames: [localization.PortfolioId, localization.PortfolioDescription, localization.Active],
                colModel: [
                    { name: "PortfolioId", width: 70, editable: true, align: 'left', hidden: true },
                    { name: 'PortfolioDesc', index: 'StoreClassDescription', width: 270, resizable: false },
                    {
                        name: 'ActiveStatus', index: 'ActiveStatus', width: 70, resizable: false, align: 'center',
                        formatter: "checkbox", formatoptions: { disabled: true },
                        edittype: "checkbox", editoptions: { value: "true:false" }
                    },
                ],
                rowNum: 100000,
                pgtext: null,
                pgbuttons: null,
                loadonce: true,
                rownumWidth:'55',
                pager: "#jqpPortfolioLink",
                viewrecords: false,
                gridview: true,
                rownumbers: true,
                height: 'auto',
                width: 'auto',
                autowidth: true,
                shrinkToFit: true,
                forceFit: true,
                scroll: false, scrollOffset: 0,
                caption: localization.PortfolioLink,
                onSelectRow: function (rowid) {
                    //BusinessKey = $("#jqgBusinessLink").jqGrid('getCell', rowid, 'BusinessKey');

                },
                loadComplete: function (data) {
                    
                },
            })

            .jqGrid('navGrid', '#jqpPortfolioLink', { add: false, edit: false, search: false, del: false, refresh: false })
            .jqGrid('navButtonAdd', '#jqpPortfolioLink', {
                caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGrid("#jqgPortfolioLink")
            });
        fnAddGridSerialNoHeading();
   
}

function fnRefreshGrid(id) {
    $(id).setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

 