var Isadd = 0;
var Postedimg;
var postedImgName = 0;
var imgName;
var imgPath;
var imgUrl;
var actiontype = "";

$(document).ready(function () {
    fnGridLoadCountryCode();
    $.contextMenu({
        // define which elements trigger this menu
        selector: "#btnCountryCode",
        trigger: 'left',
        // define the elements of the menu
        items: {
            jqgEdit: { name: localization.Edit, icon: "edit", callback: function (key, opt) { fnEditCountryCode(event, 'edit') } },
            jqgView: { name: localization.View, icon: "view", callback: function (key, opt) { fnEditCountryCode(event, 'view') } },
            jqgDelete: { name: localization.Delete, icon: "delete", callback: function (key, opt) { fnEditCountryCode(event, 'delete') } },
        }
        // there's more, have a look at the demos and docs...
    });
    $(".context-menu-icon-edit").html("<span class='icon-contextMenu'><i class='fa fa-pen'></i>" + localization.Edit + " </span>");
    $(".context-menu-icon-view").html("<span class='icon-contextMenu'><i class='fa fa-eye'></i>" + localization.View + " </span>");
    $(".context-menu-icon-delete").html("<span class='icon-contextMenu'><i class='fa fa-trash'></i>" + localization.Delete + " </span>");
});

function fnGridLoadCountryCode() {
    $("#jqgCountryCode").jqGrid('GridUnload');
    $("#jqgCountryCode").jqGrid({
        url: getBaseURL() + '/Country/GetAllCountryCodes',
        mtype: 'Post',
        datatype: 'json',

        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, localization.CountryCode, localization.CountryName, "", localization.CurrencyName, "", localization.Flag, "", /*"", "",*/ "", "", "", "", "","","", localization.Active, localization.Actions],
        colModel: [
            { name: "Isdcode", width: 40, editable: true, align: 'left', hidden: false },
            { name: "CountryCode", width: 50, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "CountryName", width: 70, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "CurrencyCode", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "CurrencyName", width: 200, editable: false, hidden: false, align: 'left', resizable: true },
            { name: "ShowCountryFlag", width: 70, editable: true, edittype: 'image', formatter: getImage, hidden: true, editrules: { edithidden: true }, sortable: false },
            {
                name: 'CountryFlag',
                index: 'Isdcode',
                sortable: false,
                editable: true,
                edittype: 'file',
                hidden: false,
                editoptions: {
                    enctype: "multipart/form-data",

                    dataEvents: [{
                        type: 'change',
                        fn: function (e) {
                            var Filename = $('#ShowCountryFlag').attr('src').split('/').pop();
                            imgName = Filename;
                            var input = document.getElementById("CountryFlag");
                            var fReader = new FileReader();
                            fReader.readAsDataURL(input.files[0]);
                            fReader.onloadend = function (event) {
                                var img = document.getElementById("ShowCountryFlag");
                                img.src = event.target.result;
                            }
                        }
                    }]
                },
                width: 25,
                align: 'center',
                formatter: jgImageFormatter,
                search: false
            },

            { name: "MobileNumberPattern", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            //{ name: "Uidlabel", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            //{ name: "Uidpattern", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "Nationality", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "DateFormat", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ShortDateFormat", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "IsPoboxApplicable", editable: true, hidden: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "PoboxPattern", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "IsPinapplicable", editable: true, hidden: true, width: 45, align: 'center', resizable: false, edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" } },
            { name: "PincodePattern", width: 70, editable: false, hidden: true, align: 'left', resizable: true },
            { name: "ActiveStatus", width: 35, editable: true, align: 'center', edittype: "checkbox", formatter: 'checkbox', editoptions: { value: "true:false" }, formatoptions: { disabled: true } },
           
            {
                name: 'edit', search: false, align: 'left', width: 35, sortable: false, resizable: false,
                formatter: function (cellValue, options, rowdata, action) {
                    return '<button class="mr-1 btn btn-outline" id="btnCountryCode"><i class="fa fa-ellipsis-v"></i></button>'
                }
            },
        ],
        rowNum: 10,
        rowList: [10, 20, 50, 100],
        rownumWidth:'55',
        loadonce: true,
        pager: "#jqpCountryCode",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        scrollOffset: 0, caption: 'Country Code',

        loadComplete: function (data) {
            SetGridControlByAction(); fnJqgridSmallScreen("jqgCountryCode");
        },

        onSelectRow: function (rowid, status, e) {
           },

    }).jqGrid('navGrid', '#jqpCountryCode', { add: false, edit: false, search: false, del: false, refresh: false }).jqGrid('navButtonAdd', '#jqpCountryCode', {
        caption: '<span class="fa fa-sync"></span> Refresh', buttonicon: "none", id: "custRefresh", position: "first", onClickButton: fnGridRefreshCountryCode
    }).jqGrid('navButtonAdd', '#jqpCountryCode', {
        caption: '<span class="fa fa-plus" data-toggle="modal"></span> Add', buttonicon: 'none', id: 'jqgAdd', position: 'first', onClickButton: fnAddCountryCode
        });
    fnAddGridSerialNoHeading();
}

function jgImageFormatter(cellValue, options, rowObject) {
    var imageHtml = "<img id='countryflagimg' src='" + cellValue + "' originalValue='" + cellValue + "' />"
    return imageHtml;
}


function getImage(cellValue, options, rowObject) {
    var imageHtml = "<img id='img" + options.rowId + "' src='" + rowObject.CountryFlag + "' originalValue='" + rowObject.CountryFlag + "'  />"
    return imageHtml;
}

function fnAddCountryCode() {
    $('#divstatutorycode').hide();
    fnClearFields();
    Isadd = 1;
    $('#PopupCountryCode').modal('show');
    $('#PopupCountryCode').modal({ backdrop: 'static', keyboard: false });
    $('#PopupCountryCode').find('.modal-title').text(localization.AddCountry);
    $("#chkActiveStatus").parent().addClass("is-checked");
    $("#chkActiveStatus").prop('disabled', true);
    $("#btnSaveCountryCode").html('<i class="fa fa-save"></i> ' + localization.Save);
    $("#btnCancelCountryCode").html('<i class="fa fa-times"></i> ' + localization.Cancel);
    $("#btnSaveCountryCode").show();
    $("#btnDeactivateCountryCode").hide();
    fnUIDPatternGrid();
}

function fnEditCountryCode(e,actiontype) {

   
    var rowid = $("#jqgCountryCode").jqGrid('getGridParam', 'selrow');
    var rowData = $('#jqgCountryCode').jqGrid('getRowData', rowid);

    Isadd = 0;
    $('#txtIsdcode').val(rowData.Isdcode);
    $("#txtIsdcode").attr('disabled', true);
    $('#txtCountrycode').val(rowData.CountryCode);
    imgUrl = $('#img' + rowid).attr('src');
    var IMGurl = imgUrl;
    var IMGname = IMGurl.split('/').pop().split('?')[0].split('#')[0];

    $("#btnSaveCountryCode").html('<i class="fa fa-sync"></i>' + localization.Update);
    $("#btnCancelCountryCode").html('<i class="fa fa-times"></i>'+localization.Cancel);
    $('#cboflagImage').val(IMGname).trigger('change');
    $('#cboflagImage').selectpicker('refresh');
    $('#txtCountryName').val(rowData.CountryName);
    $('#cboCurrencycode').val(rowData.CurrencyCode);
    $('#cboCurrencycode').selectpicker('refresh');
    $('#txtMobileNumberPattern').val(rowData.MobileNumberPattern);
    //$('#txtUIDlabel').val(rowData.Uidlabel);
    //$('#txtUIDPattern').val(rowData.Uidpattern);
    $('#cboNationality').val(rowData.Nationality).selectpicker('refresh');
    $('#txtDateFormat').val(rowData.DateFormat);
    $('#txtShortDateFormat').val(rowData.ShortDateFormat);
    if (rowData.ActiveStatus == 'true') {
        $("#chkActiveStatus").parent().addClass("is-checked");
    }
    else {
        $("#chkActiveStatus").parent().removeClass("is-checked");
    }
    if (rowData.IsPoboxApplicable == 'true') {
        $("#chkIsPOBoxAppllicable").parent().addClass("is-checked");
    }
    else {
        $("#chkIsPOBoxAppllicable").parent().removeClass("is-checked");
    }

    $('#txtPOBoxPattern').val(rowData.PoboxPattern);
    if (rowData.IsPinapplicable == 'true') {
        $("#chkIsPinApplicable").parent().addClass("is-checked");
    }
    else {
        $("#chkIsPinApplicable").parent().removeClass("is-checked");
    }
    $('#txtPincodePattern').val(rowData.PincodePattern);
  
    $("#btnSaveCountryCode").attr('disabled', false);
    $('#divstatutorycode').show();
    fnUIDPatternGrid();
    if (actiontype.trim() == "edit") {

        if (_userFormRole.IsEdit === false) {
            fnAlert("w", "EPS_12_00", "UIC02", errorMsg.editauth_E2);
            return;
        }

        $('#PopupCountryCode').modal('show');

        $("#chkActiveStatus").prop('disabled', true);
        $('#PopupCountryCode').find('.modal-title').text(localization.UpdateCountry);
        $("#btnSaveCountryCode").html('<i class="fa fa-sync"></i>' + localization.Update);
        $("#btnDeactivateCountryCode").hide();
        $("#btnSaveCountryCode").show();
    }
    if (actiontype.trim() == "view") {
        if (_userFormRole.IsView === false) {
            fnAlert("w", "EPS_12_00", "UIC03", errorMsg.vieweauth_E3);
             return;
        }
        $('#PopupCountryCode').modal('show');

        $('#PopupCountryCode').find('.modal-title').text(localization.ViewCountry);
        $('#divstatutorycode').show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $("#btnSaveCountryCode,#btnDeactivateCountryCode").hide();
        $("#PopupCountryCode").on('hidden.bs.modal', function () {
            $("#btnSaveCountryCode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);

        })
    }

    if (actiontype.trim() == "delete") {
        if (_userFormRole.IsDelete === false) {
            fnAlert("w", "EPS_12_00", "UIC04", errorMsg.deleteauth_E4);
            return;
        }
        $('#PopupCountryCode').modal('show');

        $('#PopupCountryCode').find('.modal-title').text("Active/De Active Country Codes");
        if (rowData.ActiveStatus == 'true') {
            $("#btnDeactivateCountryCode").html(localization.DeActivate);
        }
        else {
            $("#btnDeactivateCountryCode").html(localization.Activate);
        }
        $("#btnDeactivateCountryCode").show();
        $('#divstatutorycode').show();
        $("#chkActiveStatus").prop('disabled', true);
        $("input,textarea").attr('readonly', true);
        $("select").next().attr('disabled', true);
        $("input[id*=chk]").attr('disabled', true);
        $("#btnSaveCountryCode").hide();
        $("#PopupCountryCode").on('hidden.bs.modal', function () {
            $("#btnSaveCountryCode").show();
            $("input,textarea").attr('readonly', false);
            $("select").next().attr('disabled', false);
            $("input[id*=chk]").attr('disabled', false);

        })
    }
}

function fnSaveCountryCode() {
   
    if (fnValidateCountryCode() === false) {
        return;
    }
    debugger;

    $("#jqgUIDPattern").jqGrid('editCell', 0, 0, false);

    var $grid = $("#jqgUIDPattern");
    var l_pattern = [];
    var ids = jQuery("#jqgUIDPattern").jqGrid('getDataIDs');
    for (var i = 0; i < ids.length; i++) {
        var rowId = ids[i];
        var rowData = jQuery('#jqgUIDPattern').jqGrid('getRowData', rowId);

        if (!IsStringNullorEmpty(rowData.Uidlabel) && !IsStringNullorEmpty(rowData.Uidpattern)) {
            l_pattern.push({
                Isdcode: $('#txtIsdcode').val(),
                Uidlabel: rowData.Uidlabel,
                Uidpattern: rowData.Uidpattern,
                ActiveStatus: rowData.ActiveStatus
            });
        }
    }

    if (Isadd === 1) {
        var country = {
            Isdcode: $('#txtIsdcode').val(),
            CountryCode: $("#txtCountrycode").val(),
            CountryName: $("#txtCountryName").val(),
            imgName: $("#cboflagImage").val(),
            CurrencyCode: $("#cboCurrencycode").val(),
            MobileNumberPattern: $("#txtMobileNumberPattern").val().trim(),
            //Uidlabel: $("#txtUIDlabel").val(),
            //Uidpattern: $("#txtUIDPattern").val(),
            Nationality: $("#cboNationality").val(),
            DateFormat: $("#txtDateFormat").val(),
            ShortDateFormat: $("#txtShortDateFormat").val(),
            IsPoboxApplicable: $("#chkIsPinApplicable").parent().hasClass("is-checked"),
            PoboxPattern: $("#txtPOBoxPattern").val(),
            IsPinapplicable: $("#chkIsPOBoxAppllicable").parent().hasClass("is-checked"),
            PincodePattern: $("#txtPincodePattern").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            _lstUIDpattern: l_pattern,
            Isadd: 1
        };
    }

    if (Isadd === 0) {
        var country = {
            Isdcode: $('#txtIsdcode').val(),
            CountryCode: $("#txtCountrycode").val(),
            CountryName: $("#txtCountryName").val(),
            imgName: $("#cboflagImage").val(),
            CurrencyCode: $("#cboCurrencycode").val(),
            MobileNumberPattern: $("#txtMobileNumberPattern").val().trim(),
            //Uidlabel: $("#txtUIDlabel").val(),
            //Uidpattern: $("#txtUIDPattern").val(),
            Nationality: $("#cboNationality").val(),
            DateFormat: $("#txtDateFormat").val(),
            ShortDateFormat: $("#txtShortDateFormat").val(),
            IsPoboxApplicable: $("#chkIsPinApplicable").parent().hasClass("is-checked"),
            PoboxPattern: $("#txtPOBoxPattern").val(),
            IsPinapplicable: $("#chkIsPOBoxAppllicable").parent().hasClass("is-checked"),
            PincodePattern: $("#txtPincodePattern").val(),
            ActiveStatus: $("#chkActiveStatus").parent().hasClass("is-checked"),
            _lstUIDpattern: l_pattern,
            Isadd: 0
        };
    }
    $("#btnSaveCountryCode").attr('disabled', true);
    $.ajax({
        url: getBaseURL() + '/Country/InsertOrUpdateCountryCodes',
        type: 'POST',
        datatype: 'json',
        data: { country },
        success: function (response) {
            if (response.Status === true) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnSaveCountryCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
           $("#btnSaveCountryCode").attr('disabled', false);
           $('#PopupCountryCode').modal('hide');
                fnClearFields();
                fnGridLoadCountryCode();
                return true;
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                 $("#btnSaveCountryCode").attr('disabled', false);
                return false;
           
            }

        }
    });
}

function fnValidateCountryCode() {

    if (IsStringNullorEmpty($("#txtIsdcode").val())) {
        fnAlert("w", "EPS_12_00", "UI0034", errorMsg.ISDCode_E6);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCountrycode").val())) {
        fnAlert("w", "EPS_12_00", "UI0035", errorMsg.CountryCode_E7);
        return false;
    }
    
    if ($("#cboflagImage").val() === '0' || $("#cboflagImage").val() === null) {
        fnAlert("w", "EPS_12_00", "UI0036", errorMsg.CountryFlag_E8);
        return false;
    }
    if (IsStringNullorEmpty($("#txtCountryName").val())) {
        fnAlert("w", "EPS_12_00", "UI0037", errorMsg.CountryName_E9);
        return false;
    }
   
    if ($("#cboCurrencycode").val() === "0" || $("#cboCurrencycode").val() === '0' || IsStringNullorEmpty($("#cboCurrencycode").val())) {
        fnAlert("w", "EPS_12_00", "UI0038", errorMsg.Currency_E10);
        return false;
    }
    if ($("#cboNationality").val() === "0" || $("#cboNationality").val() === '0' || IsStringNullorEmpty($("#cboNationality").val())) {
        fnAlert("w", "EPS_12_00", "UI0215", errorMsg.Country_E11);
        return false;
    }
}

function fnGridRefreshCountryCode() {
   $("#jqgCountryCode").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
}

function fnViewCountryCode(e) {
    var rowid = $(e.target).parents("tr.jqgrow").attr('id');
    var rowData = $('#jqgCountryCode').jqGrid('getRowData', rowid);
    Isadd = 0;
    $('#txtIsdcode').val(rowData.Isdcode);
    $("#txtIsdcode").attr('disabled', true);
    $('#txtCountrycode').val(rowData.CountryCode);
    imgUrl = $('#img' + rowid).attr('src');
    var IMGurl = imgUrl;
    var IMGname = IMGurl.split('/').pop().split('?')[0].split('#')[0];


    $('#cboflagImage').val(IMGname).trigger('change');
    $('#cboflagImage').selectpicker('refresh');
    $('#txtCountryName').val(rowData.CountryName);
    $('#cboCurrencycode').val(rowData.CurrencyCode);
    $('#cboCurrencycode').selectpicker('refresh');
    $('#txtMobileNumberPattern').val(rowData.MobileNumberPattern);
    //$('#txtUIDlabel').val(rowData.Uidlabel);
    //$('#txtUIDPattern').val(rowData.Uidpattern);
    $('#cboNationality').val(rowData.Nationality).selectpicker('refresh');
    $('#txtDateFormat').val(rowData.DateFormat);
    $('#txtShortDateFormat').val(rowData.ShortDateFormat);
    $('#cboActiveStatus').val(rowData.ActiveStatus);
    $('#cboActiveStatus').selectpicker('refresh');
    if (rowData.IsPoboxApplicable == 'true') {
        $("#chkIsPOBoxAppllicable").parent().addClass("is-checked");
    }
    else {
        $("#chkIsPOBoxAppllicable").parent().removeClass("is-checked");
    }

    $('#txtPOBoxPattern').val(rowData.PoboxPattern);
    if (rowData.IsPinapplicable == 'true') {
        $("#chkIsPinApplicable").parent().addClass("is-checked");
    }
    else {
        $("#chkIsPinApplicable").parent().removeClass("is-checked");
    }
    $('#txtPincodePattern').val(rowData.PincodePattern);
    $('#PopupCountryCode').modal('show');
    
}

function fnClearFields() {
   
    $("#txtIsdcode").val('');
    $("#txtIsdcode").attr('disabled', false);
    $("#txtCountrycode").val('');
    $("#cboflagImage").val('0').trigger('change');
    $('#cboflagImage').selectpicker('refresh');
    $("#txtCountryName").val('');
    $("#cboCurrencycode").val('0');
    $("#cboCurrencycode").selectpicker('refresh');
    $("#txtMobileNumberPattern").val('');
    //$("#txtUIDlabel").val('');
    //$("#txtUIDPattern").val('');
    $("#cboNationality").val('0').selectpicker('refresh');
    $("#txtDateFormat").val('');
    $("#txtShortDateFormat").val('');
    $("#chkActiveStatus").prop('disabled', false);
    $("#chkIsPOBoxAppllicable").parent().removeClass("is-checked");
    $("#txtPOBoxPattern").val('');
    $("#chkIsPinApplicable").parent().removeClass("is-checked");
    $("#txtPincodePattern").val('');
    $("#btnSaveCountryCode").attr('disabled', false);
}
function fnDeleteCountryCodes() {

    var a_status;
    //Activate or De Activate the status
    if ($("#chkActiveStatus").parent().hasClass("is-checked") === true) {
        a_status = false
    }
    else {
        a_status = true;
    }
    $("#btnDeactivateCountryCode").attr("disabled", true);
    $.ajax({
        url: getBaseURL() + '/Country/ActiveOrDeActiveCountryCode?status=' + a_status + '&Isd_code=' + $('#txtIsdcode').val(),
        type: 'POST',
        success: function (response) {
            if (response.Status) {
                fnAlert("s", "", response.StatusCode, response.Message);
                $("#btnDeactivateCountryCode").html('<i class="fa fa-spinner fa-spin"></i> wait');
                $('#PopupCountryCode').modal('hide');
                fnClearFields();
                fnGridRefreshCountryCode();
                $("#btnDeactivateCountryCode").attr("disabled", false);
            }
            else {
                fnAlert("e", "", response.StatusCode, response.Message);
                $("#btnDeactivateCountryCode").attr("disabled", false);
                $("#btnDeactivateCountryCode").html(localization.DeActivate);
            }
        },
        error: function (error) {
            fnAlert("e", "", error.StatusCode, error.statusText);
            $("#btnDeactivateCountryCode").attr("disabled", false);
            $("#btnDeactivateCountryCode").html(localization.DeActivate);
        }
    });
}
function SetGridControlByAction() {
    $('#jqgAdd').removeClass('ui-state-disabled');
   
    if (_userFormRole.IsInsert === false) {
        $('#jqgAdd').addClass('ui-state-disabled');
    }
   
}


function fnUIDPatternGrid() {
    $("#jqgUIDPattern").jqGrid('GridUnload');
    $("#jqgUIDPattern").jqGrid({
        url: getBaseURL() + '/Country/GetUIDPatternbyIsdcode?Isdcode=' + $('#txtIsdcode').val(),
        mtype: 'POST',
        datatype: 'json',
        ajaxGridOptions: { contentType: 'application/json; charset=utf-8' },
        jsonReader: { repeatitems: false, root: "rows", page: "page", total: "total", records: "records" },
        colNames: [localization.ISDCode, "UIDlabel", "UIDPattern", localization.Active],
        colModel: [
            { name: "Isdcode", width: 40, editable: false, align: 'left', hidden: true },
            { name: "Uidlabel", width: 200, editable: true, hidden: false, align: 'left', resizable: true, editoptions: { maxlength: 50 } },
            { name: "Uidpattern", width: 200, editable: true, hidden: false, align: 'left', resizable: true, editoptions: { maxlength: 20 } },
            {
                name: "ActiveStatus", width: 150, editable: true, hidden: false, align: 'center', resizable: true, formatter: "checkbox", formatoptions: { disabled: false },
                edittype: "checkbox", editoptions: { value: "true:false"}},
        ],
        rowNum: 10,
        rowList: [],
        pgbuttons: false,
        pgtext:null,
        rownumWidth: '55',
        loadonce: true,
        pager: "#jqpUIDPattern",
        viewrecords: true,
        gridview: true,
        rownumbers: true,
        height: 'auto',
        align: "left",
        width: 'auto',
        autowidth: true,
        shrinkToFit: true,
        forceFit: true,
        caption:"UID Pattern",
        scrollOffset: 0, 
        editurl: getBaseURL() + '',
        beforeSubmit: function (postdata, formid) {
            return [success, message];
        },
        ondblClickRow: function (rowid) {
        },
        loadComplete: function (data) {
            $("#jqgUIDPattern").setGridParam({ datatype: 'json', page: 1 }).trigger('reloadGrid');
            $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', '100%');
            fnJqgridSmallScreen("#jqgUIDPattern");
        },
    }).jqGrid('navGrid', '#jqpUIDPattern', { add: false, edit: false, search: false, del: false, refresh: false })

    $("#jqgUIDPattern").jqGrid('inlineNav', '#jqpUIDPattern',
        {
            edit: true,
            editicon: " fa fa-pen",
            edittext: " Edit",
            add: true,
            addicon: "fa fa-plus",
            addtext: " Add",
            save: true,
            savetext: " Save",
            saveicon: "fa fa-save",
            cancelicon: "fa fa-ban",
            canceltext: " Cancel",
            cancel:true,
            editParams: {
                keys: false,
                oneditfunc: function (rowID) {
                    $("[id*='1_Uidlabel']").attr('disabled', true);
                    //$("#jqgUIDPattern").jqGrid('setColProp', 'Uidlabel' , { editable: false }); 
                }
            },
            addParams: {
                useDefValues: true,
                position: "last",
                addRowParams: {
                    keys: true,
                    oneditfunc: function (rowID) {
                        $(this).jqGrid('setColProp', 'Uidlabel', { editable: true }); 
                        
                    }
                },
                aftersavefun: null,
                errorfun: null,
                afterrestorefun: null,
                restoreAfterError: false,
                
            }
        });
}

$(".modal").on('shown.bs.modal', function (e) {
    $(".ui-jqgrid-htable,.ui-jqgrid-btable,.ui-jqgrid-hdiv,.ui-jqgrid-bdiv,.ui-jqgrid-view,.ui-jqgrid,.ui-jqgrid-pager").css('width', '100%');
    fnJqgridSmallScreen("#jqgUIDPattern");
});



