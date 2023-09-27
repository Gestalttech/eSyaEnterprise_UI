var _isInsert;
$(document).ready(function () {
    fnGridLoadCurrencyDenomination();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnCurrencyDenomination",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCurrencyDenomination(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCurrencyDenomination(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCurrencyDenomination(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});
function fnGridLoadCurrencyDenomination() {

    $("#jqgCurrencyDenomination").jqGrid('GridUnload');
    $("#jqgCurrencyDenomination").jqGrid({
        url: getBaseURL() + '/Currencies/GetCurrencyDenominationInfoByCurrencyCode?CurrencyCode=' + $('#cbocurrencycode').val(),
        mtype: 'Post',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        //colNames: [localization.CurrencyCode, localization.DenominationId, localization.DenominationDescription, localization.BankNoteorCoin, localization.DenominationConversion, localization.DenominationSequence, localization.EffectiveDate, localization.Active, localization.Actions, localization.Delete],
        colNames: [localization.CurrencyCode, localization.BankNoteorCoin,localization.DenominationId, localization.DenominationDescription, localization.DenominationConversion, localization.DenominationSequence, localization.EffectiveDate, localization.Active, localization.Actions],
        colModel: [
            { name: "CurrencyCode", width: 50, editable: true, align: 'left', hidden: true },
            { name: "BnorCnId", editable: false, width: 120, edittype: "select", align: 'left', formatter: 'select', editoptions: { value: "B:Bank Note;C:Coin" } },
            { name: "DenomId", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "DenomDesc", width: 150, editable: false, hidden: false, align: 'left', resizable: false, editoption: { 'text-align': 'left', maxlength: 50 } },
            { name: "DenomConversion", width: 60, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "Sequence", width: 60, editable: false, hidden: false, align: 'left', resizable: true },
            //{ name: "EffectiveDate", editable: true, width: 90, align: 'left', formatter: 'date' },
            {
                name: 'EffectiveDate', index: 'EffectiveDate', width: 80, sorttype: "date", formatter: "date", formatoptions:
                    { newformat: _cnfjqgDateFormat }            },
            { name: "ActiveStatus", width: 45, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
            
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCurrencyDenomination"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpCurrencyDenomination",
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:55,
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
        scrollOffset: 0, caption:'Currency Denomination',
        loadComplete: function (data) {
            //SetDenominationGridControlByAction("jqgCurrencyDenomination");
            SetDenominationGridControlByAction();
            fnJqgridSmallScreen("jqgCurrencyDenomination");
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

    }).jqGrid('navGrid', '#jqpCurrencyDenomination', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCurrencyDenomination', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCurrencyDenomination
    }).jqGrid('navButtonAdd', '#jqpCurrencyDenomination', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCurrencyDenomination
    });
    fnAddGridSerialNoHeading();
}

function fnAddCurrencyDenomination() {
    fnClearFields();
    var id = $("#CurrencyCode").val();
    if (id === 0 || id === "0") {
        toastr.warning("Please select any Currency code type to add Denomination");
    }
    else {
        $('#PopupCurrencyDenomination').modal('show');
        $('#PopupCurrencyDenomination').find('.modal-title').text(localization.AddCurrencyDenomination);
        $("#btnSaveCurrencyDenomination").show();
        $("#btnDeactivateCurrencyDenomination").hide();
        $("#btnSaveCurrencyDenomination").html('<i class="fa fa-save"></i> ' + localization.Save);
        $("#btnCancelCurrencyDenomination").html('<i class="fa fa-times"></i> '+ localization.Cancel)
        $('#cboBnorCnId').attr('disabled', false);
        $('#cboBnorCnId').selectpicker('refresh');
        $("#txtDenomId").prop('disabled', false);
        $("#txtDenomDescription").prop('disabled', false);
        $("#txtDenomConversion").prop('disabled', false);
        $("#txtSequence").prop('disabled', false);
        $("#txtEffectiveDate").prop('disabled', false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#chkActiveStatus").parent().addClass("is-checked");
        _isInsert = true;
    }
}

function fnEditCurrencyDenomination(e, actiontype) {
    debugger;
    var rowid = $("#jqgCurrencyDenomination").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCurrencyDenomination').jqGrid('getRowData', rowid);
   
    $('#PopupCurrencyDenomination').find('.modal-title').text(localization.UpdateCurrencyDenomination);
    $("#btnSaveCurrencyDenomination").html('<i class="fa fa-sync"></i> ' + localization.Update);
    $("#btnCancelCurrencyDenomination").html('<i class="fa fa-times"></i> ' + localization.Cancel);
    $('#cboBnorCnId').attr('disabled', true);
    $('#cboBnorCnId').val(rowData.BnorCnId);
    $('#cboBnorCnId').selectpicker('refresh');
    $("#txtDenomId").val(rowData.DenomId);
    $("#txtDenomId").prop('disabled', true);
    $("#txtDenomDescription").val(rowData.DenomDesc);
    $("#txtDenomConversion").val(rowData.DenomConversion);
    $("#txtSequence").val(rowData.Sequence);
    
    if (rowData.EffectiveDate !== null) {
        setDate($('#txtEffectiveDate'), fnGetDateFormat(rowData.EffectiveDate));
    }
    else {
        $('#txtEffectiveDate').val('');
    }
    if (rowData.ActiveStatus === "true") {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateCurrencyDenomination").html(localization.DeActivate);
    }
    else {
        $('#chkActiveStatus').parent().removeClass("is-checked");
        $("#btnDeactivateCurrencyDenomination").html(localization.Activate);
    }
    _isInsert = false;

    if (actiontype == "edit") {
        if (_userFormRole.IsEdit === false) {
            toastr.warning("You are not Authorized to Edit");
            return;
        }
        $('#PopupCurrencyDenomination').modal('show');

        $("#btnSaveCurrencyDenomination").show();
        $("#btnDeactivateCurrencyDenomination").hide();
        $("#txtDenomDescription").prop('disabled', false);
        $("#txtDenomConversion").prop('disabled', false);
        $("#txtSequence").prop('disabled', false);
        $("#txtEffectiveDate").prop('disabled', false);
        $("#chkActiveStatus").prop('disabled', true);
        $("#btnSaveCurrencyDenomination").attr("disabled", false);                           
       
    }
    if (actiontype == "view") {
        if (_userFormRole.IsView === false) {
            toastr.warning("You are not Authorized to View");
            return;
        }
        $('#PopupCurrencyDenomination').modal('show');

        $('#PopupCurrencyDenomination').find('.modal-title').text(localization.ViewCurrencyDenomination);
        $('#PopupCurrencyDenomination').modal('show');
        $("#btnSaveCurrencyDenomination").hide();
        $("#btnDeactivateCurrencyDenomination").hide();
        $("#txtDenomId").prop('disabled', true);
        $("#txtDenomDescription").prop('disabled', true);
        $("#txtDenomConversion").prop('disabled', true);
        $("#txtSequence").prop('disabled', true);
        $("#txtEffectiveDate").prop('disabled', true);
        $("#chkActiveStatus").prop('disabled', true);
    }
    if (actiontype == "delete") {
        if (_userFormRole.IsDelete === false) {
            toastr.warning("You are not Authorized to Delete");
            return;
        }
        $('#PopupCurrencyDenomination').modal('show');

        $('#PopupCurrencyDenomination').find('.modal-title').text("Active/De Active Currency Denomination");
        $('#PopupCurrencyDenomination').modal('show');
        
        $("#btnSaveCurrencyDenomination").hide();
        $("#btnDeactivateCurrencyDenomination").show();
        $("#txtDenomId").prop('disabled', true);
        $("#txtDenomDescription").prop('disabled', true);
        $("#txtDenomConversion").prop('disabled', true);
        $("#txtSequence").prop('disabled', true);
        $("#txtEffectiveDate").prop('disabled', true);
        $("#chkActiveStatus").prop('disabled', true);
    }
}

function fnSaveCurrencyDenomination() {
    if (fnValidateCurrencyDenomination() === false) {
        return;
    }
    obj = {
        CurrencyCode: $("#cbocurrencycode").val(),
        BnorCnId: $("#cboBnorCnId").val(),
        DenomId: $("#txtDenomId").val(),
        DenomDesc: $("#txtDenomDescription").val(),
        DenomConversion: $("#txtDenomConversion").val(),
        Sequence: $("#txtSequence").val(),
        EffectiveDate: getDate($("#txtEffectiveDate")),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };

    $("#btnSaveCurrencyDenomination").attr("disabled", true);

    $.ajax({
        url: getBaseURL() + '/Currencies/InsertUpdateCurrencyDenominationInformation',
        type: 'POST',
        datatype: 'json',
        data: { isInsert: _isInsert, obj: obj },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                //$("#btnSaveCurrencyDenomination").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCurrencyDenomination").modal('hide');
                fnClearFields();
                fnGridRefreshCurrencyDenomination();
               
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCurrencyDenomination").attr("disabled", false);
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCurrencyDenomination").attr("disabled", false);
        }
    });
}

function fnClearFields() {
    $("#cboBnorCnId").val("0");
    $("#txtDenomId").val('');
    $("#txtDenomDescription").val('');
    $("#txtDenomConversion").val('');
    $("#txtSequence").val('');
    $("#txtEffectiveDate").val('');
    $("#chkActiveStatus").parent().hasClass("is-checked");   
    $("#btnSaveCurrencyDenomination").attr("disabled", false);
}

function fnGridRefreshCurrencyDenomination() {
    $("#jqgCurrencyDenomination").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnValidateCurrencyDenomination() {
    if ($("#cboBnorCnId").val() === "0" || $("#cboBnorCnId").val() === "") {
        toastr.warning("Please Select BN Or CN Id");
        return false;
    }

    if (IsStringNullorEmpty($("#txtDenomId").val())) {
        toastr.warning("Please Enter Denomination Id");
        return false;
    }
    if (IsStringNullorEmpty($("#txtDenomDescription").val())) {
        toastr.warning("Please Enter Denomination Description");
        return false;
    }
    if (IsStringNullorEmpty($("#txtDenomConversion").val())) {
        toastr.warning("Please Enter Denomination Conversion");
        return false;
    }
    if (IsStringNullorEmpty($("#txtSequence").val())) {
        toastr.warning("Please Enter Sequence Number");
        return false;
    }
    if (IsStringNullorEmpty($("#txtEffectiveDate").val())) {
        toastr.warning("Please Select Effective Date");
        return false;
    }
}

function fnAllowNumbersOnly(input) {
    let value = input.value;
    let numbers = value.replace(/[^0-9]/g, "");
    input.value = numbers;
}

function fnDeleteDenominationInformation(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCurrencyDenomination').jqGrid('getRowData', rowid);
    var cCode = rowData.CurrencyCode;
    var cDenomId = rowData.DenomId;
    var cBnorCnId = rowData.BnorCnId;
    bootbox.confirm({
        title: 'Currency Denomination',
        message: "Are you sure you want to delete ?",
        buttons: {
            confirm: {
                label: 'Yes',
                className: 'mdl-button  primary-button'
            },
            cancel: {
                label: 'No',
                className: 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect  cancel-button cancel-button'
            }
        },
        callback: function (result) {
            if (result) {
                if ((cCode == null || cCode == undefined || cCode == "0" || cCode == '')
                    || (cDenomId == null || cDenomId == undefined || cDenomId == "0" || cDenomId == '') ||
                    (cBnorCnId == null || cBnorCnId == undefined || cBnorCnId == "0" || cBnorCnId == '')) {
                    alert("Could not Delete");
                    return false;
                }
                $.ajax({
                    type: 'POST',
                    url: getBaseURL() + '/Currencies/DeleteCurrencyDenominationInformation',
                    data: {
                        currencyCode: cCode,
                        DenomId: cDenomId,
                        BnorCNId: cBnorCnId
                    },
                    success: function (response) {

                        if (response.Status) {
                            toastr.success(response.Message);
                            fnGridRefreshCurrencyDenomination();
                        }
                        else {
                            toastr.error(response.Message);
                        }
                        $("#jqgCurrencyDenomination").setGridParam({ datatype: 'json' }).trigger('reloadGrid');
                    },
                    error: function (response) {
                        toastr.error("Couldn't Delete");
                    }
                });
            }
        }
    });
}

function SetDenominationGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
    
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

//function SetDenominationGridControlByAction() {

//    $('#jqgAdd').removeClass('ui-state-disabled');
//    var eleEnable = document.querySelectorAll('#jqgEdit');

//    for (var i = 0; i < eleEnable.length; i++) {
//        eleEnable[i].disabled = false;
//    }
//    if (_userFormRole.IsInsert === false) {
//        $('#jqgAdd').addClass('ui-state-disabled');
//    }
//    if (_userFormRole.IsEdit === false) {
//        var eleDisable = document.querySelectorAll('#jqgEdit');
//        for (var i = 0; i < eleDisable.length; i++) {
//            eleDisable[i].disabled = true;
//            eleDisable[i].className = "ui-state-disabled";
//        }
//    }

//    var eleDeleteEnable = document.querySelectorAll('#jqgDelete');

//    for (var i = 0; i < eleDeleteEnable.length; i++) {
//        eleDeleteEnable[i].disabled = false;
//    }

//    if (_userFormRole.IsDelete === false) {
//        var eleDeleteDisable = document.querySelectorAll('#jqgDelete');
//        for (var i = 0; i < eleDeleteDisable.length; i++) {
//            eleDeleteDisable[i].disabled = true;
//            eleDeleteDisable[i].className = "ui-state-disabled";
//        }
//    }

//}



function fnDeleteCurrencyDenomination() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateCurrencyDenomination").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Currencies/ActiveOrDeActiveCurrencyDenomination?status=' + a_status + '&currencycode=' + $("#cbocurrencycode").val()
            + '&denomId=' + $("#txtDenomId").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                //$("#btnDeactivateCurrencyDenomination").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $("#PopupCurrencyDenomination").modal('hide');
                fnClearFields();
                fnGridRefreshCurrencyDenomination();
                $("#btnDeactivateCurrencyDenomination").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateCurrencyDenomination").attr("disabled", false);
                $("#btnDeactivateCurrencyDenomination").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateCurrencyDenomination").attr("disabled", false);
            $("#btnDeactivateCurrencyDenomination").html('De Activate');
        }
    });
}