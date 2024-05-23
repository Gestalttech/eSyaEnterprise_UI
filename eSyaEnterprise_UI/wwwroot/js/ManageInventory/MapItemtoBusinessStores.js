
var _isSubCategoryApplicable = 0;
var businesskey = '0';
var prevSelectedID = '';
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
});

function fnGetItemCategoryByItem(ItemCategory) {
    $("#cboItemCategory").empty().selectpicker('refresh');
    $("#cboItemSubCategory").empty().selectpicker('refresh');

    _isSubCategoryApplicable = 0;
    var ItemGroup = $("#cboItemGroup").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/Stores/GetItemCategory?ItemGroup=' + ItemGroup,
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
        url: getBaseURL() + '/Stores/GetItemCategory?ItemGroup=' + ItemGroup,
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
        url: getBaseURL() + '/Stores/GetItemSubCategory?ItemCategory=' + ItemCategory,
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
    var URL = getBaseURL() + '/Stores/GetItemMaster?ItemGroup=' + ItemGroup + '&ItemCategory=' + ItemCategory + '&ItemSubCategory=' + ItemSubCategory;
    $("#jqgItemtoBusinessStores").jqGrid('GridUnload');
    $("#jqgItemtoBusinessStores").jqGrid({
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
    });
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnEditItemtoBusinessStores(e) {
    fnClearFields();
    fnRefreshGridData();
    $("#jqgLinkedStores").hide();
    $("#jqgPortfolioLink").hide();
    var rowid = $("#jqgItemtoBusinessStores").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgItemtoBusinessStores').jqGrid('getRowData', rowid);

    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
        return;
    }
    $('#PopupItemtoBusinessStores').find('.modal-title').text(localization.EditItem);
    $('#PopupItemtoBusinessStores').modal('show');

    $('#txtItemCode').val(rowData.ItemCode);
    fnLoadBusinessTree();
}

function fnViewItemtoBusinessStores(e) {
    fnClearFields();
    fnRefreshGridData();
    $("#jqgLinkedStores").hide();
    $("#jqgPortfolioLink").hide();
    var rowid = $("#jqgItemtoBusinessStores").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgItemtoBusinessStores').jqGrid('getRowData', rowid);

    if (_userFormRole.IsView === false) {
        fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
        return;
    }
    $('#PopupItemtoBusinessStores').modal('show');
    $('#PopupItemtoBusinessStores').find('.modal-title').text(localization.ViewItem);
    $('#PopupItemtoBusinessStores').modal('show');

    $('#txtItemCode').val(rowData.ItemCode);
    fnLoadBusinessTree();
    $("#btnSaveItem").hide();
}

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

function fnLoadGridStoreBusinessLink(businesskey) {
    var ItemCode = $("#txtItemCode").val();
    var URL = getBaseURL() + '/Stores/GetBusinessItemStoreLink?BusinessKey=' + businesskey + '&ItemCode=' + ItemCode;
    $("#jqgLinkedStores").GridUnload();
    $("#jqgLinkedStores").jqGrid(

        {
            url: URL,
            mtype: 'Post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: [localization.BusinessKey, localization.ItemCode, localization.StoreCode, localization.StoreDesc, localization.Active],
            colModel: [
                { name: "BusinessKey", width: 70, editable: true, align: 'left', hidden: true },
                { name: "ItemCode", width: 70, editable: true, align: 'left', hidden: true },
                { name: "StoreCode", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'StoreDesc', width: 170, resizable: false },
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
                $("#jqgPortfolioLink").show();
                fnLoadPortfolioStoreBusinessLinkGrid();
            },
            loadComplete: function (data) {

            },
        })
        .jqGrid('navGrid', '#jqpLinkedStores', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpLinkedStores', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGrid("#jqpLinkedStores")
        })
}

function fnLoadPortfolioStoreBusinessLinkGrid() {
    var rowid = $("#jqgLinkedStores").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgLinkedStores').jqGrid('getRowData', rowid);
    $('#txtStoreCode').val(rowData.StoreCode);
    var StoreCode = $("#txtStoreCode").val();
    var URL = getBaseURL() + '/Stores/GetPortfolioStoreInfo?BusinessKey=' + businesskey + '&StoreCode=' + StoreCode;

    $("#jqgPortfolioLink").GridUnload();
    $("#jqgPortfolioLink").jqGrid(
        {
            url: URL,
            mtype: 'Post',
            datatype: 'json',
            contentType: 'application/json; charset=utf-8',
            ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
            colNames: [localization.PortfolioId, localization.PortfolioDescription, localization.Active],
            colModel: [
                { name: "PortfolioId", width: 70, editable: true, align: 'left', hidden: true },
                { name: 'PortfolioDesc', width: 270, resizable: false },
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
            rownumWidth: '55',
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

            },
            loadComplete: function (data) {

            },
        })

        .jqGrid('navGrid', '#jqpPortfolioLink', { add: false, edit: false, search: false, del: false, refresh: false })
        .jqGrid('navButtonAdd', '#jqpPortfolioLink', {
            caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnRefreshGrid("#jqgPortfolioLink")
        });
}

function fnSaveBusinessItemStoreLink() {
    if (IsStringNullorEmpty(businesskey) || businesskey == '0') {

        fnAlert("w", "EDC_02_00", "UI0064", errorMsg.Location_E1);
        return;
    }
    if ($("#txtItemCode").val().trim().length <= 0) {
        fnAlert("w", "EMI_01_00", "UI0150", errorMsg.ItemDesc_E9);
        return;
    }

    var r_doc = [];
    var ids = jQuery("#jqgLinkedStores").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgLinkedStores').jqGrid('getRowData', rowId);

        r_doc.push({
            BusinessKey: rowData.BusinessKey,
            ItemCode: rowData.ItemCode,
            StoreCode: rowData.StoreCode,
            ActiveStatus: rowData.ActiveStatus
        });
    }

    if (r_doc.length <= 0) {
        fnAlert("w", "EDC_02_00", "UI0308", errorMsg.Documentcontrol_E3);
        return;
    }

    $("#btnSaveItem").attr('disabled', true);

    $("#btnSaveItem").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Stores/InsertOrUpdateBusinessItemStoreLink',
        type: 'POST',
        datatype: 'json',
        data: { obj: r_doc },
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveItem").attr('disabled', false);
                fnRefreshGridData();
                $('#btnSaveItem').modal('hide');
            }
            else {
                fnAlert("w", "", response.StatusCode, response.Message);
                $("#btnSaveItem").attr('disabled', false);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveItem").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#txtItemCode").val('');
    $("#txtStoreCode").val('');
}

function fnRefreshGridData() {
    $("#jqgLinkedStores").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
    $("#jqgLinkedStores").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnRefreshGrid(id) {
    $(id).setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

