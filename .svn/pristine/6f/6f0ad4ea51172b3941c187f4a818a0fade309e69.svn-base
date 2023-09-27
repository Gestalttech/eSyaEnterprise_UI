var isUpdate = 0;
$(document).ready(function () {
    $('#cboCurrencyCode').empty();
    $("#cboCurrencyCode").append($("<option value='0'>Choose Currency Code</option>"));
    $("#cboSymbol").append($("<option value='0'>Choose Currency Symbol</option>"));
    $.each(currency_symbols, function (key, value) {
        $('#cboCurrencyCode').append('<option value=' + key + '>' + key + '</option>');
        $('#cboSymbol').append('<option value=' + value + '>' + value + '</option>');
    });
    $('#cboCurrencyCode').selectpicker('refresh');
    $('#cboSymbol').selectpicker('refresh');

    fnGridLoadCurrencyMaster();

    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnCurrencyMaster",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCurrencyMaster(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnViewCurrencyMaster(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnPopUpDeleteCurrencyMaster(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnCurrency_onChange() {
    $('#cboSymbol').val(currency_symbols[$('#cboCurrencyCode').val()]);
    $('#cboSymbol').selectpicker('refresh');
}

function fnGridLoadCurrencyMaster() {

    $("#jqgCurrencyMaster").jqGrid({
        url: getBaseURL() + '/Currencies/GetCurrencyMaster',
        datatype: 'json',
        mtype: 'Get',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        ignoreCase: true,
        colNames: [localization.CurrencyCode, localization.CurrencyName, localization.Symbol, localization.DecimalPlaces, localization.ShowInMillions, localization.SymbolSuffix, localization.DecimalPortionWord, localization.Active, localization.Actions],
        colModel: [
            { name: "CurrencyCode", width: 100, align: 'left', editable: true, editoptions: { maxlength: 4 } },
            { name: "CurrencyName", width: 200, editable: true, align: 'left', editoptions: { maxlength: 25 } },
            { name: "Symbol", width: 50, editable: true, align: 'center', editoptions: { maxlength: 50 }, hidden: true },
            { name: "DecimalPlaces", width: 40, editable: true, align: 'center', editoptions: { maxlength: 3 }, hidden: true, },
            { name: "ShowInMillions", editable: true, width: 45, hidden: true, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "SymbolSuffixToAmount", editable: true, width: 75, hidden: true, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "DecimalPortionWord", width: 55, editable: true, align: 'left', editoptions: { maxlength: 25 }, hidden: true },
            { name: "ActiveStatus", width: 35, editable: false, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },

            //{
            //    name: 'edit', search: false, align: 'left', width: 120, sortable: false, resizable: false,
            //    formatter: function (cellValue, options, rowdata, action) {
            //        return '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="Edit" id="jqgEdit" onclick="return fnEditCurrencyMaster(event,\'edit\')"><i class="fas fa-pen"></i> ' +localization.Edit+'</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title="View" id="jqgView" onclick="return fnViewCurrencyMaster(event,\'view\')"><i class="far fa-eye"></i> ' + localization.View +'</button>' +
            //            '<button class="btn-xs ui-button ui-widget ui-corner-all btn-jqgrid" title = "Delete" id="jqgDelete" onclick = "return fnPopUpDeleteCurrencyMaster(event,\'delete\')" > <i class="fas fa-trash"></i> ' + localization.Delete +'</button >'
            //    }

            //},
            {
                name: 'edit', search: false, align: 'center', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCurrencyMaster"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        pager: "#jqpCurrencyMaster",
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
        scrollOffset: 0,
        caption:'Currency Master',
        loadComplete: function (data) {
            SetGridControlByAction();
            fnJqgridSmallScreen("jqgCurrencyMaster");
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

    }).
        jqGrid('navGrid', '#jqpCurrencyMaster', { add: false, edit: false, search: true, searchtext: 'Search', del: false, refresh: false }, {}, {}, {}, {
            closeOnEscape: true,
            caption: "Search...",
            multipleSearch: true,
            Find: "Find",
            Reset: "Reset",
            odata: [{ oper: 'eq', text: 'Match' },{ oper: 'cn', text: 'Contains' },{ oper: 'bw', text: 'Begins With' },{ oper: 'ew', text: 'Ends With' }],
        }).jqGrid('navButtonAdd', '#jqpCurrencyMaster', {
            caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCurrencyMaster
        }).
        jqGrid('navButtonAdd', '#jqpCurrencyMaster', {
            caption: '<span class="fa fa-sync" data-toggle="modal"></span> Refresh', buttonicon: 'none', id: 'btnGridRefresh', position: 'last', onClickButton: fnGridRefreshCurrencyMaster
        });
    fnAddGridSerialNoHeading();
}

function fnAddCurrencyMaster() {

    fnClearFields();
    isUpdate = 0;
    $('#PopupCurrencyMaster').modal('show');
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#btnSaveCurrencyMaster").html("<i class='fa fa-save'></i> " + localization.Save);
    $("#btnCancelCurrencyMaster").html("<i class='fa fa-times'></i> " + localization.Cancel);
    $('#PopupCurrencyMaster').find('.modal-title').text(localization.AddCurrencyDetails);

    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveCurrencyMaster").show();
    $("#btnDeactivateCurrencyMaster").hide();
}

function fnEditCurrencyMaster(e) {
    if (_userFormRole.IsEdit === false) {
        toastr.warning("You are not authorized to Edit");
        return;
    }
    var rowid = $("#jqgCurrencyMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCurrencyMaster').jqGrid('getRowData', rowid);

    isUpdate = 1;
    $('#PopupCurrencyMaster').find('.modal-title').text(localization.UpdateCurrencyDetails);
    $('#PopupCurrencyMaster').modal('show');
    $("#btnSaveCurrencyMaster").html("<i class='fa fa-sync'></i> " + localization.Update);
    $('#cboCurrencyCode').attr('disabled', true);
    $('#cboCurrencyCode').val(rowData.CurrencyCode);
    $('#cboCurrencyCode').selectpicker('refresh');
    $('#txtCurrencyName').val(rowData.CurrencyName);
    $('#cboSymbol').val(rowData.Symbol);
    $('#cboSymbol').selectpicker('refresh');
    $('#txtDecimalPlaces').val(rowData.DecimalPlaces);
    var showInMillions = rowData.ShowInMillions;
    var symbolSuffixToAmount = rowData.SymbolSuffixToAmount;
    if (showInMillions === "true") {
        $("#chkShowInMilions").parent().addClass("is-checked");
    }
    else { $("#chkShowInMilions").parent().removeClass("is-checked"); }

    if (symbolSuffixToAmount === "true") {
        $("#chkSymbolSuffixToAmount").parent().addClass("is-checked");
    }
    else { $("#chkSymbolSuffixToAmount").parent().removeClass("is-checked"); }
    $('#txtDecimalPortionWord').val(rowData.DecimalPortionWord);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveCurrencyMaster").attr('disabled', false);
    $("#btnSaveCurrencyMaster").show();
    $("#btnDeactivateCurrencyMaster").hide();
}

function fnSaveCurrencyMaster() {
    if (ValidateCurrencyMaster() === false) {
        return;
    }
    var currency = {
        CurrencyCode: $("#cboCurrencyCode").val(),
        CurrencyName: $("#txtCurrencyName").val(),
        Symbol: $("#cboSymbol").val(),
        DecimalPlaces: $("#txtDecimalPlaces").val(),
        ShowInMillions: $('#chkShowInMilions').parent().hasClass("is-checked"),
        SymbolSuffixToAmount: $('#chkSymbolSuffixToAmount').parent().hasClass("is-checked"),
        DecimalPortionWord: $("#txtDecimalPortionWord").val(),
        ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked")
    };
    var URL = getBaseURL() + '/Currencies/InsertIntoCurrencyMaster';
    if (isUpdate == 1)
    {
        URL = getBaseURL() + '/Currencies/UpdateCurrencyMaster';
    }
 $("#btnSaveCurrencyMaster").attr('disabled', true);
    $.ajax({
        url: URL,
        type: 'POST',
        datatype: 'json',
        data: { currency },
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnSaveCurrencyMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                fnGridRefreshCurrencyMaster();
                $("#PopupCurrencyMaster").modal('hide');
                fnClearFields();
            }
            else {
                toastr.error(response.Message);
                $("#btnSaveCurrencyMaster").attr('disabled', false);
            }

        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnSaveCurrencyMaster").attr('disabled', false);
        }
    });
}

function ValidateCurrencyMaster() {

    if ($("#cboCurrencyCode").val() === '0') {
        toastr.warning("Please Select Currency Code");
        return false;
    }
    if (IsStringNullorEmpty($("#txtCurrencyName").val())) {
        toastr.warning("Please Enter Currency Name");
        return false;
    }
    if ($("#cboSymbol").val() === '0') {
        toastr.warning("Please Select Currency Symbol.");
        return false;
    }
    if (IsStringNullorEmpty($("#txtDecimalPlaces").val())) {
        toastr.warning("Please Enter Decimal Places");
        return false;
    }
    if (IsStringNullorEmpty($("#txtDecimalPortionWord").val())) {
        toastr.warning("Please Enter Decimal Portion Word");
        return false;
    }

}

function fnGridRefreshCurrencyMaster() {
    $("#jqgCurrencyMaster").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnViewCurrencyMaster(e) {
    if (_userFormRole.IsView === false) {
        toastr.warning("You are not Authorized to View");
        return;
    }
    var rowid = $("#jqgCurrencyMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCurrencyMaster').jqGrid('getRowData', rowid);
    $('#PopupCurrencyMaster').find('.modal-title').text(localization.ViewCurrencyDetails);
    $('#PopupCurrencyMaster').modal('show');
    $("#btnSaveCurrencyMaster,#btnDeactivateCurrencyMaster").hide();
    
    $('#cboCurrencyCode').val(rowData.CurrencyCode);
    $('#cboCurrencyCode').selectpicker('refresh');
    $('#txtCurrencyName').val(rowData.CurrencyName);
    $('#cboSymbol').val(rowData.Symbol);
    $('#cboSymbol').selectpicker('refresh');
    $('#txtDecimalPlaces').val(rowData.DecimalPlaces);

    var showInMillions = rowData.ShowInMillions;
    var symbolSuffixToAmount = rowData.SymbolSuffixToAmount;

    if (showInMillions === "true") {
        $("#chkShowInMilions").parent().addClass("is-checked");
    }
    else { $("#chkShowInMilions").parent().removeClass("is-checked"); }

    if (symbolSuffixToAmount === "true") {
        $("#chkSymbolSuffixToAmount").parent().addClass("is-checked");
    }
    else { $("#chkSymbolSuffixToAmount").parent().removeClass("is-checked"); }

    $('#txtDecimalPortionWord').val(rowData.DecimalPortionWord);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    $("#chkActiveStatus").prop('disabled', true);
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("input[id*=chk]").attr('disabled', true);
    $("#PopupCurrencyMaster").on('hidden.bs.modal', function () {
        $("#btnSaveCurrencyMaster").show();
        $("select").next().attr('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("input[id*=chk]").attr('disabled', false);

    });
}

function fnPopUpDeleteCurrencyMaster(e) {
    if (_userFormRole.IsDelete === false) {
        toastr.warning("You are not Authorized to Delete");
        return;
    }
    var rowid = $("#jqgCurrencyMaster").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCurrencyMaster').jqGrid('getRowData', rowid);
    $('#PopupCurrencyMaster').find('.modal-title').text("Active/De Active Currency Details");
    $('#PopupCurrencyMaster').modal('show');
    $("#btnSaveCurrencyMaster,#btnDeactivateCurrencyMaster").hide();

    $('#cboCurrencyCode').val(rowData.CurrencyCode);
    $('#cboCurrencyCode').selectpicker('refresh');
    $('#txtCurrencyName').val(rowData.CurrencyName);
    $('#cboSymbol').val(rowData.Symbol);
    $('#cboSymbol').selectpicker('refresh');
    $('#txtDecimalPlaces').val(rowData.DecimalPlaces);

    var showInMillions = rowData.ShowInMillions;
    var symbolSuffixToAmount = rowData.SymbolSuffixToAmount;

    if (showInMillions === "true") {
        $("#chkShowInMilions").parent().addClass("is-checked");
    }
    else { $("#chkShowInMilions").parent().removeClass("is-checked"); }

    if (symbolSuffixToAmount === "true") {
        $("#chkSymbolSuffixToAmount").parent().addClass("is-checked");
    }
    else { $("#chkSymbolSuffixToAmount").parent().removeClass("is-checked"); }

    $('#txtDecimalPortionWord').val(rowData.DecimalPortionWord);

    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
        $("#btnDeactivateCurrencyMaster").html(localization.DeActivate);
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
        $("#btnDeactivateCurrencyMaster").html(localization.Activate);
    }

   
    $("#btnDeactivateCurrencyMaster").show();
    $("#chkActiveStatus").prop('disabled', true);
    $("input,textarea").attr('readonly', true);
    $("select").next().attr('disabled', true);
    $("input[id*=chk]").attr('disabled', true);
    $("#PopupCurrencyMaster").on('hidden.bs.modal', function () {
        $("#btnSaveCurrencyMaster").show();
        $("select").next().attr('disabled', false);
        $("input,textarea").attr('readonly', false);
        $("input[id*=chk]").attr('disabled', false);

    });
}

function fnClearFields() {
    $('#cboCurrencyCode').attr('disabled', false);
    $('#cboCurrencyCode').val('0');
    $('#cboCurrencyCode').selectpicker('refresh');
    $("#txtCurrencyName").val("");
    $("#cboSymbol").val('0');
    $('#cboSymbol').selectpicker('refresh');
    $("#txtDecimalPlaces").val("");
    $("#txtDecimalPortionWord").val("");
    $('#chkSymbolSuffixToAmount').parent().removeClass('is-checked');
    $('#chkShowInMilions').parent().removeClass('is-checked');
    $("#chkActiveStatus").prop('disabled', false);
    $("#btnSaveCurrencyMaster").attr('disabled', false);
}

function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
    
}

function fnDeleteCurrencyMaster() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateCurrencyMaster").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Currencies/ActiveOrDeActiveCurrencyMaster?status=' + a_status + '&currency_code=' + $("#cboCurrencyCode").val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                toastr.success(response.Message);
                $("#btnDeactivateCurrencyMaster").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupCurrencyMaster').modal('hide');
                fnClearFields();
                fnGridRefreshCurrencyMaster();
                $("#btnDeactivateCurrencyMaster").attr("disabled", false);
            }
            else {
                toastr.error(response.Message);
                $("#btnDeactivateCurrencyMaster").attr("disabled", false);
                $("#btnDeactivateCurrencyMaster").html('De Activate');
            }
        },
        error: function (error) {
            toastr.error(error.statusText);
            $("#btnDeactivateCurrencyMaster").attr("disabled", false);
            $("#btnDeactivateCurrencyMaster").html('De Activate');
        }
    });
}


var currency_symbols = {
    'AED': 'د.إ',
    'AFN': '؋',
    'ALL': 'L',
    'AMD': '֏',
    'ANG': 'ƒ',
    'AOA': 'Kz',
    'ARS': '$',
    'AUD': '$',
    'AWG': 'ƒ',
    'AZN': '₼',
    'BAM': 'KM',
    'BBD': '$',
    'BDT': '৳',
    'BGN': 'лв',
    'BHD': '.د.ب',
    'BIF': 'FBu',
    'BMD': '$',
    'BND': '$',
    'BOB': '$b',
    'BRL': 'R$',
    'BSD': '$',
    'BTC': '฿',
    'BTN': 'Nu.',
    'BWP': 'P',
    'BYR': 'p.',
    'BZD': 'BZ$',
    'CAD': '$',
    'CDF': 'FC',
    'CHF': 'CHF',
    'CLP': '$',
    'CNY': '¥',
    'COP': '$',
    'CRC': '₡',
    'CUC': '$',
    'CUP': '₱',
    'CVE': '$',
    'CZK': 'Kč',
    'DJF': 'Fdj',
    'DKK': 'kr',
    'DOP': 'RD$',
    'DZD': 'دج',
    'EEK': 'kr',
    'EGP': 'EGP',
    'ERN': 'Nfk',
    'ETB': 'Br',
    'ETH': 'Ξ',
    'EUR': '€',
    'FJD': '$',
    'FKP': '£',
    'GBP': '£',
    'GEL': '₾',
    'GGP': '£',
    'GHC': '₵',
    'GHS': 'GH₵',
    'GIP': '£',
    'GMD': 'D',
    'GNF': 'FG',
    'GTQ': 'Q',
    'GYD': '$',
    'HKD': '$',
    'HNL': 'L',
    'HRK': 'kn',
    'HTG': 'G',
    'HUF': 'Ft',
    'IDR': 'Rp',
    'ILS': '₪',
    'IMP': '£',
    'INR': '₹',
    'IQD': 'ع.د',
    'IRR': '﷼',
    'ISK': 'kr',
    'JEP': '£',
    'JMD': 'J$',
    'JOD': 'JD',
    'JPY': '¥',
    'KES': 'KSh',
    'KGS': 'лв',
    'KHR': '៛',
    'KMF': 'CF',
    'KPW': '₩',
    'KRW': '₩',
    'KWD': 'KD',
    'KYD': '$',
    'KZT': 'лв',
    'LAK': '₭',
    'LBP': '£',
    'LKR': '₨',
    'LRD': '$',
    'LSL': 'M',
    'LTC': 'Ł',
    'LTL': 'Lt',
    'LVL': 'Ls',
    'LYD': 'LD',
    'MAD': 'MAD',
    'MDL': 'lei',
    'MGA': 'Ar',
    'MKD': 'ден',
    'MMK': 'K',
    'MNT': '₮',
    'MOP': 'MOP$',
    'MRO': 'UM',
    'MUR': '₨',
    'MVR': 'Rf',
    'MWK': 'MK',
    'MXN': '$',
    'MYR': 'RM',
    'MZN': 'MT',
    'NAD': 'N$',
    'NGN': '₦',
    'NIO': 'C$',
    'NOK': 'kr',
    'NPR': '₨',
    'NZD': '$',
    'OMR': '﷼',
    'PAB': 'B/.',
    'PEN': 'S/.',
    'PGK': 'K',
    'PHP': '₱',
    'PKR': '₨',
    'PLN': 'zł',
    'PYG': 'Gs',
    'QAR': '﷼',
    'RMB': '￥',
    'RON': 'lei',
    'RSD': 'Дин.',
    'RUB': '₽',
    'RWF': 'R₣',
    'SAR': '﷼',
    'SBD': '$',
    'SCR': '₨',
    'SDG': 'ج.س.',
    'SEK': 'kr',
    'SGD': '$',
    'SHP': '£',
    'SLL': 'Le',
    'SOS': 'S',
    'SRD': '$',
    'SSP': '£',
    'STD': 'Db',
    'SVC': '$',
    'SYP': '£',
    'SZL': 'E',
    'THB': '฿',
    'TJS': 'SM',
    'TMT': 'T',
    'TND': 'د.ت',
    'TOP': 'T$',
    'TRL': '₤',
    'TRY': '₺',
    'TTD': 'TT$',
    'TVD': '$',
    'TWD': 'NT$',
    'TZS': 'TSh',
    'UAH': '₴',
    'UGX': 'USh',
    'USD': '$',
    'UYU': '$U',
    'UZS': 'лв',
    'VEF': 'Bs',
    'VND': '₫',
    'VUV': 'VT',
    'WST': 'WS$',
    'XAF': 'FCFA',
    'XBT': 'Ƀ',
    'XCD': '$',
    'XOF': 'CFA',
    'XPF': '₣',
    'YER': '﷼',
    'ZAR': 'R',
    'ZWD': 'Z$'
};


