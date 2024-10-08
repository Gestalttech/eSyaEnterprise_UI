﻿
var _isSubCategoryApplicable = 0;

$(document).ready(function () {
    _isSubCategoryApplicable = 0;
    fnGridLoadItemMaster();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnItemMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditItemMaster(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewItemMaster(event) } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
});

function fnGetItemDetails() {
    $('#cboItemGroup').val('');
    $('#cboItemGroup').selectpicker('refresh');
    $('#cboItemCategory').val('');
    $('#cboItemCategory').selectpicker('refresh');
    $('#cboItemSubCategory').val('');
    $('#cboItemSubCategory').selectpicker('refresh');
    $("#jqgItemMaster").jqGrid("clearGridData");
    var ItemCode = $("#cboItemDesc").val();

    var URL = getBaseURL() + '/SKU/GetItemDetails?ItemCode=' + ItemCode
    $.ajax({
        type: 'POST',
        url: URL,
        success: function (result) {
            if (result.length > 0) {
                $("#cboItemGroup").val(result[0]["ItemGroup"]);
                $("#cboItemGroup").selectpicker('refresh');

                fnGetItemCategoryByItem(result[0]["ItemCategory"]);

                fnGetItemSubCategoryByItem(result[0]["ItemCategory"], result[0]["ItemSubCategory"]);

                $("#jqgItemMaster").jqGrid('GridUnload');
                $("#jqgItemMaster").jqGrid({
                    url: URL,
                    mtype: 'Post',
                    datatype: 'json',
                    ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
                    jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
                    colNames: [localization.ItemCode, localization.Skucode, localization.SkuId, localization.ItemDescription, localization.UnitOfMeasure, localization.PackSize, localization.InventoryClass, localization.ItemClass, localization.ItemSource, localization.ItemCriticality, localization.BarcodeID, localization.Active, localization.Actions],
                    colModel: [
                        { name: "ItemCode", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "Skucode", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "Skuid", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "ItemDescription", width: 70, editable: true, align: 'left', hidden: false },
                        { name: "UnitOfMeasure", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
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
                                return '<button class="mr-1 btn btn-outline" id="btnItemMaster"><i class="fa fa-ellipsis-v"></i></button>'
                            }
                        },
                    ],
                    pager: "#jqpItemMaster",
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
                    forceFit: true,
                    scrollOffset: 0,
                    caption: localization.ItemMaster,
                    loadComplete: function (data) {
                        SetGridControlByAction();
                        fnAddGridSerialNoHeading();
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

                }).jqGrid('navGrid', '#jqpItemMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemMaster', {
                    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshItemMaster
                }).jqGrid('navButtonAdd', '#jqpItemMaster', {
                    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddItemMaster
                });
            }
            else
                jqgItemMaster.jqGrid().trigger('reloadGrid', [{ page: 1 }]);
        }
    });
}

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

function fnGetItemSubCategoryByItem(ItemCategory, ItemSubCategory) {
    $("#cboItemSubCategory").empty().selectpicker('refresh');
    _isSubCategoryApplicable = 0;

    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/SKU/GetItemSubCategory?ItemCategory=' + ItemCategory,
        success: function (result) {
            $("#cboItemSubCategory").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboItemSubCategory').append('<option value="' + result[i]["ItemSubCategory"] + '">' + result[i]["ItemSubCategoryDesc"] + '</option>');
                }
                _isSubCategoryApplicable = 1;
            }
            $("#cboItemSubCategory").val(ItemSubCategory);
            $("#cboItemSubCategory").selectpicker('refresh');
            }
    });
}
    
function fnGetItemCategory() {
    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    $("#jqgItemMaster").jqGrid("clearGridData");
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
    $("#jqgItemMaster").jqGrid("clearGridData");
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
        fnGridLoadItemMaster();
    }
}

function fnItemSubCategoryOnChanges() {
    $('#cboItemDesc').val(0);
    $('#cboItemDesc').selectpicker('refresh');
    fnGridLoadItemMaster();
}

function fnGridLoadItemMaster() {
    var ItemGroup = $("#cboItemGroup").val();
    var ItemCategory = $("#cboItemCategory").val();
    var ItemSubCategory = $("#cboItemSubCategory").val();
    var URL = getBaseURL() + '/SKU/GetItemMaster?ItemGroup=' + ItemGroup + '&ItemCategory=' + ItemCategory + '&ItemSubCategory=' + ItemSubCategory;
    $("#jqgItemMaster").jqGrid('GridUnload');
    $("#jqgItemMaster").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
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
            //{
            //    name: 'Action', search: false, align: 'left', width: 60, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditItemMaster(event)"><i class="fas fa-pen"></i> ' + localization.Edit + ' </button><button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" onclick="return fnViewItemMaster(event)"><i class="far fa-eye"></i> ' + localization.View + ' </button>'

            //    }
            //},
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnItemMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpItemMaster",
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
        caption: localization.ItemMaster,

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
    }).jqGrid('navGrid', '#jqpItemMaster', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpItemMaster', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshItemMaster
    }).jqGrid('navButtonAdd', '#jqpItemMaster', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddItemMaster
    });
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }

}

function fnGridAddItemMaster() {
    fnClearFields();

    if ($("#cboItemGroup").val() === "0" || $("#cboItemGroup").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0147", errorMsg.ItemGroup_E6);
        $('#cboItemGroup').focus();
        return false;
    }
    if ($("#cboItemCategory").val() === "0" || $("#cboItemCategory").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0148", errorMsg.ItemCategory_E7);
        $('#cboItemCategory').focus();
        return false;
    }
    if (_isSubCategoryApplicable == 1 && ($("#cboItemSubCategory").val() === "0" || $("#cboItemSubCategory").val() === "")) {
        fnAlert("w", "EMI_01_00", "UI0149", errorMsg.ItemSubCategory_E8);
        $('#cboItemSubCategory').focus();
        return false;
    }

    $("#btnSaveItem").html(localization.Save);
    $('#PopupItemMaster').modal('show');
    $('#PopupItemMaster').find('.modal-title').text(localization.AddItem);
    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupItemMaster").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });
}

function fnGridRefreshItemMaster() {
    $("#jqgItemMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditItemMaster(e) {

    var rowid = $("#jqgItemMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgItemMaster').jqGrid('getRowData', rowid);

    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
        return;
    }
    $("#btnSaveItem").html(localization.Update);
    $('#PopupItemMaster').find('.modal-title').text(localization.EditItem);
    $('#PopupItemMaster').modal('show');

    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupItemMaster").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });

    $('#txtItemCode').val(rowData.ItemCode);
    $('#txtSkuCode').val(rowData.Skucode);
    $('#txtSkuId').val(rowData.Skuid);
    $('#txtItemDescription').val(rowData.ItemDescription);
    $("#cboUnitOfMeasure").val(rowData.UnitOfMeasure);
    $("#cboUnitOfMeasure").selectpicker('refresh');
    $('#txtPackSize').val(rowData.PackSize);
    $("#cboInventoryClass").val(rowData.InventoryClass.substring(0, 1));
    $("#cboInventoryClass").selectpicker('refresh');
    $("#cboItemClass").val(rowData.ItemClass.substring(0, 1));
    $("#cboItemClass").selectpicker('refresh');
    $("#cboItemSource").val(rowData.ItemSource.substring(0, 1));
    $("#cboItemSource").selectpicker('refresh');
    $("#cboItemCriticality").val(rowData.ItemCriticality.substring(0, 1));
    $("#cboItemCriticality").selectpicker('refresh');
    $('#txtBarCodeID').val(rowData.BarCodeID);
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/SKU/GetItemParameterList?ItemCode=' + $('#txtItemCode').val(),
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

    $("#btnSaveItem").attr('disabled', false);
}

function fnViewItemMaster(e) {
    //var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    //var rowData = $('#jqgItemMaster').jqGrid('getRowData', rowid);
    var rowid = $("#jqgItemMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgItemMaster').jqGrid('getRowData', rowid);

    if (_userFormRole.IsView === false) {
        fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
        return;
    }
    $('#PopupItemMaster').modal('show');
    $('#PopupItemMaster').find('.modal-title').text(localization.ViewItem);
    $('#PopupItemMaster').modal('show');

    $('#txtItemCode').val(rowData.ItemCode);
    $('#txtSkuCode').val(rowData.Skucode);
    $('#txtSkuId').val(rowData.Skuid);
    $('#txtItemDescription').val(rowData.ItemDescription);
    $("#cboUnitOfMeasure").val(rowData.UnitOfMeasure);
    $("#cboUnitOfMeasure").selectpicker('refresh');
    $('#txtPackSize').val(rowData.PackSize);
    $("#cboInventoryClass").val(rowData.InventoryClass.substring(0, 1));
    $("#cboInventoryClass").selectpicker('refresh');
    $("#cboItemClass").val(rowData.ItemClass.substring(0, 1));
    $("#cboItemClass").selectpicker('refresh');
    $("#cboItemSource").val(rowData.ItemSource.substring(0, 1));
    $("#cboItemSource").selectpicker('refresh');
    $("#cboItemCriticality").val(rowData.ItemCriticality.substring(0, 1));
    $("#cboItemCriticality").selectpicker('refresh');
    $('#txtBarCodeID').val(rowData.BarCodeID);

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/SKU/GetItemParameterList?ItemCode=' + $('#txtItemCode').val(),
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

    $("#btnSaveItem").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("#PopupItemMaster").on('hidden.bs.modal', function () {
        $("#btnSaveItem").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
    })
}

function fnSaveItemCreation() {

    if (validateItemMaster() === false) {
        return;
    }

    var ItemCodes;

    $("#btnSaveItem").attr('disabled', true);

    var itemCode = $("#txtItemCode").val();

    if (itemCode == null || itemCode == "") {
        ItemCodes = {
            ItemCode: 0,
            Skucode: 0,
            Skuid: 0,
            ItemGroup: $("#cboItemGroup").val(),
            ItemCategory: $("#cboItemCategory").val(),
            ItemSubCategory: $("#cboItemSubCategory").val(),
            ItemDescription: $("#txtItemDescription").val(),
            UnitOfMeasure: $("#cboUnitOfMeasure").val(),
            PackSize: $("#txtPackSize").val(),
            InventoryClass: $("#cboInventoryClass").val(),
            ItemClass: $("#cboItemClass").val(),
            ItemSource: $("#cboItemSource").val(),
            ItemCriticality: $("#cboItemCriticality").val(),
            BarCodeID: $("#txtBarCodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")

        }
    }
    else {
        ItemCodes = {
            ItemCode: itemCode,
            Skucode: $("#txtSkuCode").val(),
            Skuid: $("#txtSkuId").val(),
            ItemGroup: $("#cboItemGroup").val(),
            ItemCategory: $("#cboItemCategory").val(),
            ItemSubCategory: $("#cboItemSubCategory").val(),
            ItemDescription: $("#txtItemDescription").val(),
            UnitOfMeasure: $("#cboUnitOfMeasure").val(),
            PackSize: $("#txtPackSize").val(),
            InventoryClass: $("#cboInventoryClass").val(),
            ItemClass: $("#cboItemClass").val(),
            ItemSource: $("#cboItemSource").val(),
            ItemCriticality: $("#cboItemCriticality").val(),
            BarCodeID: $("#txtBarCodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }
    }

    //var objPar = [];
    //objPar = eSyaParams.GetValue();

    var fmParams = eSyaParams.GetJSONValue();
    ItemCodes.l_FormParameter = fmParams;

    $.ajax({
        //async: false,
        url: getBaseURL() + '/SKU/InsertOrUpdateItemCodes',
        type: 'POST',
        data: {
            ItemCodes
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveItem").attr('disabled', true);
                $("#btnSaveItem").hide();
                $("#PopupItemMaster").modal('hide');
                fnGridRefreshItemMaster();
                eSyaParams.ClearValue();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveItem").attr('disabled', false);
            $("#btnSaveItem").show();
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveItem").attr("disabled", false);
        }
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
    eSyaParams.ClearValue();
}

function validateItemMaster() {

    if ($("#txtItemDescription").val().trim().length <= 0) {
        fnAlert("w", "EMI_01_00", "UI0150", errorMsg.ItemDesc_E9);
        $('#txtItemDescription').focus();
        return false;
    }
    if ($("#cboUnitOfMeasure").val() === "0" || $("#cboUnitOfMeasure").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0151", errorMsg.UnitOfMeasure_E10);
        $('#cboUnitOfMeasure').focus();
        return false;
    }
   
    if ($("#cboInventoryClass").val() === "0" || $("#cboInventoryClass").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0153", errorMsg.InventoryClass_E12);
        $('#cboInventoryClass').focus();
        return false;
    }
    if ($("#cboItemClass").val() === "0" || $("#cboItemClass").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0154", errorMsg.ItemClass_E13);
        $('#cboItemClass').focus();
        return false;
    }
    if ($("#cboItemSource").val() === "0" || $("#cboItemSource").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0155", errorMsg.ItemSource_E14);
        $('#cboItemSource').focus();
        return false;
    }
    if ($("#cboItemCriticality").val() === "0" || $("#cboItemCriticality").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0156", errorMsg.ItemCriticality_E15);
        $('#cboItemCriticality').focus();
        return false;
    }
    if ($("#txtPackSize").val() === "0" || $("#txtPackSize").val() === "") {
        fnAlert("w", "EMI_01_00", "UI0157", errorMsg.PackSize_E16);
        $('#txtPackSize').focus();
        return false;
    }
}

