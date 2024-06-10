$(document).ready(function () {
    
    fnGridLoadDrugsConsumables();
    
    $.contextMenu({
        selector: "#btnDrugsConsumables",
        trigger: 'left',
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditDrugsConsumables(event) } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewDrugsConsumables(event) } },
        }
});
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");

    
});

function fnGridLoadDrugsConsumables() {
    var CompositionID = $("#cboDrugComposition").val();
    var FormulationID = $("#cboDrugsFormulations").val();
    var ManufacturerID = $("#cboDrugsManufacturer").val();
    var URL = getBaseURL() + '/DrugBrands/GetDrugBrandListByGroup?CompositionID=' + CompositionID + '&FormulationID=' + FormulationID + '&ManufacturerID=' + ManufacturerID;
    $("#jqgDrugsConsumables").jqGrid('GridUnload');
    $("#jqgDrugsConsumables").jqGrid({
        url: URL,
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.Skutype, localization.Skucode, localization.Skuid, localization.CompositionID, localization.FormulationID, localization.TradeID, localization.TradeName, localization.PackSize, localization.Packing, localization.PackingDesc, localization.ManufacturerID, localization.ISDCode, localization.BarcodeID, localization.Active, localization.Actions],
        colModel: [
            { name: "Skutype", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Skucode", width: 70, editable: true, align: 'left', hidden: true },
            { name: "Skuid", width: 70, editable: true, align: 'left', hidden: true },
            { name: "CompositionID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "FormulationID", width: 70, editable: true, align: 'left', hidden: true },
            { name: "TradeID", width: 170, editable: true, align: 'left', hidden: true },
            { name: "TradeName", width: 170, editable: true, align: 'left', hidden: false },
            { name: "PackSize", width: 40, editable: true, align: 'left', hidden: false },
            { name: "Packing", width: 40, editable: true, align: 'left', hidden: true },
            { name: "PackingDesc", width: 40, editable: true, align: 'left', hidden: false },
            { name: "ManufacturerID", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ISDCode", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "BarcodeID", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnDrugsConsumables"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpDrugsConsumables",
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
        caption: localization.DrugsConsumables,
        loadComplete: function (data) {
            SetGridControlByAction();
        },
        onSelectRow: function (rowid, status, e) {
            
        },
    }).jqGrid('navGrid', '#jqpDrugsConsumables', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDrugsConsumables', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDrugsConsumables
    }).jqGrid('navButtonAdd', '#jqpDrugsConsumables', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddDrugsConsumables
    });
}

function fnGetDrugDetails() {
    $('#cboDrugComposition').val('');
    $('#cboDrugComposition').selectpicker('refresh');
    $('#cboDrugsFormulations').val('');
    $('#cboDrugsFormulations').selectpicker('refresh');
    $('#cboDrugsManufacturer').val('');
    $('#cboDrugsManufacturer').selectpicker('refresh');

    $("#jqgDrugsConsumables").jqGrid("clearGridData");
    var TradeID = $("#cboDrugConsumables").val();

    var URL = getBaseURL() + '/DrugBrands/GetDrugBrandListByTradeID?TradeID=' + TradeID

    $.ajax({
        type: 'POST',
        url: URL,
        success: function (result) {
            if (result.length > 0) {
                $("#cboDrugComposition").val(result[0]["CompositionID"]);
                $("#cboDrugComposition").selectpicker('refresh');

                fnGetDrugFormulation(result[0]["FormulationID"]);

                fnGetManufacturer(result[0]["CompositionID"], result[0]["FormulationID"], result[0]["ManufacturerID"]);

                $("#jqgDrugsConsumables").jqGrid('GridUnload');
                $("#jqgDrugsConsumables").jqGrid({
                    url: URL,
                    mtype: 'Post',
                    datatype: 'json',
                    ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },

                    jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
                    colNames: [localization.Skutype, localization.Skucode, localization.Skuid, localization.CompositionID, localization.FormulationID, localization.TradeID, localization.TradeName, localization.PackSize, localization.Packing, localization.PackingDesc, localization.ManufacturerID, localization.ISDCode, localization.BarcodeID, localization.Active, localization.Actions],
                    colModel: [
                        { name: "Skutype", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "Skucode", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "Skuid", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "CompositionID", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "FormulationID", width: 70, editable: true, align: 'left', hidden: true },
                        { name: "TradeID", width: 170, editable: true, align: 'left', hidden: true },
                        { name: "TradeName", width: 170, editable: true, align: 'left', hidden: false },
                        { name: "PackSize", width: 40, editable: true, align: 'left', hidden: true },
                        { name: "PackingDesc", width: 40, editable: true, align: 'left', hidden: false },
                        { name: "Packing", width: 40, editable: true, align: 'left', hidden: false },
                        { name: "ManufacturerID", width: 40, editable: false, hidden: true, align: 'left', resizable: true },
                        { name: "ISDCode", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
                        { name: "BarcodeID", width: 40, editable: false, hidden: false, align: 'left', resizable: true },
                        { name: "ActiveStatus", editable: false, width: 30, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
                        {
                            name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                            formatter: function (cellValue, options, rowdata, action) {
                                return '<button class="mr-1 btn btn-outline" id="btnDrugsConsumables"><i class="fa fa-ellipsis-v"></i></button>'
                            }
                        },
                    ],
                    pager: "#jqpDrugsConsumables",
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
                    caption: localization.DrugsConsumables,
                    loadComplete: function (data) {
                        SetGridControlByAction();
                    },
                    onSelectRow: function (rowid, status, e) {
                       
                    },
                }).jqGrid('navGrid', '#jqpDrugsConsumables', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpDrugsConsumables', {
                    caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshDrugsConsumables
                }).jqGrid('navButtonAdd', '#jqpDrugsConsumables', {
                    caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnGridAddDrugsConsumables
                });

            }
            else
                jqpDrugsConsumables.jqGrid().trigger('reloadGrid', [{ page: 1 }]);
        }
    });
}

function fnGetDrugCompositionONChanged() {
    $('#cboDrugConsumables').val(0);
    $('#cboDrugConsumables').selectpicker('refresh');
    $("#jqpDrugsConsumables").jqGrid("clearGridData");
    $("#cboDrugsFormulations").empty().selectpicker('refresh');
    $("#cboDrugsManufacturer").empty().selectpicker('refresh');
    
    var CompositionId = $("#cboDrugComposition").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/DrugBrands/GetDrugFormulation?CompositionId=' + CompositionId,
        success: function (result) {
            $("#cboDrugsFormulations").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboDrugsFormulations').append('<option value="' + result[i]["FormulationID"] + '">' + result[i]["FormulationDesc"] + '</option>');
                }
            }
            $('#cboDrugsFormulations').val($("#cboDrugsFormulations option:first").val());
            $('#cboDrugsFormulations').selectpicker('refresh');
        }
    });
}

function fnGetDrugFormulationONChanged() {

    $('#cboDrugConsumables').val(0);
    $('#cboDrugConsumables').selectpicker('refresh');
    $("#jqpDrugsConsumables").jqGrid("clearGridData");
    $("#cboDrugsManufacturer").empty().selectpicker('refresh');

    var CompositionId = $("#cboDrugComposition").val();
    var FormulationID = $("#cboDrugsFormulations").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/DrugBrands/GetManufacturers?CompositionId=' + CompositionId + '&FormulationID=' + FormulationID,
        success: function (result) {
            $("#cboDrugsManufacturer").append($("<option value='0'>Select</option>"));
            $("#cboManufacturer").append($("<option value='0'>Select</option>"));
            
            if (result != null) {
                for (var i = 0; i < result.length; i++) {

                    $("#cboDrugsManufacturer").append($("<option></option>").val(result[i]["ManufacturerId"]).html(result[i]["ManufacturerName"]));
                    $("#cboManufacturer").append($("<option></option>").val(result[i]["ManufacturerId"]).html(result[i]["ManufacturerName"]));
                }
            }
            $('#cboDrugsManufacturer').val($("#cboDrugsManufacturer option:first").val());
            $('#cboDrugsManufacturer').selectpicker('refresh');

            $('#cboManufacturer').val($("#cboManufacturer option:first").val());
            $('#cboManufacturer').selectpicker('refresh');

            fnGridLoadDrugsConsumables();
        }
    }); 
}

function fnGetDrugFormulation(FormulationID) {
    $("#cboDrugsFormulations").empty().selectpicker('refresh');
    $("#cboDrugsManufacturer").empty().selectpicker('refresh');

    var CompositionId = $("#cboDrugComposition").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/DrugBrands/GetDrugFormulation?CompositionId=' + CompositionId,
        success: function (result) {
            $("#cboDrugsFormulations").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboDrugsFormulations').append('<option value="' + result[i]["FormulationID"] + '">' + result[i]["FormulationDesc"] + '</option>');
                }
            }
            $("#cboDrugsFormulations").val(FormulationID);
            $("#cboDrugsFormulations").selectpicker('refresh');
            fnGridLoadDrugsConsumables();
        }
    });
}

function fnGetDrugFormulationonEdit(FormulationID) {
    $("#cboDrugsFormulations").empty().selectpicker('refresh');
    $("#cboDrugsManufacturer").empty().selectpicker('refresh');

    var CompositionId = $("#cboDrugComposition").val();
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/DrugBrands/GetDrugFormulation?CompositionId=' + CompositionId,
        success: function (result) {
            $("#cboDrugsFormulations").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboDrugsFormulations').append('<option value="' + result[i]["FormulationID"] + '">' + result[i]["FormulationDesc"] + '</option>');
                }
            }
            $("#cboDrugsFormulations").val(FormulationID);
            $("#cboDrugsFormulations").selectpicker('refresh');
        }
    });
}

function fnGetManufacturer(CompositionId, FormulationID, ManufacturerId) {
    $("#cboDrugsManufacturer").empty().selectpicker('refresh');
    $("#cboManufacturer").empty().selectpicker('refresh');
    $.ajax({
        type: 'POST',
        url: getBaseURL() + '/DrugBrands/GetManufacturers?CompositionId=' + CompositionId + '&FormulationID=' + FormulationID,
        success: function (result) {
            $("#cboDrugsManufacturer").append($("<option value='0'>Select</option>"));
            $("#cboManufacturer").append($("<option value='0'>Select</option>"));
            if (result != null) {
                for (var i = 0; i < result.length; i++) {
                    $('#cboDrugsManufacturer').append('<option value="' + result[i]["ManufacturerId"] + '">' + result[i]["ManufacturerName"] + '</option>');
                    $('#cboManufacturer').append('<option value="' + result[i]["ManufacturerId"] + '">' + result[i]["ManufacturerName"] + '</option>');
                }
            }
            $("#cboDrugsManufacturer").val(ManufacturerId);
            $("#cboDrugsManufacturer").selectpicker('refresh');

            $("#cboManufacturer").val(ManufacturerId);
            $("#cboManufacturer").selectpicker('refresh');
        }
    });
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnGridAddDrugsConsumables() {
    fnClearFields();

    if ($("#cboDrugComposition").val() == "0" || $("#cboDrugComposition").val() == "") {
        fnAlert("w", "EMP_01_00", "UI0340", errorMsg.SelectDrugComposition_E11);
        $('#cboDrugComposition').focus();
        return false;
    }

    if ($("#cboDrugsFormulations").val() == "0" || $("#cboDrugsFormulations").val() == "") {
        fnAlert("w", "EMP_01_00", "UI0341", errorMsg.SelectDrugFormulation_E12);
        $('#cboDrugsFormulations').focus();
        return false;
    }
    if ($("#cboDrugsManufacturer").val() == "0" || $("#cboDrugsManufacturer").val() == "") {
        fnAlert("w", "EMP_01_00", "UI0342", errorMsg.SelectDrugManufacturer_E13);
        $('#cboDrugsManufacturer').focus();
        return false;
    }
    $("#btnSaveDrugsConsumables").html(localization.Save);
    $('#PopupDrugsConsumables').modal('show');
    $('#PopupDrugsConsumables').find('.modal-title').text(localization.AddDrugsConsumables);

    $("#cboManufacturer").val($("#cboDrugsManufacturer").val());
    $("#cboManufacturer").selectpicker('refresh');

    $('#txtCompositionID').val($("#cboDrugComposition").val());
    $('#txtFormulationID').val($("#cboDrugsFormulations").val());

    fnLoadBusinessTree();

    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupDrugsConsumables").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });
}

function fnGridRefreshDrugsConsumables() {
    $("#jqgDrugsConsumables").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnEditDrugsConsumables(e) {

    var rowid = $("#jqgDrugsConsumables").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugsConsumables').jqGrid('getRowData', rowid);

    if (_userFormRole.IsEdit === false) {
        fnAlert("w", "", "UIC02", errorMsg.editauth_E2);
        return;
    }
    $("#btnSaveDrugsConsumables").html(localization.Update);
    $('#PopupDrugsConsumables').find('.modal-title').text(localization.EditDrugsConsumables);
    $('#PopupDrugsConsumables').modal('show');

    $("input[type=checkbox]").attr('disabled', false);

    $("#PopupDrugsConsumables").on('hidden.bs.modal', function () {
        $("input[type=checkbox]").attr('disabled', true);
    });

    $("#cboDrugComposition").val(rowData.CompositionID);
    $("#cboDrugComposition").selectpicker('refresh');

    fnGetDrugFormulationonEdit(rowData.FormulationID);

    fnGetManufacturer(rowData.CompositionID, rowData.FormulationID, rowData.ManufacturerID);

    $("#cboDrugsManufacturer").val(rowData.ManufacturerID);
    $("#cboDrugsManufacturer").selectpicker('refresh');

    $('#txtTradeID').val(rowData.TradeID);
    $('#txtSkuCode').val(rowData.Skucode);
    $('#txtSkuId').val(rowData.Skuid);
    $('#txtTradeName').val(rowData.TradeName);
    $('#txtPackSize').val(rowData.PackSize);
    $("#cboPacking").val(rowData.Packing);
    $("#cboPacking").selectpicker('refresh');
    $("#cboManufacturer").val(rowData.ManufacturerID);
    $("#cboManufacturer").selectpicker('refresh');
    $("#cbolocISD").val(rowData.ISDCode);
    $("#cbolocISD").selectpicker('refresh');
    $('#txtBarcodeID').val(rowData.BarcodeID);

     
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }
    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/DrugBrands/GetDrugBrandParameterList?TradeID=' + $('#txtTradeID').val(),
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

    fnLoadBusinessTree();
    $("#btnSaveDrugsConsumables").attr('disabled', false);
}

function fnViewDrugsConsumables(e) {
    var rowid = $("#jqgDrugsConsumables").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgDrugsConsumables').jqGrid('getRowData', rowid);

    if (_userFormRole.IsView === false) {
        fnAlert("w", "", "UIC03", errorMsg.vieweauth_E3);
        return;
    }
    $('#PopupDrugsConsumables').modal('show');
    $('#PopupDrugsConsumables').find('.modal-title').text(localization.ViewDrugsConsumables);
    $('#PopupDrugsConsumables').modal('show');

    $("#cboDrugComposition").val(rowData.CompositionID);
    $("#cboDrugComposition").selectpicker('refresh');

    fnGetDrugFormulationonEdit(rowData.FormulationID);

    $("#cboDrugsFormulations").val(rowData.FormulationID);
    $("#cboDrugsFormulations").selectpicker('refresh');

    fnGetManufacturer(rowData.CompositionID, rowData.FormulationID, rowData.ManufacturerID);

    $("#cboDrugsManufacturer").val(rowData.ManufacturerID);
    $("#cboDrugsManufacturer").selectpicker('refresh');

    $('#txtTradeID').val(rowData.TradeID);
    $('#txtSkuCode').val(rowData.Skucode);
    $('#txtSkuId').val(rowData.Skuid);
    $('#txtTradeName').val(rowData.TradeName);
    $('#txtPackSize').val(rowData.PackSize);
    $("#cboPacking").val(rowData.Packing);
    $("#cboPacking").selectpicker('refresh');
    $("#cboManufacturer").val(rowData.ManufacturerID);
    $("#cboManufacturer").selectpicker('refresh');
    $("#cbolocISD").val(rowData.ISDCode);
    $("#cbolocISD").selectpicker('refresh');
    $('#txtBarcodeID').val(rowData.BarcodeID);

    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else { $("#chkActiveStatus").parent().removeClass("is-checked"); }

    eSyaParams.ClearValue();
    $.ajax({
        url: getBaseURL() + '/DrugBrands/GetDrugBrandParameterList?TradeID=' + $('#txtTradeID').val(),
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

    fnLoadBusinessTree();

    $("#btnSaveDrugsConsumables").hide();
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("#PopupDrugsConsumables").on('hidden.bs.modal', function () {
        $("#btnSaveDrugsConsumables").show();
        $("input,textarea").attr('readonly', false);
        $("select").next().attr('disabled', false);
    })
}

function fnSaveDrugsConsumables() {

    if (fnValidateDrugsConsumables() === false) {
        return;
    }

    var obj;

    $("#btnSaveDrugsConsumables").attr('disabled', true);

    var tradeID = $("#txtTradeID").val();

    if (tradeID == null || tradeID == "") {
        obj = {
            TradeID: 0,
            Skucode: 0,
            Skuid: 0,
            CompositionID: $("#cboDrugComposition").val(),
            FormulationID: $("#cboDrugsFormulations").val(),
            TradeName: $("#txtTradeName").val(),
            PackSize: $("#txtPackSize").val(),
            Packing: $("#cboPacking").val(),
            ManufacturerID: $("#cboManufacturer").val(),
            ISDCode: $("#cbolocISD").val(),
            BarcodeID: $("#txtBarcodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }
    }
    else {
        obj = {
            TradeID: tradeID,
            Skucode: $("#txtSkuCode").val(),
            Skuid: $("#txtSkuId").val(),
            CompositionID: $("#cboDrugComposition").val(),
            FormulationID: $("#cboDrugsFormulations").val(),
            TradeName: $("#txtTradeName").val(),
            PackSize: $("#txtPackSize").val(),
            Packing: $("#cboPacking").val(),
            ManufacturerID: $("#cboManufacturer").val(),
            ISDCode: $("#cbolocISD").val(),
            BarcodeID: $("#txtBarcodeID").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
        }
    }

    var fmParams = eSyaParams.GetJSONValue();
    obj.l_FormParameter = fmParams;

    $.ajax({
        //async: false,
        url: getBaseURL() + '/DrugBrands/InsertOrUpdateDrugBrands',
        type: 'POST',
        data: {
            obj
        },
        datatype: 'json',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveDrugsConsumables").attr('disabled', true);
                $("#btnSaveDrugsConsumables").hide();
                $("#PopupItemMaster").modal('hide');
                fnGridRefreshDrugsConsumables();
                eSyaParams.ClearValue();
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
            }
            $("#btnSaveDrugsConsumables").attr('disabled', false);
            $("#btnSaveDrugsConsumables").show();
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnSaveDrugsConsumables").attr("disabled", false);
        }
    });
}

function fnISDCountryCode_onChange() {

}

function fnClearFields() {
    $("#txtTradeID").val('');
    $("#txtSkuCode").val('');
    $("#txtSkuId").val('');
    $("#txtTradeName").val('');
    $("#txtPackSize").val('');
    $('#cboPacking').val('');
    $('#cboPacking').selectpicker('refresh');
    $('#cboManufacturer').val('');
    $('#cboManufacturer').selectpicker('refresh');


    $("#cbolocISD").val('0').selectpicker('refresh');
    
    $('#txtBarCodeID').val('');
    $("#chkActiveStatus").parent().addClass("is-checked");
    eSyaParams.ClearValue();
}

function fnValidateDrugsConsumables() {

    if ($("#txtTradeName").val().trim().length <= 0) {
        fnAlert("w", "EMP_01_00", "UI0336", errorMsg.TradeName_E5);
        $('#txtTradeName').focus();
        return false;
    }
    if ($("#txtPackSize").val().trim().length <= 0) {
        fnAlert("w", "EMP_01_00", "UI0150", errorMsg.PackSize_E6);
        $('#txtPackSize').focus();
        return false;
    }
    if ($("#cboPacking").val() == "0" || $("#cboPacking").val() == "") {
        fnAlert("w", "EMP_01_00", "UI0337", errorMsg.SelectPackSize_E7);
        $('#cboPacking').focus();
        return false;
    }

    if ($("#cboManufacturer").val() == "0" || $("#cboManufacturer").val() == "") {
        fnAlert("w", "EMP_01_00", "UI0338", errorMsg.SelectManufacturer_E8);
        $('#cboManufacturer').focus();
        return false;
    }
    if ($("#cbolocISD").val() === '0' || $("#cbolocISD").val() === "0" || IsStringNullorEmpty($("#cbolocISD").val())) {
        fnAlert("w", "ECB_02_00", "UI0056", errorMsg.SelectISDCode_E9);
        return;
    }


}

function fnLoadBusinessTree() {
    $("#jstBusinessLocation").jstree('destroy');

    $.ajax({
        url: getBaseURL() + '/DrugBrands/GetAllBusinessLocations',
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
            //$("#dvBusinessDocument").css('display', 'none');
        }
    });

    $("#jstBusinessLocation").on('loaded.jstree', function () {
        $("#jstBusinessLocation").jstree()._open_to(prevSelectedID);
        $('#jstBusinessLocation').jstree().select_node(prevSelectedID);
    });

    $('#jstBusinessLocation').on("close_node.jstree", function (node) {
        var closingNode = node.handleObj.handler.arguments[1].node;
        $('#jstBusinessLocation').jstree().deselect_node(closingNode.children);
    });
}
function fnTreeSize() {
    $("#jstBusinessLocation").css({
        'max-height': $(window).height() - 190,
        'overflow': 'auto'
    });
}

