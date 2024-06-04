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
    
    $("#jqgDrugsConsumables").jqGrid('GridUnload');
    $("#jqgDrugsConsumables").jqGrid({
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
    fnAddGridSerialNoHeading();
}

function SetGridControlByAction() {
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
}

function fnGridAddDrugsConsumables() {
    fnClearFields();

    if ($("#cboDrugConsumables").val() == "0" || $("#cboDrugConsumables").val() == "") {
        fnAlert("w", "EMP_01_00", "UI0147", errorMsg.ItemGroup_E6);
        $('#cboDrugConsumables').focus();
        return false;
    }

    $("#btnSaveDrugsConsumables").html(localization.Save);
    $('#PopupDrugsConsumables').modal('show');
    $('#PopupDrugsConsumables').find('.modal-title').text(localization.AddDrugsConsumables);
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

    $('#txtTradeName').val(rowData.TradeName);
    $('#txtPackSize').val(rowData.PackSize);
    
    $("#cboPacking").val(rowData.Packing);
    $("#cboPacking").selectpicker('refresh');
    $("#cboManufacturerID").val(rowData.ManufacturerID);
    $("#cboManufacturerID").selectpicker('refresh');
    $("#cboIsdcode").val(rowData.ISDCode);
    $("#cboIsdcode").selectpicker('refresh');
    $('#txtBarcodeID').val(rowData.BarcodeID);

     
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

    $('#txtTradeName').val(rowData.TradeName);
    $('#txtPackSize').val(rowData.PackSize);

    $("#cboPacking").val(rowData.Packing);
    $("#cboPacking").selectpicker('refresh');
    $("#cboManufacturerID").val(rowData.ManufacturerID);
    $("#cboManufacturerID").selectpicker('refresh');
    $("#cboIsdcode").val(rowData.ISDCode);
    $("#cboIsdcode").selectpicker('refresh');
    $('#txtBarcodeID').val(rowData.BarcodeID);

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

    
}

function fnClearFields() {
    $("#txtTradeName").val('');
    $("#txtPackSize").val('');
    
    $('#cboPacking').val('');
    $('#cboPacking').selectpicker('refresh');
    $('#cboManufacturerID').val('');
    $('#cboManufacturerID').selectpicker('refresh');


    $('#cboIsdcode').val('');
    $('#cboIsdcode').selectpicker('refresh');
    
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

    if ($("#cboManufacturerID").val() == "0" || $("#cboManufacturerID").val() == "") {
        fnAlert("w", "EMP_01_00", "UI0338", errorMsg.SelectManufacturer_E8);
        $('#cboManufacturerID').focus();
        return false;
    }
    if ($("#cboIsdcode").val() === "0" || $("#cboIsdcode").val() === "") {
        fnAlert("w", "EMP_01_00", "UI0056", errorMsg.SelectISDCode_E9);
        $('#cboIsdcode').focus();
        return false;
    }
      
}

